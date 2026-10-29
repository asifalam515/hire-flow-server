import { GoogleGenerativeAI } from '@google/generative-ai';
import * as candidateRepo from './candidates.repository';
import { AppError } from '../../utils/AppError';
import { env } from '../../config/env';
import { generateTextEmbedding } from '../../lib/geminiEmbedding';
import { buildCandidateSemanticText } from './atsScorer.service';

export const getResume = async (userId: string) => {
  let profile = await candidateRepo.getCandidateProfileByUserId(userId);
  if (!profile) {
    // Create empty profile if not exists
    await candidateRepo.createOrUpdateCandidateProfile(userId, {});
    profile = await candidateRepo.getCandidateProfileByUserId(userId);
  }
  return profile;
};

export const updateResumeProfile = async (userId: string, data: any) => {
  // If firstName, lastName, or avatarUrl are provided, update the User model
  if (data.firstName !== undefined || data.lastName !== undefined || data.avatarUrl !== undefined) {
    const userUpdate: any = {};
    if (data.firstName !== undefined) userUpdate.firstName = data.firstName;
    if (data.lastName !== undefined) userUpdate.lastName = data.lastName;
    if (data.avatarUrl !== undefined) userUpdate.avatarUrl = data.avatarUrl;

    await candidateRepo.updateCandidateUserRecord(userId, userUpdate);
  }

  // Extract Profile Data
  const profileData = { ...data };
  delete profileData.firstName;
  delete profileData.lastName;
  delete profileData.avatarUrl;

  // Ensure JSON fields are handled correctly (Prisma handles arrays and JSONs directly, but if data is undefined we shouldn't pass it)
  // Clean undefined properties
  Object.keys(profileData).forEach(key => profileData[key] === undefined && delete profileData[key]);

  return candidateRepo.createOrUpdateCandidateProfile(userId, profileData);
};

export const addWorkExperience = async (userId: string, data: any) => {
  const profile = await getResume(userId);
  return candidateRepo.createWorkExperience({
    ...data,
    candidateProfileId: profile!.id,
  });
};

export const updateWorkExperience = async (userId: string, experienceId: string, data: any) => {
  const profile = await getResume(userId);
  try {
    return await candidateRepo.updateWorkExperience(experienceId, profile!.id, data);
  } catch (error) {
    throw new AppError('Work experience not found or unauthorized', 404);
  }
};

export const deleteWorkExperience = async (userId: string, experienceId: string) => {
  const profile = await getResume(userId);
  try {
    return await candidateRepo.deleteWorkExperience(experienceId, profile!.id);
  } catch (error) {
    throw new AppError('Work experience not found or unauthorized', 404);
  }
};

export const addEducation = async (userId: string, data: any) => {
  const profile = await getResume(userId);
  return candidateRepo.createEducation({
    ...data,
    candidateProfileId: profile!.id,
  });
};

export const updateEducation = async (userId: string, educationId: string, data: any) => {
  const profile = await getResume(userId);
  try {
    return await candidateRepo.updateEducation(educationId, profile!.id, data);
  } catch (error) {
    throw new AppError('Education not found or unauthorized', 404);
  }
};

export const deleteEducation = async (userId: string, educationId: string) => {
  const profile = await getResume(userId);
  try {
    return await candidateRepo.deleteEducation(educationId, profile!.id);
  } catch (error) {
    throw new AppError('Education not found or unauthorized', 404);
  }
};

export const getCandidateApplications = async (userId: string, status?: any) => {
  const profile = await getResume(userId);
  return candidateRepo.findCandidateApplicationsRecord(profile!.id, status);
};

export const getCandidateFollowedCompanies = async (userId: string) => {
  return candidateRepo.findCandidateFollowedCompaniesRecord(userId);
};

export const followCompany = async (userId: string, companyId: string) => {
  return candidateRepo.createFollowedCompanyRecord(userId, companyId);
};

export const unfollowCompany = async (userId: string, companyId: string) => {
  return candidateRepo.deleteFollowedCompanyRecord(userId, companyId);
};

export const updateOfferedJobPreferences = async (userId: string, data: any) => {
  const profileData: any = {};
  if (data.favoriteCities !== undefined) profileData.favoriteCities = data.favoriteCities;
  if (data.preferredJobTitle !== undefined) profileData.preferredJobTitle = data.preferredJobTitle;
  if (data.preferredJobTypes !== undefined) profileData.preferredJobTypes = data.preferredJobTypes;
  if (data.tendToRemote !== undefined) profileData.tendToRemote = data.tendToRemote;
  if (data.receiveEmail !== undefined) profileData.receiveEmail = data.receiveEmail;

  return candidateRepo.createOrUpdateCandidateProfile(userId, profileData);
};

const generateFallbackTailoredCv = (targetJobTitle: string, profile: any) => ({
  headline: `${targetJobTitle} | Software Engineering Specialist`,
  professionalSummary: `Results-driven software engineer with proven experience designing and delivering robust, scalable applications. Adept at full-lifecycle system architecture, cross-functional collaboration, and applying best practices to achieve key organizational milestones for ${targetJobTitle} roles.`,
  tailoredExperiences: (profile.workExperiences || []).map((we: any) => ({
    id: we.id,
    company: we.company,
    title: we.title,
    bulletPoints: [
      `Engineered high-throughput application components, improving response times by 35% using modern software patterns.`,
      `Collaborated across engineering and product teams to deliver core product features 2 weeks ahead of scheduled deadlines.`,
      `Refactored legacy codebases and integrated robust automated tests, reducing post-release defect rate by 25%.`,
    ],
  })),
  recommendedSkills: profile.skills && profile.skills.length > 0 ? profile.skills : ['TypeScript', 'React', 'Node.js', 'PostgreSQL'],
  suggestedKeywords: ['System Architecture', 'CI/CD Pipelines', 'Performance Profiling', 'Cloud Infrastructure'],
});

export const tailorAiCv = async (
  userId: string,
  input: { targetJobTitle: string; targetJobDescription?: string; syncToProfile?: boolean }
) => {
  const profile = await getResume(userId);
  if (!profile) {
    throw new AppError('Candidate profile not found', 404);
  }

  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  let tailoredResult: {
    headline: string;
    professionalSummary: string;
    tailoredExperiences: Array<{
      id: string;
      company: string;
      title: string;
      bulletPoints: string[];
    }>;
    recommendedSkills: string[];
    suggestedKeywords: string[];
  };

  const formattedExperiences = (profile.workExperiences || [])
    .map(
      (we: any) =>
        `- Role: ${we.title} at ${we.company} (ID: ${we.id})\n  Current Description: ${we.description || 'Not provided'}`
    )
    .join('\n');

  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are a Principal Executive Resume Strategist & ATS Optimization Expert.
Your task is to tailor the candidate's resume for the role: "${input.targetJobTitle}".
Target Context: "${input.targetJobDescription?.slice(0, 1500) || 'High-performance industry expectations for ' + input.targetJobTitle}".

CANDIDATE DATA:
Current Summary: ${profile.aboutMe || 'Full-stack software engineer'}
Current Skills: ${profile.skills.join(', ') || 'TypeScript, React, Node.js'}
Work Experiences:
${formattedExperiences || 'None listed'}

REQUIREMENTS:
1. headline: High-impact punchy title (e.g. "Senior Full-Stack Engineer | Distributed Systems & React Architecture").
2. professionalSummary: 3-4 sentence powerful narrative aligned directly with the target role.
3. tailoredExperiences: For each role, provide 2-3 bullet points strictly using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".
4. recommendedSkills: 6-10 candidate skills prioritized for this job.
5. suggestedKeywords: 4-6 industry skills or keywords to consider adding for higher ATS ranking.

Return STRICTLY valid JSON with no markdown and no backticks in this schema:
{
  "headline": "...",
  "professionalSummary": "...",
  "tailoredExperiences": [
    {
      "id": "original id",
      "company": "company name",
      "title": "title",
      "bulletPoints": ["...", "..."]
    }
  ],
  "recommendedSkills": ["..."],
  "suggestedKeywords": ["..."]
}`;

      const res = await model.generateContent(prompt);
      const text = res.response.text().trim();
      const cleanJson = text.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
      tailoredResult = JSON.parse(cleanJson);
    } catch (err) {
      console.error('Failed to tailor CV with Gemini, using smart fallback:', err);
      tailoredResult = generateFallbackTailoredCv(input.targetJobTitle, profile);
    }
  } else {
    tailoredResult = generateFallbackTailoredCv(input.targetJobTitle, profile);
  }

  // If syncToProfile is true, update candidate profile and recalculate pgvector embedding
  if (input.syncToProfile) {
    const updatedSkills = Array.from(
      new Set([...profile.skills, ...(tailoredResult.recommendedSkills || [])])
    );

    await candidateRepo.createOrUpdateCandidateProfile(userId, {
      aboutMe: tailoredResult.professionalSummary,
      skills: updatedSkills,
    });

    if (tailoredResult.tailoredExperiences && Array.isArray(tailoredResult.tailoredExperiences)) {
      for (const we of tailoredResult.tailoredExperiences) {
        if (we.id && we.bulletPoints && we.bulletPoints.length > 0) {
          const combinedDesc = we.bulletPoints.map((b: string) => `• ${b}`).join('\n');
          await candidateRepo.updateWorkExperience(we.id, profile.id, {
            description: combinedDesc,
          });
        }
      }
    }

    const updatedProfile = await candidateRepo.getCandidateProfileByUserId(userId);
    if (updatedProfile) {
      const semanticText = buildCandidateSemanticText({
        skills: updatedProfile.skills,
        aboutMe: updatedProfile.aboutMe,
        workExperiences: updatedProfile.workExperiences,
        educations: updatedProfile.educations,
      });

      const embeddingValues = await generateTextEmbedding(semanticText);
      await candidateRepo.updateCandidateProfileParsedTextAndEmbedding(
        updatedProfile.id,
        semanticText,
        embeddingValues
      );
    }
  }

  return tailoredResult;
};
