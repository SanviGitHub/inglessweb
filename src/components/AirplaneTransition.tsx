import React, { useEffect } from 'react';
import { Plane } from 'lucide-react';

interface AirplaneTransitionProps {
  onComplete: () => void;
}

export const AirplaneTransition: React.FC<AirplaneTransitionProps> = ({ onComplete }) => {
  useEffect(() => {
    // 3 seconds cinematic
    const timer = setTimeout(() => {
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, []); // Remove onComplete from dependency array so it never resets the timer

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-gradient-to-b from-sky-400 to-sky-200 flex items-center justify-center animate-in fade-in duration-300">
      <style>
        {`
          @keyframes flyAcross {
            0% { transform: translate(-100vw, 100vh) rotate(45deg) scale(0.5); }
            40% { transform: translate(-10vw, 10vh) rotate(45deg) scale(1.2); }
            60% { transform: translate(10vw, -10vh) rotate(45deg) scale(1.2); }
            100% { transform: translate(150vw, -150vh) rotate(45deg) scale(0.5); }
          }
          @keyframes cloudMove1 {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(-100vw); }
          }
          @keyframes cloudMove2 {
            0% { transform: translateX(100vw); }
            100% { transform: translateX(-150vw); }
          }
          .plane-anim {
            animation: flyAcross 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
          .cloud-1 { animation: cloudMove1 4s linear infinite; }
          .cloud-2 { animation: cloudMove2 3s linear infinite; }
          .cloud-3 { animation: cloudMove1 5s linear infinite; }
        `}
      </style>
      
      {/* Background Clouds */}
      <div className="absolute top-1/4 left-0 text-white opacity-80 cloud-1">
        <div className="w-32 h-10 bg-white rounded-full blur-sm relative">
            <div className="absolute top-[-15px] left-[15px] w-12 h-12 bg-white rounded-full"></div>
            <div className="absolute top-[-25px] right-[25px] w-16 h-16 bg-white rounded-full"></div>
        </div>
      </div>

      <div className="absolute top-2/3 left-0 text-white opacity-60 cloud-2" style={{ animationDelay: '0.5s' }}>
        <div className="w-48 h-14 bg-white rounded-full blur-md relative">
            <div className="absolute top-[-20px] left-[20px] w-16 h-16 bg-white rounded-full"></div>
            <div className="absolute top-[-30px] right-[30px] w-20 h-20 bg-white rounded-full"></div>
        </div>
      </div>

      <div className="absolute top-1/2 left-0 text-white opacity-90 cloud-3" style={{ animationDelay: '1s' }}>
        <div className="w-24 h-8 bg-white rounded-full blur-sm relative">
            <div className="absolute top-[-10px] left-[10px] w-10 h-10 bg-white rounded-full"></div>
            <div className="absolute top-[-15px] right-[15px] w-12 h-12 bg-white rounded-full"></div>
        </div>
      </div>

      {/* Airplane - 3rd Person View */}
      <div className="plane-anim text-white drop-shadow-2xl">
        <Plane size={140} fill="currentColor" strokeWidth={1} className="text-white drop-shadow-xl" />
      </div>
    </div>
  );
};
