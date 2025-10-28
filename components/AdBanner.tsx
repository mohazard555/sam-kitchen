import React from 'react';
import type { AdConfig } from '../types';

interface AdBannerProps {
  ad: AdConfig;
}

export const AdBanner: React.FC<AdBannerProps> = ({ ad }) => {
  if (!ad || !ad.enabled) {
    return null;
  }

  return (
    <div className="mt-8 w-full">
      <a 
        href={ad.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="block bg-gray-800 rounded-2xl shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow duration-300"
      >
        <div className="relative">
          <img 
            src={ad.imageUrl} 
            alt="Advertisement" 
            className="w-full h-48 object-cover group-hover:opacity-90 transition-opacity"
          />
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <p className="text-white text-lg font-semibold text-center p-4">
              {ad.description}
            </p>
          </div>
        </div>
      </a>
    </div>
  );
};
