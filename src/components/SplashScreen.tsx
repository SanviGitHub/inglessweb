import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!imageLoaded) return; // Wait for the logo to load first

    // 2.5s display after image load, then start fade out.
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 500); // 500ms fade transition
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete, imageLoaded]);

  // Fallback in case image fails to load or takes longer than 5 seconds
  useEffect(() => {
    const fallbackTimer = setTimeout(() => {
      if (!imageLoaded) setImageLoaded(true);
    }, 5000);
    return () => clearTimeout(fallbackTimer);
  }, [imageLoaded]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white dark:bg-slate-950 transition-opacity duration-500 ${
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex flex-col items-center gap-6">
        <img
          src="/sanvycorporation.png"
          alt="Sanvy Corporation"
          onLoad={() => setImageLoaded(true)}
          className={`w-32 h-32 sm:w-40 sm:h-40 object-cover rounded-full border-2 border-slate-200 dark:border-slate-800 shadow-sm transition-all duration-700 ${
            imageLoaded ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
          }`}
        />
        <h1 className={`text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight transition-all duration-700 delay-300 ${
            imageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}>
          Sanvy Corporation
        </h1>
        {/* Subtle loading indicator */}
        <div className={`w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-2 transition-all duration-1000 delay-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
        }`}>
          <div className="h-full bg-indigo-600 rounded-full w-full origin-left animate-pulse" />
        </div>
      </div>
    </div>
  );
};

