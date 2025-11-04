import { GoogleGenAI, Modality } from "@google/genai";

// Per @google/genai coding guidelines, the API key must be obtained exclusively from `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Converts a base64 string (from FileReader) to an inlineData object for the Gemini API.
 */
function base64ToGeminiPart(base64: string) {
  // e.g., "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
  const [mimeTypePart, dataPart] = base64.split(';base64,');
  const mimeType = mimeTypePart.split(':')[1];
  
  return {
    inlineData: {
      data: dataPart,
      mimeType,
    },
  };
}

/**
 * Reimagines the user's yard with a specific deck style.
 */
export async function reimagineImage(base64Image: string, style: string): Promise<string> {
    const imagePart = base64ToGeminiPart(base64Image);
    const prompt = `This is a picture of a user's backyard. Generate a photorealistic image showing a new ${style} installed in this exact backyard. The new image must look like a real photograph and seamlessly blend with the existing house, trees, and ground.`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: prompt }, imagePart],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
    }
    throw new Error('No image was generated.');
}

/**
 * Refines an existing generated image based on a user's text prompt.
 */
export async function refineImage(base64Image: string, prompt: string): Promise<string> {
    const imagePart = base64ToGeminiPart(base64Image);
    const fullPrompt = `This is a generated image of a deck. The user wants to refine it. Their request is: "${prompt}". Apply this change to the image, keeping the style and environment photorealistic and consistent.`

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
            parts: [{ text: fullPrompt }, imagePart],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:image/png;base64,${base64ImageBytes}`;
        }
    }
    throw new Error('No image was refined.');
}

/**
 * Gets a text response from the model for general chat questions.
 */
export async function getChatResponse(prompt: string): Promise<string> {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: `You are an AI deck design assistant. Answer questions about deck materials, building codes, design principles, or anything related to the user's deck project. Be helpful and concise.`
        }
    });
    return response.text;
}