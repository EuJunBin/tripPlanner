import React, { useEffect, useState } from 'react';
import { Loader2, PlayCircle, CheckCircle } from 'lucide-react';
import { MOCK_AD_VIDEOS } from '../constants';

interface Props {
  onAdComplete: () => void;
  isAiReady: boolean;
}

const LoadingScreen: React.FC<Props> = ({ onAdComplete, isAiReady }) => {
  const [timeLeft, setTimeLeft] = useState(10); // Mandatory 10s watch time
  const [adFinished, setAdFinished] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setAdFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleContinue = () => {
      if (adFinished && isAiReady) {
          onAdComplete();
      }
  };

  return (
    <div className="h-screen w-screen bg-black flex flex-col items-center justify-center z-50 absolute top-0 left-0">
      
      {/* Video Background/Player */}
      <div className="w-full h-full absolute inset-0 opacity-40">
           <video 
              src={MOCK_AD_VIDEOS[0]} 
              autoPlay 
              muted 
              loop 
              playsInline
              className="w-full h-full object-cover blur-sm"
          />
      </div>

      <div className="relative z-10 w-full max-w-lg p-6">
        {/* Ad Container */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gray-900 text-white p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <span className="bg-yellow-500 text-black text-[10px] font-bold px-2 py-0.5 rounded">AD</span>
                    <span className="text-xs text-gray-300">Sponsored Video</span>
                </div>
            </div>

            {/* Main Video Ad Area */}
            <div className="relative aspect-video bg-black">
                 <video 
                    src={MOCK_AD_VIDEOS[0]} 
                    autoPlay 
                    muted 
                    loop 
                    playsInline
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Footer Status */}
            <div className="p-6 text-center space-y-4">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Generating Your Perfect Trip...</h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Please watch this short video while our AI analyzes 5,000+ travel possibilities for you.
                    </p>
                </div>

                {/* AI Status Indicator */}
                <div className="bg-indigo-50 rounded-lg p-3 flex items-center justify-center gap-3">
                    {isAiReady ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                        <Loader2 className="w-5 h-5 text-indigo-600 animate-spin" />
                    )}
                    <span className={`text-sm font-bold ${isAiReady ? 'text-green-700' : 'text-indigo-700'}`}>
                        {isAiReady ? "Trip Generation Complete!" : "AI Processing..."}
                    </span>
                </div>

                <button
                    onClick={handleContinue}
                    disabled={!adFinished || !isAiReady}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform flex items-center justify-center gap-2
                        ${(adFinished && isAiReady) 
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-[1.02] hover:shadow-indigo-500/30 cursor-pointer' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    {(adFinished && isAiReady) ? (
                        <>View My Trip <PlayCircle className="w-5 h-5" /></>
                    ) : (
                        <>{!adFinished ? "Please Wait..." : "Finalizing details..."}</>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;