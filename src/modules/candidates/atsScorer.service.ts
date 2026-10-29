import {
  generateTextEmbedding,
  calculateCosineSimilarity,
  calculateTextTokenSimilarity,
} from '../../lib/geminiEmbedding';

export interface AtsCandidateInput {
  skills?: string[];
  aboutMe?: string | null;
  workExperiences?: Array<{
    title: string;
    company: string;
    description?: string | null;
    startDate?: Date | string;
    endDate?: Date | string | null;
    isCurrent?: boolean;
  }>;
  educations?: Array<{
    degree: string;
    fieldOfStudy?: string | null;
    institution: string;
  }>;
}

export interface AtsJobInput {
  id?: string;
  title: string;
  description?: string | null;
  category?: string;
  requirements?: string | null;
  responsibilities?: string | null;
  softwareSkills: string[];
  candidateExperience?: string[];
  yearsOfExperience?: string;
  educationLevel?: string;
}

export interface AtsMatchBreakdown {
  overallScore: number; // 0 - 100
  semanticScore: number; // 0 - 100
  skillsScore: number; // 0 - 100
  experienceScore: number; // 0 - 100
  matchedSkills: string[];
  missingSkills: string[];
  recommendation: 'STRONG_MATCH' | 'GOOD_MATCH' | 'MODERATE_MATCH' | 'LOW_MATCH';
  summary: string;
}

/**
 * Compiles a rich, semantic text representation of a candidate's qualifications.
 */
export const buildCandidateSemanticText = (candidate: AtsCandidateInput): string => {
  const parts: string[] = [];

  if (candidate.skills && candidate.skills.length > 0) {
    parts.push(`Key Skills: ${candidate.skills.join(', ')}`);
  }

  if (candidate.aboutMe) {
    parts.push(`Professional Summary: ${candidate.aboutMe.trim()}`);
  }

  if (candidate.workExperiences && candidate.workExperiences.length > 0) {
    const expText = candidate.workExperiences
      .map(
        (we) =>
          `Role: ${we.title} at ${we.company}. Details: ${we.description || 'N/A'}`
      )
      .join('\n');
    parts.push(`Work Experience:\n${expText}`);
  }

  if (candidate.educations && candidate.educations.length > 0) {
    const eduText = candidate.educations
      .map(
        (edu) =>
          `Degree: ${edu.degree} in ${edu.fieldOfStudy || 'General'} at ${edu.institution}`
      )
      .join('; ');
    parts.push(`Education: ${eduText}`);
  }

  return parts.join('\n\n');
};

/**
 * Compiles a rich, semantic text representation of a job posting's requirements.
 */
export const buildJobSemanticText = (job: AtsJobInput): string => {
  const parts: string[] = [`Job Title: ${job.title}`];

  if (job.category) {
    parts.push(`Category: ${job.category}`);
  }

  if (job.softwareSkills && job.softwareSkills.length > 0) {
    parts.push(`Required Software Skills: ${job.softwareSkills.join(', ')}`);
  }

  if (job.yearsOfExperience) {
    parts.push(`Experience Level: ${job.yearsOfExperience}`);
  }

  if (job.requirements) {
    parts.push(`Requirements:\n${job.requirements}`);
  }

  if (job.responsibilities) {
    parts.push(`Responsibilities:\n${job.responsibilities}`);
  }

  if (job.description) {
    parts.push(`Description:\n${job.description}`);
  }

  return parts.join('\n\n');
};

/**
 * Estimates total candidate professional experience in years from work experience records.
 */
const estimateCandidateTotalYears = (
  experiences?: AtsCandidateInput['workExperiences']
): number => {
  if (!experiences || experiences.length === 0) return 0;

  let totalMonths = 0;
  const now = new Date();

  for (const exp of experiences) {
    const start = exp.startDate ? new Date(exp.startDate) : null;
    const end = exp.isCurrent || !exp.endDate ? now : new Date(exp.endDate);

    if (start && !isNaN(start.getTime()) && !isNaN(end.getTime()) && end > start) {
      const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
      totalMonths += Math.max(0, months);
    }
  }

  return Math.round((totalMonths / 12) * 10) / 10;
};

/**
 * Parses numeric required years from strings like "3-5 years", "2+", "5 Years", etc.
 */
const parseRequiredYears = (yearsStr?: string): number => {
  if (!yearsStr) return 0;
  const match = yearsStr.match(/(\d+)/);
  return match && match[1] ? parseInt(match[1], 10) : 0;
};

/**
 * Evaluates a candidate against a job posting to generate an ATS Match Score and breakdown.
 */
export const evaluateAtsMatch = async (
  candidate: AtsCandidateInput,
  job: AtsJobInput
): Promise<AtsMatchBreakdown> => {
  const candidateText = buildCandidateSemanticText(candidate);
  const jobText = buildJobSemanticText(job);

  // 1. Vector Semantic Similarity (50% Weight)
  let semanticScore = 0;
  const [candidateEmb, jobEmb] = await Promise.all([
    generateTextEmbedding(candidateText),
    generateTextEmbedding(jobText),
  ]);

  if (candidateEmb && jobEmb) {
    const sim = calculateCosineSimilarity(candidateEmb, jobEmb);
    // Cosine similarity in typical text embeddings ranges between 0.45 and 0.95.
    // We calibrate to a standard ATS 0-100 scale.
    semanticScore = Math.round(Math.min(100, Math.max(10, sim * 100)));
  } else {
    // Resilient fallback to token Jaccard similarity
    const tokenSim = calculateTextTokenSimilarity(candidateText, jobText);
    semanticScore = Math.round(Math.min(100, Math.max(25, tokenSim * 150)));
  }

  // 2. Direct Skills Match (35% Weight)
  const candidateSkillsSet = new Set(
    (candidate.skills || []).map((s) => s.trim().toLowerCase())
  );

  const targetJobSkills = (job.softwareSkills || []).map((s) => s.trim());
  const matchedSkills: string[] = [];
  const missingSkills: string[] = [];

  for (const skill of targetJobSkills) {
    const normalized = skill.toLowerCase();
    const hasMatch =
      candidateSkillsSet.has(normalized) ||
      Array.from(candidateSkillsSet).some(
        (cSkill) => cSkill.includes(normalized) || normalized.includes(cSkill)
      );

    if (hasMatch) {
      matchedSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  }

  let skillsScore = 100;
  if (targetJobSkills.length > 0) {
    skillsScore = Math.round((matchedSkills.length / targetJobSkills.length) * 100);
  }

  // 3. Experience Fit (15% Weight)
  const candidateYears = estimateCandidateTotalYears(candidate.workExperiences);
  const requiredYears = parseRequiredYears(job.yearsOfExperience);

  let experienceScore = 100;
  if (requiredYears > 0) {
    if (candidateYears >= requiredYears) {
      experienceScore = 100;
    } else {
      experienceScore = Math.round(Math.max(20, (candidateYears / requiredYears) * 100));
    }
  }

  // 4. Weighted Composite Score
  const overallScore = Math.min(
    100,
    Math.max(
      0,
      Math.round(semanticScore * 0.5 + skillsScore * 0.35 + experienceScore * 0.15)
    )
  );

  // 5. Categorical Recommendation & Summary
  let recommendation: AtsMatchBreakdown['recommendation'] = 'LOW_MATCH';
  let summary = '';

  if (overallScore >= 80) {
    recommendation = 'STRONG_MATCH';
    summary = `High candidate match (${overallScore}%). Strong alignment in core software skills (${matchedSkills.length}/${targetJobSkills.length || 1}) and experience.`;
  } else if (overallScore >= 65) {
    recommendation = 'GOOD_MATCH';
    summary = `Good candidate match (${overallScore}%). Meets key requirements with minor skill gaps in: ${missingSkills.slice(0, 3).join(', ') || 'none'}.`;
  } else if (overallScore >= 45) {
    recommendation = 'MODERATE_MATCH';
    summary = `Moderate candidate match (${overallScore}%). Missing notable skills required for this role: ${missingSkills.slice(0, 3).join(', ') || 'N/A'}.`;
  } else {
    recommendation = 'LOW_MATCH';
    summary = `Low candidate match (${overallScore}%). Candidate profile shows limited overlap with required tech stack and experience.`;
  }

  return {
    overallScore,
    semanticScore,
    skillsScore,
    experienceScore,
    matchedSkills,
    missingSkills,
    recommendation,
    summary,
  };
};

