import React from 'react';
import { Activity } from '../types';
import { X, ExternalLink, Instagram, Search, Image as ImageIcon, Video, Ticket } from 'lucide-react';

interface Props {
  activity: Activity;
  onClose: () => void;
}

const PlaceDetailsModal: React.FC<Props> = ({ activity, onClose }) => {
  const searchQuery = encodeURIComponent(activity.place_name);

  return (
    <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl transform transition-all scale-100 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="bg-indigo-600 p-6 relative">
          <button 
            onClick={onClose} 
            className="absolute top-4 right-4 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="mt-4">
            <span className="text-indigo-200 text-xs font-bold uppercase tracking-wider">{activity.type}</span>
            <h2 className="text-2xl font-bold text-white leading-tight mt-1">{activity.place_name}</h2>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
            <div className="mb-6">
                <h3 className="text-sm font-bold text-gray-900 mb-2">About this place</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                    {activity.description || `${activity.place_name} is a must-visit spot. It offers unique experiences typical of the local culture. Travelers recommend spending some time here to soak in the atmosphere.`}
                </p>
                <div className="mt-3 flex items-center gap-2 text-sm text-indigo-600 font-medium">
                     <span className="bg-indigo-50 px-2 py-1 rounded">{activity.action}</span>
                     {activity.cost_estimate && <span className="bg-green-50 text-green-700 px-2 py-1 rounded">{activity.cost_estimate}</span>}
                </div>
            </div>

            {/* Booking Action */}
            {(activity.type === 'sightseeing' || activity.type === 'other' || activity.type === 'transport') && (
                 <a 
                    href={`https://www.klook.com/search?query=${searchQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold py-3 rounded-xl shadow-lg hover:shadow-orange-500/30 transition transform hover:scale-[1.02] mb-6"
                 >
                     <Ticket className="w-5 h-5" />
                     Book Tickets / Tours
                 </a>
            )}

            <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900">See what others are saying</h3>
                
                <a 
                    href={`https://www.instagram.com/explore/tags/${activity.place_name.replace(/[^a-zA-Z0-9]/g, '')}/`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full p-4 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <Instagram className="w-6 h-6" />
                        <div className="text-left">
                            <span className="block text-sm font-bold">Instagram Photos</span>
                            <span className="block text-xs opacity-90">See vibes & aesthetics</span>
                        </div>
                    </div>
                    <ExternalLink className="w-5 h-5 opacity-70" />
                </a>

                <a 
                    href={`https://www.tiktok.com/search?q=${searchQuery}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full p-4 rounded-xl bg-black text-white hover:opacity-90 transition shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <Video className="w-6 h-6" />
                        <div className="text-left">
                            <span className="block text-sm font-bold">TikTok Reviews</span>
                            <span className="block text-xs opacity-90">Watch video guides</span>
                        </div>
                    </div>
                    <ExternalLink className="w-5 h-5 opacity-70" />
                </a>

                <a 
                    href={`https://www.google.com/search?tbm=isch&q=${searchQuery}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full p-4 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-100 p-1.5 rounded-full text-blue-600">
                             <ImageIcon className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <span className="block text-sm font-bold text-gray-800">Google Images</span>
                            <span className="block text-xs text-gray-500">Browse photo gallery</span>
                        </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                </a>

                 <a 
                    href={`https://www.google.com/search?q=${searchQuery}+reviews`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between w-full p-4 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 transition shadow-sm"
                >
                    <div className="flex items-center gap-3">
                        <div className="bg-green-100 p-1.5 rounded-full text-green-600">
                             <Search className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                            <span className="block text-sm font-bold text-gray-800">Web Reviews</span>
                            <span className="block text-xs text-gray-500">Read blogs & articles</span>
                        </div>
                    </div>
                    <ExternalLink className="w-5 h-5 text-gray-400" />
                </a>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceDetailsModal;