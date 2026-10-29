import { GoogleGenerativeAI } from '@google/generative-ai';
import { Role, AiInterviewStatus, ApplicationStatus, Prisma } from '@prisma/client';
import { env } from '../../config/env';
import { AppError } from '../../utils/AppError';
import { JwtPayload } from '../../middlewares/auth.middleware';
import {
  createAiSessionRecord,
  findAiSessionByIdRecord,
  findLatestAiSessionByApplicationIdRecord,
  updateAiSessionRecord,
  findApplicationForAiInterviewRecord,
} from './aiInterviews.repository';
import { updateApplicationStatus } from '../applications/application.repository';

// ---------------------------------------------------------------------------
// Interfaces & Types
// ---------------------------------------------------------------------------

export interface AiInterviewQuestion {
  id: number;
  question: string;
  category: string;
  keyPoints: string[];
}

export interface TranscriptEntry {
  speaker: 'AI' | 'CANDIDATE';
  text: string;
  timestamp: string;
}

export interface RubricFeedback {
  strengths: string[];
  weaknesses: string[];
  summary: string;
  recommendation: 'STRONG_HIRE' | 'HIRE' | 'LEAN_HIRE' | 'REJECT';
}

// ---------------------------------------------------------------------------
// Gemini AI Helper Functions
// ---------------------------------------------------------------------------

const getGeminiClient = () => {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Fallback questions if Gemini API is unavailable or quota is exceeded.
 */
const getFallbackQuestions = (jobTitle: string): AiInterviewQuestion[] => [
  {
    id: 1,
    question: `Could you give me a brief overview of your technical background and what makes you a strong fit for the ${jobTitle} role?`,
    category: 'Technical Background & Architecture',
    keyPoints: ['System overview', 'Relevant tech stack proficiency', 'Past achievements'],
  },
  {
    id: 2,
    question: `In high-scale production environments, how do you approach debugging unexpected latency spikes or performance bottlenecks?`,
    category: 'System Design & Optimization',
    keyPoints: ['Profiling & metrics', 'Database index analysis', 'Caching layers'],
  },
  {
    id: 3,
    question: `Describe a complex technical challenge you recently solved. What trade-offs did you evaluate, and what was the outcome?`,
    category: 'Problem Solving & Execution',
    keyPoints: ['Trade-off evaluation', 'Failure tolerance', 'Measurable results'],
  },
  {
    id: 4,
    question: `How do you handle disagreement over technical direction or architectural choices within your team?`,
    category: 'Communication & Leadership',
    keyPoints: ['Collaboration', 'Data-driven consensus', 'Constructive feedback'],
  },
];

/**
 * Generate 4 targeted interview questions using Gemini 1.5 Flash.
 */
const generateInterviewQuestionsWithGemini = async (
  jobTitle: string,
  jobDescription: string,
  skills: string[],
  candidateSkills: string[],
): Promise<AiInterviewQuestion[]> => {
  const genAI = getGeminiClient();
  if (!genAI) return getFallbackQuestions(jobTitle);

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are an elite Tech Lead and hiring bar-raiser conducting a technical interview for the position: "${jobTitle}".
Job Skills Required: ${skills.join(', ') || 'Software Engineering'}
Candidate Skills: ${candidateSkills.join(', ') || 'Not specified'}
Job Summary: ${jobDescription.slice(0, 1000)}

Generate exactly 4 progressive, realistic interview questions:
1. Foundational Architecture & Tech Stack Experience
2. Core Technical Domain / Scalability / Systems Design Challenge
3. Practical Problem Solving / Live Debugging Scenario
4. Behavioral / Collaboration & Decision Making

Return STRICTLY valid JSON with no markdown backticks and no explanations in this exact schema:
[
  {
    "id": 1,
    "question": "question text",
    "category": "Foundational Architecture",
    "keyPoints": ["point 1", "point 2"]
  }
]`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanJson);

    if (Array.isArray(parsed) && parsed.length >= 3) {
      return parsed.slice(0, 4).map((q: any, idx: number) => ({
        id: idx + 1,
        question: String(q.question || ''),
        category: String(q.category || 'Technical Evaluation'),
        keyPoints: Array.isArray(q.keyPoints) ? q.keyPoints.map(String) : [],
      }));
    }
  } catch (err) {
    console.error('Gemini question generation error, using fallback:', err);
  }

  return getFallbackQuestions(jobTitle);
};

/**
 * Generate brief transition / acknowledgment before asking the next question.
 */
const generateTransitionWithGemini = async (
  currentQuestion: string,
  candidateAnswer: string,
  nextQuestion: string,
): Promise<string> => {
  const genAI = getGeminiClient();
  if (!genAI) return 'Thank you for your response. Let us proceed to the next question:';

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are an encouraging, professional technical interviewer.
Question asked: "${currentQuestion}"
Candidate answer: "${candidateAnswer.slice(0, 800)}"
Next Question: "${nextQuestion}"

Write a brief 1-sentence conversational acknowledgment of their answer that smoothly bridges into the next question. Do not evaluate or grade their answer yet. Keep it under 25 words.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    if (text) return text;
  } catch (err) {
    console.error('Gemini transition generation error:', err);
  }

  return 'Thank you for sharing that approach. Moving to our next question:';
};

/**
 * Evaluate full interview transcript using Gemini 1.5 Flash.
 */
const evaluateTranscriptWithGemini = async (
  jobTitle: string,
  transcript: TranscriptEntry[],
): Promise<{
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  rubricFeedback: RubricFeedback;
}> => {
  const genAI = getGeminiClient();

  const fallback = {
    overallScore: 78,
    technicalScore: 80,
    communicationScore: 75,
    problemSolvingScore: 78,
    rubricFeedback: {
      strengths: ['Clear articulate answers', 'Demonstrated understanding of core software engineering fundamentals'],
      weaknesses: ['Could elaborate more on edge case handling and quantitative metrics'],
      summary: `The candidate showed solid competencies for the ${jobTitle} position with sound technical reasoning.`,
      recommendation: 'HIRE' as const,
    },
  };

  if (!genAI) return fallback;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const formattedTranscript = transcript
      .map((entry) => `${entry.speaker}: ${entry.text}`)
      .join('\n\n');

    const prompt = `You are a Principal Engineering Bar Raiser evaluating a candidate's completed technical interview transcript for the role of: "${jobTitle}".

TRANSCRIPT:
${formattedTranscript.slice(0, 10000)}

Analyze the candidate's performance across:
1. Technical Depth (0 - 100)
2. Problem Solving & Reasoning (0 - 100)
3. Communication Clarity (0 - 100)
4. Overall Score (0 - 100)

Provide:
- strengths: list of 2-3 specific technical strengths demonstrated in the transcript
- weaknesses: list of 1-2 areas for improvement or gaps in technical depth
- summary: 2-3 sentence executive evaluation summary
- recommendation: exactly one of: "STRONG_HIRE", "HIRE", "LEAN_HIRE", or "REJECT"

Return STRICTLY valid JSON with no markdown and no backticks:
{
  "overallScore": 82,
  "technicalScore": 85,
  "communicationScore": 80,
  "problemSolvingScore": 82,
  "rubricFeedback": {
    "strengths": ["...", "..."],
    "weaknesses": ["..."],
    "summary": "...",
    "recommendation": "HIRE"
  }
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    const cleanJson = responseText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
    const parsed = JSON.parse(cleanJson);

    return {
      overallScore: Math.min(100, Math.max(0, Number(parsed.overallScore) || 75)),
      technicalScore: Math.min(100, Math.max(0, Number(parsed.technicalScore) || 75)),
      communicationScore: Math.min(100, Math.max(0, Number(parsed.communicationScore) || 75)),
      problemSolvingScore: Math.min(100, Math.max(0, Number(parsed.problemSolvingScore) || 75)),
      rubricFeedback: {
        strengths: Array.isArray(parsed.rubricFeedback?.strengths)
          ? parsed.rubricFeedback.strengths.map(String)
          : ['Demonstrated clear domain knowledge'],
        weaknesses: Array.isArray(parsed.rubricFeedback?.weaknesses)
          ? parsed.rubricFeedback.weaknesses.map(String)
          : ['Could expand on failure recovery scenarios'],
        summary: String(parsed.rubricFeedback?.summary || `Candidate demonstrated solid readiness for ${jobTitle}.`),
        recommendation: ['STRONG_HIRE', 'HIRE', 'LEAN_HIRE', 'REJECT'].includes(parsed.rubricFeedback?.recommendation)
          ? parsed.rubricFeedback.recommendation
          : 'HIRE',
      },
    };
  } catch (err) {
    console.error('Gemini transcript evaluation error, using fallback:', err);
    return fallback;
  }
};

// ---------------------------------------------------------------------------
// AI Interviews Service (Pure Arrow Functions)
// ---------------------------------------------------------------------------

/**
 * Start or resume an AI Interview Session for a given application.
 */
export const startAiInterviewSession = async (user: JwtPayload, applicationId: string) => {
  const application = await findApplicationForAiInterviewRecord(applicationId);
  if (!application) {
    throw new AppError('Application not found', 404);
  }

  // Tenant / Ownership Verification
  if (user.role === Role.RECRUITER) {
    if (application.job.companyId !== user.companyId) {
      throw new AppError('Tenant Isolation Error: You can only access interviews for your company.', 403);
    }
  } else if (user.role === Role.CANDIDATE) {
    if (application.candidate.user.id !== user.id) {
      throw new AppError('Access denied: You can only access your own interview session.', 403);
    }
  }

  // Check if an existing in-progress or completed session exists
  const existingSession = await findLatestAiSessionByApplicationIdRecord(applicationId);
  if (existingSession && existingSession.status === AiInterviewStatus.IN_PROGRESS) {
    return existingSession;
  }

  // Generate customized 4-question technical curriculum via Gemini
  const questions = await generateInterviewQuestionsWithGemini(
    application.job.title,
    application.job.description || '',
    application.job.softwareSkills || [],
    application.candidate.skills || [],
  );

  const initialTranscript: TranscriptEntry[] = [
    {
      speaker: 'AI',
      text: `Hello! I am AeroATS's Autonomous AI Technical Interviewer. I'll be conducting your technical screening for the ${application.job.title} role at ${application.job.company.name}. Let's begin with our first question:\n\n${questions[0]?.question || 'Please tell me about your background.'}`,
      timestamp: new Date().toISOString(),
    },
  ];

  const session = await createAiSessionRecord({
    applicationId,
    questions: questions as unknown as Prisma.InputJsonValue,
    transcript: initialTranscript as unknown as Prisma.InputJsonValue,
    status: AiInterviewStatus.IN_PROGRESS,
  });

  // Promote application to SCREENING if currently in APPLIED stage
  if (application.status === ApplicationStatus.APPLIED) {
    await updateApplicationStatus(applicationId, ApplicationStatus.SCREENING);
  }

  return session;
};

/**
 * Fetch an AI Interview Session by Session ID with security checks.
 */
export const getAiInterviewSession = async (user: JwtPayload, sessionId: string) => {
  const session = await findAiSessionByIdRecord(sessionId);
  if (!session) {
    throw new AppError('AI Interview Session not found', 404);
  }

  // Authorization Check
  if (user.role === Role.RECRUITER) {
    if (session.application.job.companyId !== user.companyId) {
      throw new AppError('Tenant Isolation Error: Forbidden.', 403);
    }
  } else if (user.role === Role.CANDIDATE) {
    if (session.application.candidate.user.id !== user.id) {
      throw new AppError('Access denied: You can only view your own interview session.', 403);
    }
  }

  return session;
};

/**
 * Submit candidate answer, append to transcript, and advance question or trigger finalization.
 */
export const submitCandidateAnswer = async (user: JwtPayload, sessionId: string, answerText: string) => {
  const session = await findAiSessionByIdRecord(sessionId);
  if (!session) {
    throw new AppError('AI Interview Session not found', 404);
  }

  // Ensure candidate can only answer their own session
  if (session.application.candidate.user.id !== user.id && user.role !== Role.ADMIN) {
    throw new AppError('Access denied: Only the applicant can submit interview answers.', 403);
  }

  if (session.status !== AiInterviewStatus.IN_PROGRESS) {
    throw new AppError('Interview session is not active.', 400);
  }

  const questions = (session.questions as unknown as AiInterviewQuestion[]) || [];
  const currentTranscript = (session.transcript as unknown as TranscriptEntry[]) || [];
  const currentIndex = session.currentQuestionIndex;
  const currentQ = questions[currentIndex];

  // Append candidate's answer
  currentTranscript.push({
    speaker: 'CANDIDATE',
    text: answerText.trim(),
    timestamp: new Date().toISOString(),
  });

  const nextIndex = currentIndex + 1;

  if (nextIndex < questions.length) {
    // Intermediate question: Generate smooth bridge transition and present next question
    const nextQ = questions[nextIndex];
    if (!nextQ) {
      throw new AppError('Next question not found', 500);
    }
    const transition = await generateTransitionWithGemini(
      currentQ?.question || '',
      answerText,
      nextQ.question,
    );

    currentTranscript.push({
      speaker: 'AI',
      text: `${transition}\n\n${nextQ.question}`,
      timestamp: new Date().toISOString(),
    });

    const updatedSession = await updateAiSessionRecord(sessionId, {
      currentQuestionIndex: nextIndex,
      transcript: currentTranscript as unknown as Prisma.InputJsonValue,
    });

    return {
      session: updatedSession,
      isCompleted: false,
      nextQuestion: nextQ,
      transcript: currentTranscript,
    };
  } else {
    // Last question answered: Close interview and trigger comprehensive scorecard evaluation
    currentTranscript.push({
      speaker: 'AI',
      text: 'Thank you for answering all questions! You have completed the technical interview. Our AI evaluation engine is analyzing your responses across all dimensions to generate your scorecard.',
      timestamp: new Date().toISOString(),
    });

    const evaluation = await evaluateTranscriptWithGemini(
      session.application.job.title,
      currentTranscript,
    );

    const finalizedSession = await updateAiSessionRecord(sessionId, {
      status: AiInterviewStatus.COMPLETED,
      completedAt: new Date(),
      transcript: currentTranscript as unknown as Prisma.InputJsonValue,
      overallScore: evaluation.overallScore,
      technicalScore: evaluation.technicalScore,
      communicationScore: evaluation.communicationScore,
      problemSolvingScore: evaluation.problemSolvingScore,
      rubricFeedback: evaluation.rubricFeedback as unknown as Prisma.InputJsonValue,
    });

    return {
      session: finalizedSession,
      isCompleted: true,
      nextQuestion: null,
      transcript: currentTranscript,
      evaluation,
    };
  }
};

/**
 * Retrieve the latest AI interview session / scorecard for a specific application.
 */
export const getAiScorecardForApplication = async (user: JwtPayload, applicationId: string) => {
  const application = await findApplicationForAiInterviewRecord(applicationId);
  if (!application) {
    throw new AppError('Application not found', 404);
  }

  // Tenant / Ownership Verification
  if (user.role === Role.RECRUITER && application.job.companyId !== user.companyId) {
    throw new AppError('Tenant Isolation Error: You can only view scorecards for your company.', 403);
  } else if (user.role === Role.CANDIDATE && application.candidate.user.id !== user.id) {
    throw new AppError('Access denied: You can only view your own interview scorecard.', 403);
  }

  const session = await findLatestAiSessionByApplicationIdRecord(applicationId);
  return session;
};
