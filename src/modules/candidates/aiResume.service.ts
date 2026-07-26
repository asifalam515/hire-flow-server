import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API client. The API key must be provided in the environment variables.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export const enhanceResumeData = async (profileData: any): Promise<any> => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is missing. Returning original profile data without enhancement.');
    return profileData;
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Prepare prompt payload
    const prompt = `
You are an expert executive resume writer. I will provide you with a candidate's profile data.
Your job is to rewrite the "aboutMe" summary and the "workExperiences" bullet points to sound highly professional, impactful, and polished.
Do not invent new facts. Only enhance what is provided.
Ensure you return valid JSON.

Here is the candidate data:
About Me: ${profileData.aboutMe || ''}
Work Experiences: ${JSON.stringify(profileData.workExperiences || [])}

Please return a JSON object with this exact structure:
{
  "aboutMe": "The enhanced about me summary string",
  "workExperiences": [
    {
      "id": "original id",
      "enhancedDescription": "The enhanced professional description of their role"
    }
  ]
}
`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    
    // Extract JSON if wrapped in markdown
    const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : text;
    const enhancedData = JSON.parse(jsonStr);

    // Merge enhanced data back into profile
    const enhancedProfile = { ...profileData };
    if (enhancedData.aboutMe) {
      enhancedProfile.aboutMe = enhancedData.aboutMe;
    }
    
    if (enhancedData.workExperiences && enhancedProfile.workExperiences) {
      enhancedProfile.workExperiences = enhancedProfile.workExperiences.map((we: any) => {
        const enhancedWe = enhancedData.workExperiences.find((ew: any) => ew.id === we.id);
        if (enhancedWe && enhancedWe.enhancedDescription) {
          return { ...we, description: enhancedWe.enhancedDescription };
        }
        return we;
      });
    }

    return enhancedProfile;
  } catch (error) {
    console.error('Failed to enhance resume with Gemini:', error);
    return profileData; // fallback
  }
};
