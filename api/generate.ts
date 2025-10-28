
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from "@google/genai";

// To avoid path issues in serverless environment, we define the type here.
interface Recipe {
  recipeName: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  servings: string;
  prepTime: string;
  cookTime: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  try {
    const { ingredients, cuisine, dietaryRestrictions, mealType } = req.body;
    
    if (!ingredients) {
      return res.status(400).json({ message: 'Ingredients are required' });
    }

    if (!process.env.API_KEY) {
      return res.status(500).json({ message: 'API key is not configured on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const dietaryInfo = dietaryRestrictions && dietaryRestrictions.length > 0
      ? `يجب أن تكون مناسبة للأنظمة الغذائية التالية: ${dietaryRestrictions.join('، ')}.`
      : "لا توجد قيود غذائية.";
    
    const cuisineInfo = cuisine && cuisine !== "أي نوع"
      ? `يجب أن تكون الوصفة من المطبخ ${cuisine}.`
      : "يمكن أن يكون المطبخ من أي نوع.";

    const mealTypeInfo = mealType && mealType !== "أي نوع"
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
    const recipeData: Recipe = JSON.parse(jsonText);

    return res.status(200).json(recipeData);

  } catch (error) {
    console.error("Error in /api/generate:", error);
    return res.status(500).json({ message: "فشل في إنشاء الوصفة من الخادم. قد تكون هناك مشكلة في الإعدادات أو الطلب." });
  }
}
