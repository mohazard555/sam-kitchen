
import { GoogleGenAI, Type } from "@google/genai";
import type { Recipe } from '../types.ts';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRecipe = async (
  ingredients: string,
  cuisine: string,
  dietaryRestrictions: string[],
  mealType: string
): Promise<Recipe> => {
  const dietaryInfo = dietaryRestrictions.length > 0
    ? `يجب أن تكون مناسبة للأنظمة الغذائية التالية: ${dietaryRestrictions.join('، ')}.`
    : "لا توجد قيود غذائية.";
  
  const cuisineInfo = cuisine !== "أي نوع"
    ? `يجب أن تكون الوصفة من المطبخ ${cuisine}.`
    : "يمكن أن يكون المطبخ من أي نوع.";

  const mealTypeInfo = mealType !== "أي نوع"
    ? `يجب أن تكون الوصفة من نوع: ${mealType}.`
    : "يمكن أن تكون الوجبة من أي نوع.";

  const prompt = `
    قم بإنشاء وصفة طعام مفصلة باللغة العربية بناءً على المعلومات التالية.

    المكونات المتاحة: ${ingredients}. يمكنك تضمين مكونات أساسية أخرى شائعة إذا لزم الأمر.

    المطبخ المفضل: ${cuisineInfo}
    
    نوع الوجبة المطلوب: ${mealTypeInfo}

    الاحتياجات الغذائية: ${dietaryInfo}

    يرجى تقديم وصفة واحدة فقط. يجب أن يكون الناتج بصيغة JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recipeName: { type: Type.STRING, description: "اسم الوصفة." },
            description: { type: Type.STRING, description: "وصف قصير وجذاب للطبق." },
            servings: { type: Type.STRING, description: "عدد الحصص التي تكفيها الوصفة." },
            prepTime: { type: Type.STRING, description: "مدة التحضير، مثال: '15 دقيقة'." },
            cookTime: { type: Type.STRING, description: "مدة الطهي، مثال: '30 دقيقة'." },
            ingredients: {
              type: Type.ARRAY,
              description: "قائمة بجميع المكونات المطلوبة للوصفة، مع الكميات.",
              items: { type: Type.STRING },
            },
            instructions: {
              type: Type.ARRAY,
              description: "تعليمات الطهي خطوة بخطوة.",
              items: { type: Type.STRING },
            },
          },
          required: ["recipeName", "description", "ingredients", "instructions", "servings", "prepTime", "cookTime"],
        },
      },
    });
    
    const jsonText = response.text.trim();
    const recipeData = JSON.parse(jsonText);
    return recipeData as Recipe;
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("فشل في إنشاء الوصفة. قد لا يتمكن النموذج من إنشاء وصفة بالقيود المقدمة.");
  }
};