import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 2.5s display, then start fade out. 3s total.
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete();
      }, 500); // 500ms fade transition
    }, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

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
          className="w-32 h-32 sm:w-40 sm:h-40 object-contain drop-shadow-md animate-in zoom-in duration-700"
        />
        <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-slate-100 tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          Sanvy Corporation
        </h1>
        {/* Subtle loading indicator */}
        <div className="w-12 h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-2 animate-in fade-in duration-1000 delay-500">
          <div className="h-full bg-indigo-600 rounded-full w-full origin-left animate-pulse" />
        </div>
      </div>
    </div>
  );
};
