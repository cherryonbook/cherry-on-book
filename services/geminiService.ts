import { GoogleGenAI, Type } from "@google/genai";
import { Book, AIRecommendation } from '../types';

// Safely retrieve API Key
const apiKey = process.env.API_KEY || '';

const ai = new GoogleGenAI({ apiKey });

export const getBookRecommendations = async (
  query: string,
  availableBooks: Book[]
): Promise<{ recommendations: AIRecommendation[], message: string }> => {
  if (!apiKey) {
    console.warn("No API Key provided for Gemini.");
    return { recommendations: [], message: "AI features are currently unavailable." };
  }

  try {
    const bookCatalog = availableBooks.map(b => ({
      id: b.id,
      title: b.title,
      author: b.author,
      description: b.description,
      tags: b.tags.join(", ")
    }));

    const prompt = `
      You are an expert bookseller at "Cherry on Book", a classy bookstore.
      User Query: "${query}"

      Here is our catalog:
      ${JSON.stringify(bookCatalog)}

      Task:
      1. Analyze the user's query (mood, genre, specific request).
      2. Select up to 4 books from the catalog that best match.
      3. Provide a brief, charming reason for each recommendation.
      4. Write a short, welcoming summary message for the user.

      Return strictly JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  bookId: { type: Type.STRING },
                  reason: { type: Type.STRING }
                },
                required: ["bookId", "reason"]
              }
            },
            message: { type: Type.STRING }
          },
          required: ["recommendations", "message"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return { 
      recommendations: [], 
      message: "I'm having a little trouble reading the shelves right now. Please browse our collection below!" 
    };
  }
};
