import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { TripPlan, DayPlan } from '../types';
import { ArrowLeft } from 'lucide-react';

// Fix Leaflet default icon issue in React
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const createCustomIcon = (type: string, number: number) => {
    let color = '#3B82F6'; // blue
    if (type === 'food') color = '#EF4444'; // red
    if (type === 'transport') color = '#10B981'; // green
    if (type === 'hotel') color = '#8B5CF6'; // purple

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="${color}" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
        <circle cx="12" cy="10" r="3" fill="white"></circle>
    </svg>
    `;
    
    return L.divIcon({
        className: 'custom-icon',
        html: `<div style="position: relative;">
                 ${svg}
                 <span style="position: absolute; top: 0; right: -8px; background: white; border-radius: 50%; width: 14px; height: 14px; font-size: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold; border: 1px solid gray;">${number}</span>
               </div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30]
    });
};

interface MapUpdaterProps {
    days: DayPlan[];
}

const MapUpdater: React.FC<MapUpdaterProps> = ({ days }) => {
    const map = useMap();

    useEffect(() => {
        const bounds = L.latLngBounds([]);
        let hasPoints = false;

        days.forEach(day => {
            day.activities.forEach(act => {
                if (act.latitude && act.longitude) {
                    bounds.extend([act.latitude, act.longitude]);
                    hasPoints = true;
                }
            });
        });

        if (hasPoints) {
            map.flyToBounds(bounds, { padding: [50, 50] });
        }
    }, [days, map]);

    return null;
};

interface Props {
  tripPlan: TripPlan;
  selectedDay?: number;
  onBackToList?: () => void;
}

const Map: React.FC<Props> = ({ tripPlan, selectedDay, onBackToList }) => {
  const daysToRender = selectedDay 
    ? tripPlan.days.filter(d => d.day_number === selectedDay) 
    : tripPlan.days;

  return (
    <div className="h-full w-full relative">
      {/* Mobile Back Button */}
      {onBackToList && (
        <button 
          onClick={onBackToList}
          className="lg:hidden absolute top-4 left-4 z-[1000] bg-white text-gray-800 p-2 rounded-full shadow-lg border border-gray-200"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      )}

      <MapContainer 
        center={[0, 0]} 
        zoom={2} 
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />
        
        <MapUpdater days={daysToRender} />

        {daysToRender.map((day, dayIndex) => {
            const positions: [number, number][] = [];
            
            return (
                <React.Fragment key={day.day_number}>
                    {day.activities.map((act, actIndex) => {
                        if (!act.latitude || !act.longitude) return null;
                        const pos: [number, number] = [act.latitude, act.longitude];
                        positions.push(pos);

                        return (
                            <Marker 
                                key={`${day.day_number}-${actIndex}`}
                                position={pos}
                                icon={createCustomIcon(act.type, actIndex + 1)}
                            >
                                <Popup>
                                    <div className="p-1">
                                        <div className="font-bold text-sm mb-1">Day {day.day_number}: {act.place_name}</div>
                                        <div className="text-xs text-gray-600">{act.action}</div>
                                        {act.cost_estimate && <div className="text-xs text-green-600 font-semibold mt-1">{act.cost_estimate}</div>}
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                    
                    {positions.length > 1 && (
                        <Polyline 
                            positions={positions} 
                            pathOptions={{ 
                                color: dayIndex % 2 === 0 ? '#4F46E5' : '#0ea5e9',
                                weight: 4,
                                opacity: 0.7,
                                dashArray: selectedDay ? undefined : '5, 10' 
                            }} 
                        />
                    )}
                </React.Fragment>
            );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;