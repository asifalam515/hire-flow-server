import { Request, Response } from 'express';
import * as candidateService from './candidates.service';

export const getResumeController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const resume = await candidateService.getResume(userId);

  res.status(200).json({
    success: true,
    data: resume,
  });
};

export const updateResumeProfileController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const updatedResume = await candidateService.updateResumeProfile(userId, req.body);

  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: updatedResume,
  });
};

export const addWorkExperienceController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const experience = await candidateService.addWorkExperience(userId, req.body);

  res.status(201).json({
    success: true,
    message: 'Work experience added successfully',
    data: experience,
  });
};

export const updateWorkExperienceController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const experience = await candidateService.updateWorkExperience(userId, id, req.body);

  res.status(200).json({
    success: true,
    message: 'Work experience updated successfully',
    data: experience,
  });
};

export const deleteWorkExperienceController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  await candidateService.deleteWorkExperience(userId, id);

  res.status(200).json({
    success: true,
    message: 'Work experience deleted successfully',
  });
};

export const addEducationController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const education = await candidateService.addEducation(userId, req.body);

  res.status(201).json({
    success: true,
    message: 'Education added successfully',
    data: education,
  });
};

export const updateEducationController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  const education = await candidateService.updateEducation(userId, id, req.body);

  res.status(200).json({
    success: true,
    message: 'Education updated successfully',
    data: education,
  });
};

export const deleteEducationController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { id } = req.params;
  await candidateService.deleteEducation(userId, id);

  res.status(200).json({
    success: true,
    message: 'Education deleted successfully',
  });
};

export const downloadResumePdfController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const profile = await candidateService.getResume(userId);

  if (!profile) {
    res.status(404).json({ success: false, message: 'Profile not found' });
    return;
  }

  const { generateResumePdfService } = await import('./pdfGenerator.service');
  const pdfBuffer = await generateResumePdfService(profile as any);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="resume_${profile.user.firstName || 'candidate'}.pdf"`);
  res.send(pdfBuffer);
};

export const generateAiResumePdfController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const profile = await candidateService.getResume(userId);

  if (!profile) {
    res.status(404).json({ success: false, message: 'Profile not found' });
    return;
  }

  const { enhanceResumeData } = await import('./aiResume.service');
  const enhancedProfile = await enhanceResumeData(profile);

  const { generateResumePdfService } = await import('./pdfGenerator.service');
  const pdfBuffer = await generateResumePdfService(enhancedProfile as any);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="ai_resume_${profile.user.firstName || 'candidate'}.pdf"`);
  res.send(pdfBuffer);
};
export const getCandidateApplicationsController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { status } = req.query;
  const applications = await candidateService.getCandidateApplications(userId, status as any);

  res.status(200).json({
    success: true,
    data: applications,
  });
};

export const getCandidateFollowedCompaniesController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const companies = await candidateService.getCandidateFollowedCompanies(userId);

  res.status(200).json({
    success: true,
    data: companies,
  });
};

export const followCompanyController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { companyId } = req.body;
  const followed = await candidateService.followCompany(userId, companyId);

  res.status(201).json({
    success: true,
    data: followed,
  });
};

export const unfollowCompanyController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const { companyId } = req.params;
  await candidateService.unfollowCompany(userId, companyId);

  res.status(200).json({
    success: true,
    message: 'Unfollowed company',
  });
};

export const updateOfferedJobPreferencesController = async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const preferences = await candidateService.updateOfferedJobPreferences(userId, req.body);

  res.status(200).json({
    success: true,
    message: 'Preferences updated successfully',
    data: preferences,
  });
};
