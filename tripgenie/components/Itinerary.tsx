import React, { useState, useRef, useEffect } from 'react';
import { TripPlan, Activity } from '../types';
import { Train, AlertTriangle, CloudSun, Backpack, Lock, Map as MapIcon, Loader2, SplitSquareHorizontal, Hotel, Calendar, Info, BedDouble, Wallet, ArrowLeft, ChevronDown, ChevronUp, Download } from 'lucide-react';
import AdUnlockModal from './AdUnlockModal';

interface Props {
  tripPlan: TripPlan;
  onDayClick: (day: number | undefined) => void;
  onNewTrip: () => void;
  onShowMap: () => void;
  onCompare: () => void;
  onPlaceClick: (activity: Activity) => void;
}

const ActivityCard: React.FC<{ activity: Activity, index: number, onClick: () => void }> = ({ activity, index, onClick }) => {
  const isHotel = activity.type === 'hotel' || activity.place_name.toLowerCase().includes('hotel');
  
  return (
    <div 
        onClick={onClick}
        className={`flex gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group cursor-pointer ${isHotel ? 'border-l-4 border-l-indigo-400' : ''}`}
    >
       <div className="flex-shrink-0 flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${isHotel ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-600'}`}>
                {index + 1}
            </div>
            {index < 100 && <div className="w-0.5 h-full bg-gray-50 mt-2 -mb-4"></div>}
       </div>
       <div className="flex-grow">
           <div className="flex justify-between items-start">
               <h4 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors">{activity.place_name}</h4>
               <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-500 capitalize">{activity.type}</span>
           </div>
           <p className="text-sm text-gray-600 mt-1">{activity.action}</p>
           {activity.transport_tip && (
               <div className="mt-2 text-xs text-indigo-500 flex items-center gap-1">
                   <Train className="w-3 h-3" /> {activity.transport_tip}
               </div>
           )}
       </div>
       <div className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
           <Info className="w-5 h-5 text-indigo-300" />
       </div>
    </div>
  );
};

const Itinerary: React.FC<Props> = ({ tripPlan, onDayClick, onNewTrip, onShowMap, onCompare, onPlaceClick }) => {
  const [activeTab, setActiveTab] = useState<'schedule' | 'survival'>('schedule');
  const [unlockedDelay, setUnlockedDelay] = useState(false);
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [showExportAd, setShowExportAd] = useState(false);
  
  // Header state
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
        if (scrollRef.current) {
            // Collapse if scrolled down more than 50px
            setIsHeaderCollapsed(scrollRef.current.scrollTop > 50);
        }
    };

    const div = scrollRef.current;
    if (div) {
        div.addEventListener('scroll', handleScroll);
    }
    return () => {
        if (div) div.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleUnlock = () => {
      setIsUnlocking(true);
      setTimeout(() => {
          setIsUnlocking(false);
          setUnlockedDelay(true);
      }, 2000);
  };

  const generateCSV = () => {
      // Removed Latitude, Longitude, and Google Maps Link
      const header = ['Day', 'Theme', 'Place', 'Action', 'Type', 'Cost Estimate'];
      const rows = [];

      tripPlan.days.forEach(day => {
          day.activities.forEach(act => {
              rows.push([
                  `Day ${day.day_number}`,
                  day.theme,
                  `"${act.place_name}"`, // Quote to handle commas
                  `"${act.action}"`,
                  act.type,
                  act.cost_estimate || ''
              ]);
          });
      });

      const csvContent = [
          header.join(','),
          ...rows.map(row => row.join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `TripGenie_Plan_${new Date().toISOString().slice(0,10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 relative">
      
      {/* Ad Modal for Export */}
      {showExportAd && (
          <AdUnlockModal 
            duration={15} // Require 15 seconds watch time for excel download
            onClose={() => setShowExportAd(false)} 
            onReward={() => { setShowExportAd(false); generateCSV(); }}
            title="Unlock Download"
            message="Watch a full ad to download your complete itinerary as an Excel/CSV file."
          />
      )}

      {/* Header Container */}
      <div className={`bg-white shadow-sm z-30 border-b border-gray-200 flex-shrink-0 transition-all duration-300 ease-in-out ${isHeaderCollapsed ? 'p-3' : 'p-4'}`}>
        
        {/* Top Row: Back + Title */}
        <div className="flex items-start gap-3 mb-2">
            <button 
                onClick={onNewTrip}
                className="p-1.5 -ml-1.5 hover:bg-gray-100 rounded-full transition text-gray-600"
                aria-label="Back to New Trip"
            >
                <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex-1 overflow-hidden">
                <h2 className={`font-bold text-gray-900 leading-tight transition-all ${isHeaderCollapsed ? 'text-lg line-clamp-1 mt-1' : 'text-xl'}`}>
                    {tripPlan.trip_summary}
                </h2>
                {!isHeaderCollapsed && tripPlan.date_reasoning && (
                    <p className="text-xs text-indigo-500 mt-1 flex items-center gap-1">
                        <Info className="w-3 h-3" /> {tripPlan.date_reasoning}
                    </p>
                )}
            </div>
            <button 
                onClick={() => setIsHeaderCollapsed(!isHeaderCollapsed)}
                className="text-gray-400 hover:text-gray-600"
            >
                {isHeaderCollapsed ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
            </button>
        </div>

        {/* Details - Collapsible */}
        <div className={`overflow-hidden transition-all duration-300 ${isHeaderCollapsed ? 'max-h-0 opacity-0' : 'max-h-40 opacity-100'}`}>
            <div className="grid grid-cols-2 gap-2 mb-4">
                 <div className="bg-indigo-50 p-2 rounded-lg flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <div>
                        <div className="text-[10px] text-indigo-400 font-bold uppercase">Dates</div>
                        <div className="text-xs font-semibold text-indigo-900">{tripPlan.suggested_dates || "Flexible"}</div>
                    </div>
                 </div>
                 <div className="bg-green-50 p-2 rounded-lg flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-green-600" />
                    <div>
                        <div className="text-[10px] text-green-400 font-bold uppercase">Est. Budget</div>
                        <div className="text-xs font-semibold text-green-900">{tripPlan.estimated_budget}</div>
                    </div>
                 </div>
                 <div className="bg-orange-50 p-2 rounded-lg flex items-center gap-2 col-span-2">
                    <CloudSun className="w-4 h-4 text-orange-600" />
                    <div>
                        <div className="text-[10px] text-orange-400 font-bold uppercase">Weather</div>
                        <div className="text-xs font-semibold text-orange-900 line-clamp-1">{tripPlan.weather_forecast}</div>
                    </div>
                 </div>
            </div>
        </div>

        {/* Compact Summary (Visible only when collapsed) */}
        <div className={`flex items-center gap-3 text-xs text-gray-600 mb-2 transition-all duration-300 ${isHeaderCollapsed ? 'max-h-6 opacity-100' : 'max-h-0 opacity-0 hidden'}`}>
            {tripPlan.suggested_dates && (
                 <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                    <span className="font-medium text-indigo-900">{tripPlan.suggested_dates}</span>
                 </div>
            )}
            <div className="h-3 w-px bg-gray-300"></div>
            <div className="flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-green-600" />
                <span className="font-medium text-green-800">{tripPlan.estimated_budget}</span>
            </div>
        </div>

        {/* Controls Row */}
        <div className="flex justify-between items-center gap-2">
             <div className="flex bg-gray-100 p-0.5 rounded-lg flex-1">
                <button 
                    onClick={() => setActiveTab('schedule')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeTab === 'schedule' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Itinerary
                </button>
                <button 
                    onClick={() => setActiveTab('survival')}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${activeTab === 'survival' ? 'bg-white text-red-500 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Survival Kit
                </button>
            </div>
            <div className="flex gap-2">
                <button 
                    onClick={() => setShowExportAd(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 rounded-lg text-xs font-bold transition"
                    title="Export as Excel"
                >
                    <Download className="w-3.5 h-3.5" />
                </button>
                <button 
                    onClick={onCompare}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold transition"
                >
                    <SplitSquareHorizontal className="w-3.5 h-3.5" /> Compare
                </button>
            </div>
        </div>
      </div>

      {/* Content Area - Scrollable */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-6 pb-32">
        {activeTab === 'schedule' ? (
            <>  
                {/* Hotel Suggestions */}
                {tripPlan.suggested_hotels && tripPlan.suggested_hotels.length > 0 && (
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-100">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
                            <BedDouble className="w-5 h-5 text-indigo-500" /> Suggested Stays
                        </h3>
                        <div className="space-y-3">
                            {tripPlan.suggested_hotels.map((hotel, idx) => (
                                <div key={idx} className="border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                                    <div className="flex justify-between items-start">
                                        <span className="font-semibold text-gray-900 text-sm">{hotel.name}</span>
                                        <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">{hotel.price_range}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">{hotel.description}</p>
                                    <a 
                                        href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(hotel.name)}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs text-indigo-600 hover:underline mt-1 inline-block"
                                    >
                                        Check Rates &rarr;
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {tripPlan.days.map((day) => (
                    <div key={day.day_number} className="space-y-3">
                        <div 
                            className="flex items-center justify-between sticky top-0 bg-gray-50/95 backdrop-blur-sm py-2 cursor-pointer z-10 border-b border-gray-100"
                            onClick={() => onDayClick(day.day_number)}
                        >
                            <h3 className="text-lg font-bold text-indigo-900">Day {day.day_number}: {day.theme}</h3>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onShowMap(); onDayClick(day.day_number); }}
                                className="text-xs text-indigo-600 font-medium flex items-center gap-1 lg:hidden"
                            >
                                <MapIcon className="w-3 h-3" /> Show
                            </button>
                            <span className="hidden lg:block text-xs text-indigo-400">Click to view on map</span>
                        </div>
                        <div className="space-y-3">
                            {day.activities.map((act, idx) => (
                                <ActivityCard 
                                    key={idx} 
                                    activity={act} 
                                    index={idx} 
                                    onClick={() => onPlaceClick(act)} 
                                />
                            ))}
                        </div>
                        
                        {/* Inline Ad Mock */}
                        <div className="my-6 mx-2 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-100 rounded-lg text-center shadow-sm">
                            <span className="text-[10px] text-yellow-600 font-bold uppercase tracking-wider block mb-1">Sponsored</span>
                            <p className="text-sm font-bold text-gray-800">Get 5% off Local Travel Pass!</p>
                            <button className="mt-2 text-xs bg-gray-900 text-white hover:bg-black px-4 py-1.5 rounded-full font-bold transition">Book Now</button>
                        </div>
                    </div>
                ))}
            </>
        ) : (
            <div className="space-y-6">
                 {/* Warnings */}
                <div className="bg-red-50 p-4 rounded-xl border border-red-100">
                    <h3 className="font-bold text-red-700 flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5" /> Tourist Traps & Warnings
                    </h3>
                    <ul className="list-disc list-inside text-sm text-red-800 space-y-1">
                        {tripPlan.warnings.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                </div>

                {/* Packing */}
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h3 className="font-bold text-blue-700 flex items-center gap-2 mb-3">
                        <Backpack className="w-5 h-5" /> Essential Packing
                    </h3>
                    <ul className="list-disc list-inside text-sm text-blue-800 space-y-1">
                        {tripPlan.packing_list.map((w, i) => <li key={i}>{w}</li>)}
                    </ul>
                </div>

                {/* Weather & Transport */}
                <div className="grid grid-cols-1 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border">
                        <h4 className="font-bold flex items-center gap-2 text-gray-700 text-sm mb-2"><CloudSun className="w-4 h-4"/> Weather</h4>
                        <p className="text-sm text-gray-600">{tripPlan.weather_forecast}</p>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border">
                        <h4 className="font-bold flex items-center gap-2 text-gray-700 text-sm mb-2"><Train className="w-4 h-4"/> Transport</h4>
                        <p className="text-sm text-gray-600">{tripPlan.transport_advice}</p>
                    </div>
                </div>

                {/* Locked Flight Delay Section */}
                <div className={`p-4 rounded-xl border-2 border-dashed ${unlockedDelay ? 'bg-green-50 border-green-200' : 'bg-gray-100 border-gray-300'}`}>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-gray-800">Flight Delay Contingency</h3>
                        {!unlockedDelay && <Lock className="w-4 h-4 text-gray-500" />}
                    </div>
                    {unlockedDelay ? (
                        <p className="text-sm text-green-800 animate-fadeIn">
                            {tripPlan.flight_delay_backup || "If your flight is delayed, head to the airport lounge (2F) or book a pod at the Capsule Hotel in Terminal 1. Relax, your trip is still on!"}
                        </p>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-xs text-gray-500 mb-3">Unlock specific advice for delayed flights & missed connections.</p>
                            <button 
                                onClick={handleUnlock}
                                disabled={isUnlocking}
                                className="bg-gray-800 text-white text-xs px-4 py-2 rounded-full font-bold hover:bg-gray-900 transition flex items-center justify-center gap-2 mx-auto disabled:opacity-70"
                            >
                                {isUnlocking ? <><Loader2 className="w-3 h-3 animate-spin"/> Unlocking...</> : "Watch Ad to Unlock"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default Itinerary;