import React, { useEffect, useState } from 'react';
import { TripPlan, UserPreferences } from '../types';
import { generateStandardTour } from '../services/geminiService';
import { X, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface Props {
  currentPlan: TripPlan;
  preferences: UserPreferences;
  onClose: () => void;
}

const ComparisonModal: React.FC<Props> = ({ currentPlan, preferences, onClose }) => {
  const [standardPlan, setStandardPlan] = useState<TripPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComparison = async () => {
        try {
            const result = await generateStandardTour(preferences);
            setStandardPlan(result);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };
    fetchComparison();
  }, [preferences]);

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-50">
            <div>
                <h2 className="text-xl font-bold text-gray-800">Trip Comparison</h2>
                <p className="text-sm text-gray-500">Your personalized plan vs. A typical group tour</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition"><X className="w-5 h-5"/></button>
        </div>

        {/* Content */}
        {loading ? (
            <div className="flex-1 flex flex-col items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-indigo-600 mb-4" />
                <p className="text-gray-500">Generating standard tour data...</p>
            </div>
        ) : (
            <div className="flex-1 overflow-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                    {/* Your Plan */}
                    <div className="p-6 border-r border-gray-100 bg-indigo-50/30 overflow-y-auto">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Your Plan</span>
                            <span className="text-green-600 text-xs font-bold flex items-center gap-1"><CheckCircle className="w-3 h-3"/> Personalized</span>
                        </div>
                        
                        <div className="space-y-8">
                            {currentPlan.days.map(day => (
                                <div key={day.day_number}>
                                    <h3 className="font-bold text-indigo-900 mb-3 border-b border-indigo-100 pb-1">Day {day.day_number}: {day.theme}</h3>
                                    <ul className="space-y-3">
                                        {day.activities.map((act, i) => (
                                            <li key={i} className="flex gap-3 text-sm">
                                                <span className="font-bold text-indigo-400 min-w-[20px]">{i+1}.</span>
                                                <div>
                                                    <span className="font-semibold text-gray-800">{act.place_name}</span>
                                                    <p className="text-xs text-gray-600 mt-0.5">{act.action}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Standard Tour */}
                    <div className="p-6 bg-white overflow-y-auto">
                         <div className="flex items-center gap-2 mb-6">
                            <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">Standard Group Tour</span>
                            <span className="text-gray-400 text-xs font-bold flex items-center gap-1"><XCircle className="w-3 h-3"/> Generic</span>
                        </div>

                         <div className="space-y-8 opacity-80 grayscale-[0.3]">
                            {standardPlan?.days.map(day => (
                                <div key={day.day_number}>
                                    <h3 className="font-bold text-gray-700 mb-3 border-b border-gray-100 pb-1">Day {day.day_number}: {day.theme}</h3>
                                    <ul className="space-y-3">
                                        {day.activities.map((act, i) => (
                                            <li key={i} className="flex gap-3 text-sm">
                                                <span className="font-bold text-gray-400 min-w-[20px]">{i+1}.</span>
                                                <div>
                                                    <span className="font-semibold text-gray-700">{act.place_name}</span>
                                                    <p className="text-xs text-gray-500 mt-0.5">{act.action}</p>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default ComparisonModal;