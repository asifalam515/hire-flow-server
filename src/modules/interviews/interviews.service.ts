import { AccessToken } from 'livekit-server-sdk';
import { Role, ApplicationStatus } from '@prisma/client';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { JwtPayload } from '../../middlewares/auth.middleware';
import {
  createInterviewRoomRecord,
  findInterviewRoomByIdRecord,
  findInterviewRoomByApplicationIdRecord,
  findApplicationForInterviewRecord,
  updateInterviewRoomStatusRecord,
  updateInterviewRoomNotesRecord,
} from './interviews.repository';
import { updateApplicationStatus } from '../applications/application.repository';
import { triggerApplicationUpdateNotification } from '../notifications/notifications.service';
import { ScheduleInterviewInput, UpdateNotesInput, UpdateStatusInput } from './interviews.validation';

// ---------------------------------------------------------------------------
// Interviews Service (Pure Arrow Functions)
// ---------------------------------------------------------------------------

/**
 * Recruiter schedules an interview session for a candidate application.
 * Verifies tenant ownership, transitions application status to INTERVIEW, and notifies candidate.
 */
export const scheduleInterview = async (user: JwtPayload, input: ScheduleInterviewInput) => {
  if (user.role !== Role.RECRUITER && user.role !== Role.ADMIN) {
    throw new AppError('Access denied. Only recruiters and admins can schedule interviews.', 403);
  }

  const application = await findApplicationForInterviewRecord(input.applicationId);
  if (!application) {
    throw new AppError('Application not found.', 404);
  }

  // Tenant Isolation Check
  if (user.role === Role.RECRUITER && application.job.companyId !== user.companyId) {
    throw new AppError(
      'Tenant Isolation Error: You can only schedule interviews for jobs posted by your company.',
      403,
    );
  }

  // Transition application status to INTERVIEW if currently in earlier stage
  if (application.status !== ApplicationStatus.INTERVIEW) {
    await updateApplicationStatus(input.applicationId, ApplicationStatus.INTERVIEW);
  }

  // Generate deterministic room name
  const roomName = `room_${input.applicationId.replace(/-/g, '').slice(0, 12)}_${Date.now().toString(36)}`;

  const room = await createInterviewRoomRecord({
    applicationId: input.applicationId,
    liveKitRoomName: roomName,
    scheduledAt: new Date(input.scheduledAt),
    recruiterNotes: input.recruiterNotes ?? null,
  });

  // Notify Candidate via push/in-app notification
  if (application.candidate?.user?.id) {
    triggerApplicationUpdateNotification(
      application.candidate.user.id,
      application.job.company.name,
      application.job.title,
      ApplicationStatus.INTERVIEW,
      `/candidates/applications`,
    ).catch((err) => {
      console.error('Failed to notify candidate about scheduled interview:', err);
    });
  }

  return room;
};

/**
 * Fetch interview room details for an application with role-based access verification.
 */
export const getInterviewRoomByApplication = async (user: JwtPayload, applicationId: string) => {
  const application = await findApplicationForInterviewRecord(applicationId);
  if (!application) {
    throw new AppError('Application not found.', 404);
  }

  const isCandidate = application.candidate.user.id === user.id;
  const isRecruiter = user.role === Role.RECRUITER && application.job.companyId === user.companyId;
  const isAdmin = user.role === Role.ADMIN;

  if (!isCandidate && !isRecruiter && !isAdmin) {
    throw new AppError('Access denied. You are not authorized to view this interview room.', 403);
  }

  const room = await findInterviewRoomByApplicationIdRecord(applicationId);
  return room;
};

/**
 * Generates an authorized LiveKit WebRTC AccessToken for joining the video interview room.
 */
export const generateLiveKitToken = async (user: JwtPayload, applicationId: string) => {
  const application = await findApplicationForInterviewRecord(applicationId);
  if (!application) {
    throw new AppError('Application not found.', 404);
  }

  // Authorization Check
  const isCandidate = application.candidate.user.id === user.id;
  const isRecruiter = user.role === Role.RECRUITER && application.job.companyId === user.companyId;
  const isAdmin = user.role === Role.ADMIN;

  if (!isCandidate && !isRecruiter && !isAdmin) {
    throw new AppError('Access denied. You are not a participant in this interview.', 403);
  }

  // Find or auto-provision room if accessed by the recruiter
  let room = await findInterviewRoomByApplicationIdRecord(applicationId);

  if (!room) {
    if (isRecruiter || isAdmin) {
      const roomName = `room_${applicationId.replace(/-/g, '').slice(0, 12)}_${Date.now().toString(36)}`;
      room = await createInterviewRoomRecord({
        applicationId,
        liveKitRoomName: roomName,
        scheduledAt: new Date(),
      });
    } else {
      throw new AppError('An interview has not yet been scheduled for this application.', 400);
    }
  }

  if (!room) {
    throw new AppError('Unable to resolve interview room.', 500);
  }

  const identity = user.id;
  const participantName = user.role === Role.RECRUITER ? 'Recruiter' : 'Candidate';

  const at = new AccessToken(env.LIVEKIT_API_KEY, env.LIVEKIT_API_SECRET, {
    identity,
    name: participantName,
    metadata: JSON.stringify({
      role: user.role,
      companyId: user.companyId ?? null,
      applicationId,
    }),
  });

  at.addGrant({
    roomJoin: true,
    room: room.liveKitRoomName,
    canPublish: true,
    canSubscribe: true,
    canPublishData: true,
  });

  const token = await at.toJwt();

  return {
    token,
    serverUrl: env.LIVEKIT_URL,
    roomName: room.liveKitRoomName,
    room,
  };
};

/**
 * Recruiter updates private interview notes during or after the session.
 */
export const updateInterviewNotes = async (user: JwtPayload, id: string, input: UpdateNotesInput) => {
  if (user.role !== Role.RECRUITER && user.role !== Role.ADMIN) {
    throw new AppError('Access denied. Only recruiters can update interview notes.', 403);
  }

  const room = await findInterviewRoomByIdRecord(id);
  if (!room) {
    throw new AppError('Interview room not found.', 404);
  }

  if (user.role === Role.RECRUITER && room.application.job.companyId !== user.companyId) {
    throw new AppError('Tenant Isolation Error: You can only edit notes for your company candidates.', 403);
  }

  return updateInterviewRoomNotesRecord(id, input.recruiterNotes);
};

/**
 * Update interview status (e.g. IN_PROGRESS, COMPLETED, CANCELLED).
 */
export const updateInterviewStatus = async (user: JwtPayload, id: string, input: UpdateStatusInput) => {
  if (user.role !== Role.RECRUITER && user.role !== Role.ADMIN) {
    throw new AppError('Access denied. Only recruiters can update interview status.', 403);
  }

  const room = await findInterviewRoomByIdRecord(id);
  if (!room) {
    throw new AppError('Interview room not found.', 404);
  }

  if (user.role === Role.RECRUITER && room.application.job.companyId !== user.companyId) {
    throw new AppError('Tenant Isolation Error: You can only update interviews for your own company.', 403);
  }

  return updateInterviewRoomStatusRecord(id, input.status);
};
