
import type { Recipe } from '../types.ts';

export const generateRecipe = async (
  ingredients: string,
  cuisine: string,
  dietaryRestrictions: string[],
  mealType: string
): Promise<Recipe> => {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ingredients,
        cuisine,
        dietaryRestrictions,
        mealType,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: `An error occurred: ${response.statusText}` }));
      throw new Error(errorData.message || "حدث خطأ غير متوقع من الخادم.");
    }

    const recipeData: Recipe = await response.json();
    return recipeData;
  } catch (error) {
    console.error("Error calling API endpoint:", error);
    if (error instanceof Error && error.message.includes("فشل")) {
        throw error;
    }
    throw new Error("فشل في التواصل مع الخادم لإنشاء الوصفة. يرجى المحاولة مرة أخرى.");
  }
};
