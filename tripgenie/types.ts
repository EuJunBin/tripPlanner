export type Language = 
  | 'English' 
  | '中文' 
  | '日本語' 
  | 'Hindi' 
  | 'Spanish' 
  | 'Arabic' 
  | 'French' 
  | 'Portuguese' 
  | 'Russian' 
  | 'Indonesian' 
  | 'Korean' 
  | 'Thai';

export interface UserPreferences {
  destination: string;
  departFrom?: string; // New
  duration: string;
  layover?: string; // New
  hotel?: string;
  style?: string[];
  constraints?: string;
  language: Language;
}

export interface Activity {
  place_name: string;
  action: string;
  latitude: number;
  longitude: number;
  transport_tip?: string;
  type: 'sightseeing' | 'food' | 'transport' | 'hotel' | 'other';
  cost_estimate?: string;
  description?: string;
}

export interface HotelSuggestion {
  name: string;
  description: string;
  price_range: string;
}

export interface DayPlan {
  day_number: number;
  theme: string;
  activities: Activity[];
}

export interface TripPlan {
  trip_summary: string;
  estimated_budget: string; // New
  suggested_dates?: string;
  date_reasoning?: string;
  suggested_hotels?: HotelSuggestion[];
  warnings: string[];
  packing_list: string[];
  weather_forecast: string;
  transport_advice: string;
  flight_delay_backup?: string;
  days: DayPlan[];
}

export enum AppState {
  LANDING,
  LOADING,
  DASHBOARD,
}
