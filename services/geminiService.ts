
import { GoogleGenAI, Modality } from "@google/genai";

// Ensure the API key is available in the environment variables
const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY is not defined in environment variables");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const getImageMimeType = (base64String: string): string => {
  return base64String.substring(base64String.indexOf(":") + 1, base64String.indexOf(";"));
};

const getBase64Data = (base64String: string): string => {
  return base64String.split(',')[1];
};

const generateImageFromPrompt = async (
  base64Image: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
      }
    }
    throw new Error("No image was generated in the response.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image from prompt.");
  }
};

export const reimagineImage = async (originalImage: string, style: string): Promise<string> => {
  const mimeType = getImageMimeType(originalImage);
  const base64Data = getBase64Data(originalImage);
  const prompt = `Add a beautiful, realistic ${style} to this backyard. The deck should look like it was professionally designed and built to fit the space naturally. It should be attached to the house if one is visible. Pay attention to lighting and shadows to make it blend in seamlessly.`;
  return generateImageFromPrompt(base64Data, mimeType, prompt);
};

export const refineImage = async (baseImage: string, prompt: string): Promise<string> => {
  const mimeType = getImageMimeType(baseImage);
  const base64Data = getBase64Data(baseImage);
  const refinementPrompt = `Apply the following edit to this image featuring a deck: "${prompt}". Make the change seamlessly and realistically.`;
  return generateImageFromPrompt(base64Data, mimeType, refinementPrompt);
};

export const getChatResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert deck design and construction assistant. A user is refining an AI-generated deck design. Their request is: "${prompt}". If they are asking for product recommendations or where to buy items, identify key furniture and materials and provide them with generic, descriptive shopping search queries (e.g., "You can search for 'cedar deck boards' or 'wicker outdoor sectional' online."). Do not invent specific URLs or product names. If it's a general question about the design or materials, answer it helpfully in a concise and friendly manner.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error getting chat response:", error);
    throw new Error("Failed to get chat response.");
  }
};