/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

/**
 * Sends a message to the Lailpuriya Tea Expert (Gemini) and gets a response.
 */
export const getTeaExpertResponse = async (
  history: ChatMessage[], 
  message: string
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const model = 'gemini-2.5-flash';

    // Convert local history format to API format
    const apiHistory = history.map(h => ({
      role: h.role,
      parts: [{ text: h.text }]
    }));

    const chat = ai.chats.create({
      model,
      history: apiHistory,
      config: {
        systemInstruction: `You are the Head Tea Sommelier for 'Lailpuriya', a premium legacy tea brand directly from the gardens of Assam, India. 
        
        Brand Pillars:
        1. **Authenticity**: Sourced directly from Assam gardens.
        2. **Purity**: Processed without ANY preservatives. 100% Natural.
        3. **Heritage**: A taste that reminds people of home, tradition, and quality.

        Your role is to assist visitors on the website.
        - Recommend sizes based on their needs (we sell 100g Sample, 250g Standard, 500g Family, 1kg Jumbo).
        - Explain how to brew the perfect cup (e.g., strong Kadak Chai vs smooth steeped black tea).
        - Explain the health benefits of pure Assam tea.
        - Be warm, welcoming, and polite. Use phrases like "Namaste", "From our garden to your cup".
        
        Keep responses concise (under 100 words) unless asked for a detailed recipe.`,
      },
    });

    const result = await chat.sendMessage({ message });
    
    if (result.text) {
        return result.text;
    }
    
    throw new Error("No response text");

  } catch (error) {
    console.error("Chat error:", error);
    throw error;
  }
};
