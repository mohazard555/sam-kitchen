
import React, { useState } from 'react';
import type { AdminCredentials } from '../types.ts';

interface LoginProps {
  onLoginSuccess: () => void;
  onClose: () => void;
  credentials: AdminCredentials;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess, onClose, credentials }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === credentials.username && password === credentials.password) {
      setError(null);
      onLoginSuccess();
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة.');
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md"
        onClick={e => e.stopPropagation()}
      >
        <form 
          onSubmit={handleSubmit}
          className="bg-gray-800 shadow-lg rounded-2xl px-8 pt-6 pb-8"
        >
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="mb-6 text-center">
             <h1 className="text-3xl font-extrabold text-white">
                sam <span className="text-salmon">kitchen</span>
             </h1>
             <p className="text-gray-400 mt-2">تسجيل دخول المدير</p>
          </div>
          
          {error && (
            <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-center">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="username">
              اسم المستخدم
            </label>
            <input
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 bg-gray-700 text-gray-200 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-salmon"
              id="username"
              type="text"
              placeholder="اسم المستخدم"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="password">
              كلمة المرور
            </label>
            <input
              className="shadow appearance-none border border-gray-600 rounded-lg w-full py-3 px-4 bg-gray-700 text-gray-200 mb-3 leading-tight focus:outline-none focus:shadow-outline focus:ring-2 focus:ring-salmon"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="w-full bg-salmon hover:bg-opacity-90 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition duration-300"
              type="submit"
            >
              تسجيل الدخول
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};