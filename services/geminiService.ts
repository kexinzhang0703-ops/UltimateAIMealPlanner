
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { UserPreferences, WeeklyPlan, Recipe } from "../types";

// Always use the API_KEY from process.env directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateMealPlan = async (prefs: UserPreferences): Promise<WeeklyPlan> => {
  const prompt = `Generate a comprehensive 7-day meal plan (Monday to Sunday) for a user with the following preferences:
    - Diet: ${prefs.dietary}
    - Allergies: ${prefs.allergies.join(', ') || 'None'}
    - Servings: ${prefs.servings}
    - Budget: ${prefs.budget}
    - Fitness Goal: ${prefs.goal}

    For each day, provide a Breakfast, Lunch, and Dinner.
    Ensure recipes are diverse and nutritional values align with the ${prefs.goal} goal.
    Include a detailed ingredient list for each meal categorized by supermarket section (e.g., Produce, Meat, Dairy).`;

  // Define the recipe schema part to reuse manually since $ref might not be supported in some environments
  const recipeSchema = {
    type: Type.OBJECT,
    properties: {
      id: { type: Type.STRING },
      name: { type: Type.STRING },
      description: { type: Type.STRING },
      instructions: {
        type: Type.ARRAY,
        items: { type: Type.STRING }
      },
      ingredients: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            amount: { type: Type.STRING },
            unit: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["name", "amount", "unit", "category"]
        }
      },
      nutrition: {
        type: Type.OBJECT,
        properties: {
          calories: { type: Type.NUMBER },
          protein: { type: Type.NUMBER },
          carbs: { type: Type.NUMBER },
          fat: { type: Type.NUMBER }
        },
        required: ["calories", "protein", "carbs", "fat"]
      },
      cookingTime: { type: Type.NUMBER },
      difficulty: { type: Type.STRING }
    },
    required: ["id", "name", "description", "instructions", "ingredients", "nutrition", "cookingTime", "difficulty"]
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          days: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                day: { type: Type.STRING },
                meals: {
                  type: Type.OBJECT,
                  properties: {
                    breakfast: recipeSchema,
                    lunch: recipeSchema,
                    dinner: recipeSchema
                  },
                  required: ["breakfast", "lunch", "dinner"]
                }
              },
              required: ["day", "meals"]
            }
          }
        },
        required: ["days"]
      }
    }
  });

  try {
    const data = JSON.parse(response.text);
    return data as WeeklyPlan;
  } catch (e) {
    console.error("Failed to parse meal plan JSON", e);
    throw new Error("Could not generate plan. Please try again.");
  }
};

export const generateMealImage = async (mealName: string): Promise<string | null> => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [{ text: `A professional, high-quality studio food photography shot of ${mealName}. Vibrant colors, appetizing presentation on a clean plate.` }]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1"
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return null;
};
