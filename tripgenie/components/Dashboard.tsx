// Test
import React, { useState, useRef, useEffect } from 'react';
import { TripPlan, UserPreferences, Activity } from '../types';
import Itinerary from './Itinerary';
import Map from './Map';
import ChatAssistant from './ChatAssistant';
import { modifyTripPlan } from '../services/geminiService';
import ComparisonModal from './ComparisonModal';
import PlaceDetailsModal from './PlaceDetailsModal';
import { GripVertical } from 'lucide-react';

interface Props {
  initialPlan: TripPlan;
  preferences: UserPreferences;
  onNewTrip: () => void;
}

const Dashboard: React.FC<Props> = ({ initialPlan, preferences, onNewTrip }) => {
  const [plan, setPlan] = useState<TripPlan>(initialPlan);
  const [selectedDay, setSelectedDay] = useState<number | undefined>(undefined);
  const [isUpdating, setIsUpdating] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'map'>('list');
  const [showComparison, setShowComparison] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Resizable panel state
  const [leftPanelWidth, setLeftPanelWidth] = useState(35); // Percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const newWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100;
      
      // Constraints
      if (newWidth > 20 && newWidth < 80) {
        setLeftPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const handleModification = async (instruction: string) => {
    setIsUpdating(true);
    try {
      const newPlan = await modifyTripPlan(plan, instruction);
      setPlan(newPlan);
    } catch (e) {
      alert("System is momentarily overwhelmed. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBookTrip = () => {
    // 1. Sanitize helper: "Kuala Lumpur, Malaysia" -> "kuala-lumpur"
    const sanitizeCity = (input: string) => {
        if (!input) return "everywhere";
        // Take first part if comma exists, then trim, lowercase, and replace spaces/special chars with hyphens
        return input.split(',')[0].trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
    };

    const origin = sanitizeCity(preferences.departFrom || "everywhere");
    const dest = sanitizeCity(preferences.destination);

    // 2. Date Parsing for YYMMDD
    let datePath = "";
    
    // Attempt to parse dates from string like "Oct 10 - Oct 15" or "10/10 - 15/10"
    // We look for two groups of numbers/months
    const text = preferences.duration.toLowerCase();
    
    // Map month names
    const months: {[key:string]: string} = {
        jan: '01', feb: '02', mar: '03', apr: '04', may: '05', jun: '06',
        jul: '07', aug: '08', sep: '09', oct: '10', nov: '11', dec: '12',
        january: '01', february: '02', march: '03', april: '04', june: '06',
        july: '07', august: '08', september: '09', october: '10', november: '11', december: '12'
    };

    // Helper to zero-pad
    const pad = (n: string | number) => n.toString().padStart(2, '0');

    // Strategy 1: Look for "Month DD" pattern (e.g. Oct 10)
    const monthRegex = /([a-z]+)[^0-9]+(\d{1,2})/g;
    const matchesMonth = [...text.matchAll(monthRegex)];

    if (matchesMonth.length >= 2) {
        // We found at least two dates
        const currentYear = new Date().getFullYear();
        const currentMonth = new Date().getMonth() + 1;

        const getYYMMDD = (mName: string, dStr: string) => {
             // Find month number
             let mNum = '01';
             for (const [key, val] of Object.entries(months)) {
                 if (mName.startsWith(key)) { mNum = val; break; }
             }
             
             // Logic: If month is earlier than current month, assume next year (YY+1)
             // else assume current year (YY)
             const mInt = parseInt(mNum);
             const yearFull = (mInt < currentMonth) ? currentYear + 1 : currentYear;
             const yy = yearFull.toString().slice(-2);
             
             return `${yy}${mNum}${pad(dStr)}`;
        };

        const startStr = getYYMMDD(matchesMonth[0][1], matchesMonth[0][2]);
        const endStr = getYYMMDD(matchesMonth[1][1], matchesMonth[1][2]);
        
        datePath = `/${startStr}/${endStr}`;
    }

    // 3. Construct URL
    // Format: skyscanner.com/transport/flights/[origin]/[dest]/[YYMMDD]/[YYMMDD]
    // const url = `https://www.skyscanner.com/transport/flights/${origin}/${dest}${datePath}`;
    const url = `https://www.skyscanner.com`;
    
    window.open(url, '_blank');
  };

  const handleDayClick = (day: number | undefined) => {
      setSelectedDay(day);
      if (window.innerWidth < 1024) {
          setMobileView('map');
      }
  };

  return (
    <div ref={containerRef} className="flex h-full w-full relative overflow-hidden">
      {/* Left Panel: Itinerary */}
      <div 
        className={`${mobileView === 'list' ? 'block' : 'hidden'} lg:block h-full border-r border-gray-200 relative bg-white flex flex-col z-20 shadow-xl lg:shadow-none transition-all duration-75 ease-linear`}
        style={{ width: window.innerWidth >= 1024 ? `${leftPanelWidth}%` : '100%' }}
      >
        <Itinerary 
            tripPlan={plan} 
            onDayClick={handleDayClick} 
            onNewTrip={onNewTrip} 
            onShowMap={() => setMobileView('map')}
            onCompare={() => setShowComparison(true)}
            onPlaceClick={(activity) => setSelectedActivity(activity)}
        />
        
        {/* Floating Book Button */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-30 lg:bottom-8 w-max">
            <button 
                onClick={handleBookTrip}
                className="bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold py-3 px-8 rounded-full shadow-lg shadow-orange-500/30 hover:scale-105 transition transform flex items-center gap-2 ring-2 ring-white"
            >
                Book Flights ✈️
            </button>
        </div>
      </div>

      {/* Resize Handle (Desktop Only) - Improved Visibility */}
      <div 
        className="hidden lg:flex w-5 hover:w-6 cursor-col-resize items-center justify-center bg-gray-100 border-l border-r border-gray-300 absolute top-0 bottom-0 z-50 group transition-all shadow-md hover:bg-indigo-50"
        style={{ left: `${leftPanelWidth}%`, transform: 'translateX(-50%)' }}
        onMouseDown={handleMouseDown}
      >
        <div className="h-8 w-1 flex flex-col justify-center gap-0.5">
             <GripVertical className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
        </div>
      </div>

      {/* Right Panel: Map */}
      <div 
        className={`${mobileView === 'map' ? 'block' : 'hidden'} lg:block h-full relative z-10 bg-gray-100`}
        style={{ width: window.innerWidth >= 1024 ? `${100 - leftPanelWidth}%` : '100%' }}
      >
        <Map 
            tripPlan={plan} 
            selectedDay={selectedDay} 
            onBackToList={() => setMobileView('list')}
        />
      </div>

      {/* Chat Overlay */}
      <ChatAssistant onSendMessage={handleModification} isUpdating={isUpdating} />

      {/* Comparison Modal */}
      {showComparison && (
          <ComparisonModal 
            currentPlan={plan} 
            preferences={preferences} 
            onClose={() => setShowComparison(false)} 
          />
      )}

      {/* Place Details Modal */}
      {selectedActivity && (
          <PlaceDetailsModal 
            activity={selectedActivity} 
            onClose={() => setSelectedActivity(null)} 
          />
      )}
    </div>
  );
};

export default Dashboard;
