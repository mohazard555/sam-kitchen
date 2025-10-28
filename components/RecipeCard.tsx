
import React from 'react';
import type { Recipe } from '../types.ts';

interface RecipeCardProps {
  recipe: Recipe;
}

const InfoPill: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex flex-col items-center text-center bg-salmon/10 rounded-lg p-3">
    <div className="text-salmon">{icon}</div>
    <span className="text-xs text-gray-400 mt-1">{label}</span>
    <span className="font-bold text-sm text-gray-100">{value}</span>
  </div>
);


export const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-lg w-full animate-fade-in">
      <div id="printable-recipe" className="p-6 md:p-8">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-3xl font-bold text-white mb-2">{recipe.recipeName}</h2>
                <p className="text-gray-400 mb-6">{recipe.description}</p>
            </div>
            <div className="no-print">
                <button
                    onClick={handlePrint}
                    className="flex items-center gap-2 bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                    aria-label="Print Recipe"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0 1 10.56 0m-10.56 0L6 18.25m0-4.421c.24.03.48.062.72.096m0 0c-.24.03-.48.062-.72.096m11.28 0c-.24.03-.48.062-.72.096m.72-.096L18 18.25m0-4.421c.24.03.48.062.72.096m0 0c-.24.03-.48.062-.72.096M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    <span>طباعة</span>
                </button>
            </div>
        </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <InfoPill 
          label="مدة التحضير" 
          value={recipe.prepTime}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}
        />
        <InfoPill 
          label="مدة الطهي" 
          value={recipe.cookTime}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m15.362 5.214A9.012 9.012 0 0 1 16.5 12c0 2.396-.93 4.588-2.458 6.222M13.878 3.622a11.253 11.253 0 0 1 2.373 8.378c-.68 4.29-3.94 7.55-8.23 8.23a11.253 11.253 0 0 1-8.378-2.373m1.002-1.002A11.25 11.25 0 0 1 12 2.25c4.97 0 9.187 3.32 10.658 7.842" /></svg>}
        />
        <InfoPill 
          label="حصص تكفي" 
          value={recipe.servings}
          icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h3 className="text-xl font-semibold text-white border-b-2 border-salmon pb-2 mb-4">المكونات</h3>
          <ul className="space-y-2 list-disc list-inside text-gray-300">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-2">
          <h3 className="text-xl font-semibold text-white border-b-2 border-salmon pb-2 mb-4">التعليمات</h3>
          <ol className="space-y-4 text-gray-300">
            {recipe.instructions.map((step, index) => (
              <li key={index} className="flex items-start">
                <span className="font-bold text-salmon ml-3">{index + 1}.</span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
      </div>
    </div>
  );
};