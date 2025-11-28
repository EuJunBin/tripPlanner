import React, { useState, useEffect } from 'react';
import { X, PlayCircle, Lock } from 'lucide-react';
import { MOCK_AD_VIDEOS } from '../constants';

interface Props {
  onClose: () => void;
  onReward: () => void;
  title?: string;
  message?: string;
  duration?: number;
}

const AdUnlockModal: React.FC<Props> = ({ 
  onClose, 
  onReward, 
  title = "Unlock Premium Content", 
  message = "Watch a short ad to unlock this feature.",
  duration = 5 
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setCanClose(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleFinish = () => {
      if (canClose) {
          onReward();
      }
  };

  return (
    <div className="fixed inset-0 z-[3000] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl">
        
        <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-yellow-400" />
                Ad Break
            </h3>
            {canClose ? (
                <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5"/></button>
            ) : (
                <span className="text-xs text-gray-400">Sponsored</span>
            )}
        </div>

        <div className="relative aspect-video bg-black">
            <video 
                src={MOCK_AD_VIDEOS[1]} 
                autoPlay 
                muted 
                playsInline
                className="w-full h-full object-cover"
                onEnded={() => setCanClose(true)}
            />
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 {!canClose && <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white opacity-50"></div>}
            </div>
             <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded">
                Sponsored: Amazing Travel Gear
            </div>
        </div>

        <div className="p-6 text-center">
            <div className="mb-4">
                <h4 className="text-lg font-bold text-gray-800 mb-1">{title}</h4>
                <p className="text-sm text-gray-500">{message}</p>
            </div>

            <button
                onClick={handleFinish}
                disabled={!canClose}
                className={`w-full py-3 rounded-xl font-bold transition flex items-center justify-center gap-2 ${canClose ? 'bg-green-600 text-white hover:bg-green-700 shadow-lg' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
                {canClose ? 'Collect Reward & Unlock' : 'Please wait...'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdUnlockModal;