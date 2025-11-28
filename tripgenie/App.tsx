import React, { useState, useEffect } from 'react';
import { AppState, TripPlan, UserPreferences } from './types';
import PreferencesForm from './components/PreferencesForm';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './components/Dashboard';
import SecurityGuard from './components/SecurityGuard';
import { generateTripPlan } from './services/geminiService';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);
  
  // New state to coordinate Ad + AI
  const [isAiReady, setIsAiReady] = useState(false);

  const handlePreferencesSubmit = async (prefs: UserPreferences) => {
    setPreferences(prefs);
    setAppState(AppState.LOADING);
    setIsAiReady(false);
    setTripPlan(null);
    
    try {
      // Start AI generation
      const plan = await generateTripPlan(prefs);
      setTripPlan(plan);
      setIsAiReady(true);
      // We DO NOT set dashboard here. We wait for LoadingScreen to call onAdComplete
    } catch (error) {
      console.error("Failed to generate trip", error);
      alert("We couldn't generate a trip right now. Please check your API Key.");
      setAppState(AppState.LANDING);
    }
  };

  const handleAdComplete = () => {
      // This is called by LoadingScreen when BOTH Ad is finished AND User clicks continue
      if (tripPlan) {
          setAppState(AppState.DASHBOARD);
      }
  };

  const handleReset = () => {
    setTripPlan(null);
    setPreferences(null);
    setAppState(AppState.LANDING);
    setIsAiReady(false);
  };

  return (
    <div className="h-screen w-screen overflow-hidden font-sans select-none">
      <SecurityGuard />
      
      {appState === AppState.LANDING && (
        <PreferencesForm onSubmit={handlePreferencesSubmit} />
      )}
      
      {appState === AppState.LOADING && (
        <LoadingScreen 
            isAiReady={isAiReady}
            onAdComplete={handleAdComplete}
        />
      )}
      
      {appState === AppState.DASHBOARD && tripPlan && preferences && (
        <Dashboard 
          initialPlan={tripPlan} 
          preferences={preferences} 
          onNewTrip={handleReset}
        />
      )}
    </div>
  );
};

export default App;