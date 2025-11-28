import React, { useState, useEffect } from 'react';
import { Send, Sparkles, Loader2, X, CheckCircle } from 'lucide-react';

interface Props {
  onSendMessage: (msg: string) => void;
  isUpdating: boolean;
}

const ChatAssistant: React.FC<Props> = ({ onSendMessage, isUpdating }) => {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Show prompt after a short delay
    const timer = setTimeout(() => setShowHint(true), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
      // Show success message when updating finishes
      if (!isUpdating && showSuccess) {
          const timer = setTimeout(() => setShowSuccess(false), 3000);
          return () => clearTimeout(timer);
      }
  }, [isUpdating, showSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isUpdating) {
      onSendMessage(input);
      setInput('');
      setShowSuccess(true); // Will be shown after update finishes (or managed via parent state ideally, but local works for interaction flow)
    }
  };

  if (!isOpen) {
      return (
        <div className="absolute bottom-6 right-6 z-[1000] flex flex-col items-end gap-2">
            {/* Status Feedback Bubble */}
            {isUpdating && (
                 <div className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-xl mb-2 flex items-center gap-2 animate-bounce">
                    <Loader2 className="w-4 h-4 animate-spin"/>
                    <span className="text-sm font-bold">Updating your plan...</span>
                 </div>
            )}
            {!isUpdating && showSuccess && (
                 <div className="bg-green-500 text-white px-4 py-2 rounded-xl shadow-xl mb-2 flex items-center gap-2 animate-fadeIn">
                    <CheckCircle className="w-4 h-4"/>
                    <span className="text-sm font-bold">Plan updated!</span>
                 </div>
            )}

            {/* Pulsing Hint Bubble */}
            {showHint && !isUpdating && (
                <div 
                    className="bg-white px-4 py-2 rounded-xl shadow-xl border border-gray-100 mb-2 animate-bounce cursor-pointer relative" 
                    onClick={() => setIsOpen(true)}
                >
                    <p className="text-sm font-bold text-indigo-600">Want to change the plan?</p>
                    <div className="absolute -bottom-1 right-6 w-3 h-3 bg-white border-b border-r border-gray-100 transform rotate-45"></div>
                    <button onClick={(e) => { e.stopPropagation(); setShowHint(false); }} className="absolute -top-2 -left-2 bg-gray-200 rounded-full p-0.5"><X className="w-3 h-3 text-gray-500"/></button>
                </div>
            )}
            
            {/* FAB */}
            <button 
                onClick={() => { setIsOpen(true); setShowHint(false); }}
                className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-2xl transition transform hover:scale-110 group relative"
            >
                <Sparkles className="w-6 h-6 group-hover:rotate-12 transition" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
            </button>
        </div>
      );
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 lg:left-auto lg:right-6 lg:bottom-6 z-[1000] flex flex-col items-end">
        <div className="bg-white w-full lg:w-96 rounded-t-2xl lg:rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
            {/* Header */}
            <div className="bg-indigo-600 p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="font-bold text-sm">Trip Assistant</span>
                </div>
                <button onClick={() => setIsOpen(false)} className="hover:bg-indigo-500 p-1 rounded transition">
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4 bg-gray-50">
                <p className="text-xs text-gray-500 mb-3 bg-white p-3 rounded-lg border border-gray-200">
                    <span className="font-bold text-indigo-500 block mb-1">Travel Tip:</span>
                    Try saying "I don't like museums", "Add a sushi dinner on Day 1", or "Make it more family friendly".
                </p>

                <form onSubmit={handleSubmit} className="relative">
                    <input
                        type="text"
                        className="w-full bg-white border border-gray-300 rounded-full pl-4 pr-12 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        placeholder="Modify your trip..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={isUpdating}
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={isUpdating || !input.trim()}
                        className="absolute right-2 top-2 bg-indigo-600 text-white p-1.5 rounded-full hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
                    >
                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </form>
            </div>
        </div>
    </div>
  );
};

export default ChatAssistant;
