import { GoogleGenAI, Type } from "@google/genai";
import { TripPlan, UserPreferences } from "../types";

// Define the response schema for Gemini
const tripSchema = {
  type: Type.OBJECT,
  properties: {
    trip_summary: { type: Type.STRING, description: "A catchy summary of the trip" },
    estimated_budget: { type: Type.STRING, description: "Total estimated cost for the trip excluding flights (e.g., $500 - $700 USD per person)" },
    suggested_dates: { type: Type.STRING, description: "Specific dates (e.g. 'April 5 - April 10') if user only gave duration, or user's dates." },
    date_reasoning: { type: Type.STRING, description: "Why these dates? (e.g. 'Cherry blossom season', 'Low crowds')" },
    suggested_hotels: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          price_range: { type: Type.STRING, description: "e.g. $100-150/night" }
        }
      },
      description: "Suggest 2-3 hotels if user didn't specify one."
    },
    warnings: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Safety or tourist trap warnings" },
    packing_list: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Essential items to pack" },
    weather_forecast: { type: Type.STRING, description: "Expected weather and clothing advice" },
    transport_advice: { type: Type.STRING, description: "Best way to get around (cards, apps, etc)" },
    flight_delay_backup: { type: Type.STRING, description: "A contingency plan if flights are delayed" },
    days: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          day_number: { type: Type.INTEGER },
          theme: { type: Type.STRING },
          activities: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                place_name: { type: Type.STRING },
                action: { type: Type.STRING, description: "What to do here" },
                description: { type: Type.STRING, description: "2 sentences describing why this place is interesting for the details view." },
                latitude: { type: Type.NUMBER },
                longitude: { type: Type.NUMBER },
                transport_tip: { type: Type.STRING },
                type: { type: Type.STRING, enum: ["sightseeing", "food", "transport", "hotel", "other"] },
                cost_estimate: { type: Type.STRING }
              },
              required: ["place_name", "action", "latitude", "longitude", "type"]
            }
          }
        },
        required: ["day_number", "theme", "activities"]
      }
    }
  },
  required: ["trip_summary", "estimated_budget", "days", "warnings", "packing_list", "transport_advice"]
};

export const generateTripPlan = async (prefs: UserPreferences): Promise<TripPlan> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please check your environment variables.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Act as an expert local travel planner. 
    
    User Request:
    - Destination: ${prefs.destination}
    - Depart From: ${prefs.departFrom || "Not specified"}
    - Duration/Dates: ${prefs.duration}
    - Layover/Stopover: ${prefs.layover || "None"}
    - Hotel: ${prefs.hotel || "Not specified"}
    - Travel Style: ${prefs.style?.join(", ") || "Balanced"}
    - Constraints: ${prefs.constraints || "None"}
    - Language: ${prefs.language}

    Generate a detailed day-by-day itinerary.
    
    CRITICAL INSTRUCTIONS:
    1. **LANGUAGE**: ALL output fields (summary, activity names, descriptions, warnings, tips) MUST be written in ${prefs.language}. Do not output English unless the language is English.
    2. If "Layover" is specified, incorporate it into the travel plan appropriately.
    3. If the user provided a duration but NOT specific dates, suggest the BEST time of year to visit in "suggested_dates" and explain why in "date_reasoning".
    4. If the user did NOT specify a hotel, provide 3 good recommendations in "suggested_hotels".
    5. Provide a "estimated_budget" for the trip (excluding flights) in the local currency or USD.
    6. You must provide valid Latitude and Longitude for every activity.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: tripSchema,
        temperature: 0.4,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as TripPlan;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const modifyTripPlan = async (currentPlan: TripPlan, userInstruction: string): Promise<TripPlan> => {
    if (!process.env.API_KEY) {
        throw new Error("API Key is missing.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
    You are an expert travel planner.
    Current Plan (JSON): ${JSON.stringify(currentPlan)}
    
    User Instruction for Modification: "${userInstruction}"

    Update the plan according to the user's request. 
    Maintain the JSON structure exactly. 
    IMPORTANT: Ensure the output language matches the original plan's language.
    If the user asks to change a specific day, only modify that day and keep others largely the same unless flow requires changes.
    Ensure coordinates are accurate for any new places.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: tripSchema,
                temperature: 0.5,
            },
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        return JSON.parse(text) as TripPlan;

    } catch (error) {
        console.error("Gemini Modification Error:", error);
        throw error;
    }
};

export const generateStandardTour = async (prefs: UserPreferences): Promise<TripPlan> => {
    if (!process.env.API_KEY) {
        throw new Error("API Key is missing.");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
    Act as a traditional travel agency. 
    Create a "Standard Group Tour" itinerary for ${prefs.destination} for ${prefs.duration}.
    This should be the typical "Tourist Trap" itinerary.
    Language: ${prefs.language} (ALL text must be in this language).
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: tripSchema,
                temperature: 0.3,
            },
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        return JSON.parse(text) as TripPlan;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};