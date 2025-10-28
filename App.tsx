
import React, { useState, useCallback, useEffect } from 'react';
import { generateRecipe } from './services/geminiService.ts';
import type { Recipe, AppSettings } from './types.ts';
import { CUISINE_OPTIONS, DIETARY_OPTIONS, MEAL_TYPE_OPTIONS } from './constants.ts';
import { RecipeCard } from './components/RecipeCard.tsx';
import { LoadingSpinner } from './components/LoadingSpinner.tsx';
import { ErrorMessage } from './components/ErrorMessage.tsx';
import { Login } from './components/Login.tsx';
import { AdBanner } from './components/AdBanner.tsx';

const App: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [showLogin, setShowLogin] = useState<boolean>(false);
  const [ingredients, setIngredients] = useState<string>('');
  const [cuisine, setCuisine] = useState<string>('أي نوع');
  const [mealType, setMealType] = useState<string>('أي نوع');
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string[]>([]);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/settings.json');
        const data = await response.json();
        setSettings(data);
      } catch (e) {
        console.error("Failed to load settings:", e);
        setError("فشل تحميل ملف الإعدادات.");
      }
    };
    fetchSettings();
  }, []);

  const handleDietaryChange = (option: string) => {
    setDietaryRestrictions(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    );
  };

  const handleGenerateRecipe = useCallback(async () => {
    if (!ingredients.trim()) {
      setError("الرجاء إدخال بعض المكونات.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setRecipe(null);
    try {
      const generatedRecipe = await generateRecipe(ingredients, cuisine, dietaryRestrictions, mealType);
      setRecipe(generatedRecipe);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'حدث خطأ غير معروف.');
    } finally {
      setIsLoading(false);
    }
  }, [ingredients, cuisine, dietaryRestrictions, mealType]);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setShowLogin(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center p-4 sm:p-6 lg:p-8 relative">
       <style>{`
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media print {
          body * {
            visibility: hidden;
            background: white !important;
            color: black !important;
          }
          #printable-recipe, #printable-recipe * {
            visibility: visible;
          }
          #printable-recipe {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
      
      <div className="absolute top-4 left-4 z-10">
        {!isLoggedIn ? (
          <button 
            onClick={() => setShowLogin(true)}
            className="bg-gray-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
          >
            دخول الأدمن
          </button>
        ) : (
          <button 
            onClick={handleLogout}
            className="bg-salmon text-white font-bold py-2 px-4 rounded-lg hover:bg-opacity-90 transition duration-300"
          >
            تسجيل الخروج
          </button>
        )}
      </div>

      {showLogin && (
        <Login 
          onLoginSuccess={handleLoginSuccess}
          onClose={() => setShowLogin(false)}
          credentials={settings.admin} 
        />
      )}

      <main className="w-full max-w-5xl mx-auto space-y-8">
        <header className="text-center pt-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                sam <span className="text-salmon">kitchen</span>
            </h1>
            <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
                حوّل مكوناتك المتبقية إلى وجبة لذيذة. فقط أخبرنا بما لديك!
            </p>
        </header>

        <div className="bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8 space-y-6">
          <div>
            <label htmlFor="ingredients" className="block text-lg font-semibold text-gray-200 mb-2">
              ما هي المكونات المتوفرة لديك؟
            </label>
            <textarea
              id="ingredients"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              placeholder="مثال: صدر دجاج، طماطم، أرز، ثوم"
              className="w-full h-32 p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-salmon focus:border-salmon transition duration-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="cuisine" className="block text-lg font-semibold text-gray-200 mb-2">
                نوع المطبخ
              </label>
              <select
                id="cuisine"
                value={cuisine}
                onChange={(e) => setCuisine(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-salmon focus:border-salmon transition duration-200"
              >
                {CUISINE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="mealType" className="block text-lg font-semibold text-gray-200 mb-2">
                نوع الوجبة
              </label>
              <select
                id="mealType"
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full p-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-salmon focus:border-salmon transition duration-200"
              >
                {MEAL_TYPE_OPTIONS.map(option => <option key={option} value={option}>{option}</option>)}
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="block text-lg font-semibold text-gray-200 mb-2">
                خيارات غذائية
              </label>
              <div className="flex flex-wrap gap-2">
                {DIETARY_OPTIONS.map(option => (
                  <button
                    key={option}
                    onClick={() => handleDietaryChange(option)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors duration-200 ${
                      dietaryRestrictions.includes(option)
                        ? 'bg-salmon text-white'
                        : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div>
            <button
              onClick={handleGenerateRecipe}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-salmon text-white font-bold py-3 px-6 rounded-lg hover:bg-opacity-90 disabled:bg-salmon/50 disabled:cursor-not-allowed transition duration-300 transform hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>
              {isLoading ? 'جاري الإبداع...' : 'أنشئ الوصفة'}
            </button>
          </div>
        </div>

        <div className="mt-8">
          {isLoading && <LoadingSpinner />}
          {error && <ErrorMessage message={error} />}
          {recipe && <RecipeCard recipe={recipe} />}
        </div>
        
        <AdBanner ad={settings.ad} />

      </main>
      <footer className="w-full max-w-5xl mx-auto text-center mt-8 py-4 border-t border-gray-700">
        <p className="text-gray-500 text-sm">
          develop mohannad ahmad tel:+963998171954
        </p>
      </footer>
    </div>
  );
};

export default App;