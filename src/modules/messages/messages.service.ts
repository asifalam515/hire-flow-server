import { GoogleGenerativeAI } from '@google/generative-ai';
import * as messageRepo from './messages.repository';
import { AppError } from '../../utils/AppError';
import { env } from '../../config/env';
import { MessageType } from '@prisma/client';
import { getCandidateProfileByUserId } from '../candidates/candidates.repository';
import { findJobByIdRecord } from '../jobs/jobs.repository';
import { evaluateAtsMatch } from '../candidates/atsScorer.service';

export const getUserConversations = async (userId: string) => {
  return messageRepo.getConversationsByUserId(userId);
};

export const getConversationMessages = async (userId: string, conversationId: string) => {
  const conversation = await messageRepo.getConversationById(conversationId);
  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  if (conversation.candidateId !== userId && conversation.recruiterId !== userId) {
    throw new AppError('You are not a participant of this conversation', 403);
  }

  return messageRepo.getMessagesByConversationId(conversationId);
};

export const findOrCreateConversation = async (candidateId: string, recruiterId: string, companyId?: string) => {
  let conversation = await messageRepo.getConversationByParticipants(candidateId, recruiterId);
  if (!conversation) {
    conversation = await messageRepo.createConversation(candidateId, recruiterId, companyId);
  }
  return conversation;
};

export const sendMessage = async (userId: string, data: {
  conversationId: string;
  type?: MessageType;
  content?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: string;
  audioDuration?: string;
}) => {
  const conversation = await messageRepo.getConversationById(data.conversationId);
  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  if (conversation.candidateId !== userId && conversation.recruiterId !== userId) {
    throw new AppError('You are not a participant of this conversation', 403);
  }

  return messageRepo.createMessage({
    ...data,
    senderId: userId
  });
};

export const markAsRead = async (userId: string, conversationId: string) => {
  const conversation = await messageRepo.getConversationById(conversationId);
  if (!conversation) {
    throw new AppError('Conversation not found', 404);
  }

  if (conversation.candidateId !== userId && conversation.recruiterId !== userId) {
    throw new AppError('You are not a participant of this conversation', 403);
  }

  await messageRepo.markMessagesAsRead(conversationId, userId);
  return { success: true };
};

export const generateAiPitch = async (userId: string, jobId: string) => {
  const profile = await getCandidateProfileByUserId(userId);
  if (!profile) {
    throw new AppError('Candidate profile not found', 404);
  }

  const job = await findJobByIdRecord(jobId);
  if (!job) {
    throw new AppError('Job not found', 404);
  }

  const recruiter = await messageRepo.findFirstRecruiterForCompany(job.companyId);
  if (!recruiter) {
    throw new AppError('No recruiter found for this company', 404);
  }

  let matchScore = 75;
  try {
    const atsResult = await evaluateAtsMatch(
      {
        skills: profile.skills,
        aboutMe: profile.aboutMe,
        workExperiences: profile.workExperiences,
        educations: profile.educations,
      },
      {
        id: job.id,
        title: job.title,
        description: job.description,
        softwareSkills: job.softwareSkills,
        candidateExperience: job.candidateExperience,
        educationLevel: job.educationLevel,
      }
    );
    matchScore = atsResult.overallScore;
  } catch (err) {
    console.warn('Could not calculate exact ATS score for pitch, using default:', err);
  }

  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  let pitchData = {
    subject: `Application & Introduction: ${job.title} - ${profile.user.firstName || 'Candidate'}`,
    pitch: `Hi ${recruiter.firstName || 'Hiring Manager'},\n\nI came across the ${job.title} position at ${job.company.name} and was immediately drawn to your engineering vision.\n\nWith proven experience across ${(profile.skills || []).slice(0, 3).join(', ') || 'modern software engineering'} and a ${matchScore}% ATS compatibility fit for this role, I have engineered and deployed scalable systems with measurable reliability.\n\nI would love to learn more about the team's roadmap. Would you be open to a brief 10-minute introductory conversation this week?\n\nBest regards,\n${profile.user.firstName || ''} ${profile.user.lastName || ''}`.trim(),
    highlightedSkills: (profile.skills || []).slice(0, 4),
  };

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `You are an elite career coach writing a high-converting cold outreach pitch message from a candidate to a recruiter.

JOB DETAILS:
Title: ${job.title}
Company: ${job.company.name}
Required Skills: ${job.softwareSkills.join(', ') || 'Software Engineering'}
Description Summary: ${(job.description || '').slice(0, 800)}

CANDIDATE:
Name: ${profile.user.firstName || ''} ${profile.user.lastName || ''}
Skills: ${profile.skills.join(', ') || 'Not specified'}
Summary: ${profile.aboutMe || ''}
ATS Compatibility Match Score: ${matchScore}%
Recruiter Name: ${recruiter.firstName || 'Hiring Manager'}

Write a concise, professional 3-paragraph outreach message:
1. Hook: Enthusiastic opening addressing the recruiter by first name, citing genuine interest in the role and company.
2. Value Proposition: Highlight 2-3 overlapping skills matching the job requirements, referencing strong technical alignment (${matchScore}% ATS match).
3. Call To Action: Polite, low-friction invitation for a quick 10-minute sync.

Return STRICTLY valid JSON with no markdown and no backticks:
{
  "subject": "...",
  "pitch": "...",
  "highlightedSkills": ["...", "..."]
}`;

      const res = await model.generateContent(prompt);
      const text = res.response.text().trim();
      const cleanJson = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed = JSON.parse(cleanJson);
      if (parsed.pitch) {
        pitchData = {
          subject: parsed.subject || pitchData.subject,
          pitch: parsed.pitch,
          highlightedSkills: Array.isArray(parsed.highlightedSkills) ? parsed.highlightedSkills : pitchData.highlightedSkills,
        };
      }
    } catch (err) {
      console.warn('Gemini pitch generation error, using fallback:', err);
    }
  }

  return {
    ...pitchData,
    targetRecruiter: recruiter,
    company: job.company,
    matchScore,
    jobTitle: job.title,
    jobId: job.id,
  };
};
