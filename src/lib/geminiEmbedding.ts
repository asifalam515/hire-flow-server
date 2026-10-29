import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';

/**
 * Generate a 768-dimensional float vector embedding for any text using Google Gemini's text-embedding-004.
 * Returns null if the API key is not configured or an error occurs.
 */
export const generateTextEmbedding = async (text: string): Promise<number[] | null> => {
  const apiKey = env.GEMINI_API_KEY || process.env.GEMINI_API_KEY;
  if (!apiKey || !text.trim()) {
    return null;
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
    const result = await model.embedContent(text.slice(0, 8000)); // Cap length within token limits
    return result.embedding.values;
  } catch (error) {
    console.error('Failed to generate embedding with Gemini text-embedding-004:', error);
    return null;
  }
};

/**
 * Calculate Cosine Similarity between two numeric vectors.
 * Returns a normalized score between 0.0 (orthogonal/opposite) and 1.0 (identical).
 */
export const calculateCosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length === 0 || vecB.length === 0 || vecA.length !== vecB.length) {
    return 0;
  }

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    const a = vecA[i] ?? 0;
    const b = vecB[i] ?? 0;
    dotProduct += a * b;
    normA += a * a;
    normB += b * b;
  }

  if (normA === 0 || normB === 0) {
    return 0;
  }

  const similarity = dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  // Bound between 0 and 1
  return Math.max(0, Math.min(1, similarity));
};

/**
 * Deterministic Token Jaccard / Cosine fallback when AI embeddings are unavailable or offline.
 */
export const calculateTextTokenSimilarity = (textA: string, textB: string): number => {
  const tokenize = (str: string): Set<string> =>
    new Set(
      str
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter((w) => w.length > 2)
    );

  const setA = tokenize(textA);
  const setB = tokenize(textB);

  if (setA.size === 0 || setB.size === 0) return 0;

  let intersectionCount = 0;
  for (const token of setA) {
    if (setB.has(token)) {
      intersectionCount++;
    }
  }

  const unionCount = new Set([...setA, ...setB]).size;
  return unionCount === 0 ? 0 : intersectionCount / unionCount;
};

