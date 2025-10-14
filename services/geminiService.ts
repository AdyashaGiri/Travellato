
import { GoogleGenAI, Type } from "@google/genai";
import { Itinerary, TravelerPreferences, ConversionResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

// Helper to safely parse JSON that might be wrapped in markdown
const parseJsonFromMarkdown = <T>(text: string): T => {
    const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    const jsonText = match ? match[1] : text;
    return JSON.parse(jsonText.trim()) as T;
};


const itinerarySchema = {
    type: Type.OBJECT,
    properties: {
        tripTitle: { type: Type.STRING, description: "A creative and catchy title for the trip. e.g., 'Kyoto on a Shoestring' or 'An Italian Trio: Rome, Florence, Venice'." },
        totalEstimatedCost: { type: Type.NUMBER, description: "The total estimated cost for the entire trip for one person." },
        currency: { type: Type.STRING, description: "The currency for all costs, e.g., USD, EUR, JPY." },
        itinerary: {
            type: Type.ARRAY,
            description: "An array of daily plans.",
            items: {
                type: Type.OBJECT,
                properties: {
                    day: { type: Type.INTEGER, description: "The day number, starting from 1." },
                    title: { type: Type.STRING, description: "A summary or theme for the day. e.g., 'Historical Heart of the City'." },
                    activities: {
                        type: Type.ARRAY,
                        description: "An array of activities for the day, in chronological order.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                time: { type: Type.STRING, description: "Suggested time for the activity, e.g., '9:00 AM' or 'Afternoon'." },
                                description: { type: Type.STRING, description: "Detailed description of the activity, including what to do and see." },
                                location: { type: Type.STRING, description: "Name of the location or address for the activity." },
                                estimatedCost: { type: Type.NUMBER, description: "Estimated cost for this single activity per person." },
                                category: { type: Type.STRING, description: "Category of the activity (e.g., Food, Museum, Nature, Sightseeing, Adventure, Nightlife, Art & Culture, History, Travel)." }
                            },
                            required: ["time", "description", "location", "estimatedCost", "category"]
                        }
                    },
                    dailyCost: { type: Type.NUMBER, description: "The total estimated cost for this day." }
                },
                required: ["day", "title", "activities", "dailyCost"]
            }
        }
    },
    required: ["tripTitle", "totalEstimatedCost", "currency", "itinerary"]
};


export const generateItinerary = async (preferences: TravelerPreferences): Promise<Itinerary> => {
    const interestsLine = preferences.interests.length > 0
        ? `- **Interests:** ${preferences.interests.join(", ")}`
        : `- **Interests:** The user has not specified any interests. Please create a diverse and well-rounded itinerary featuring a mix of major landmarks, cultural sites, local culinary experiences, and perhaps some hidden gems.`;
    
    const getDurationInDays = (start: string, end: string): number => {
        const startDate = new Date(start);
        const endDate = new Date(end);
        if (endDate < startDate) return 0;
        const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
        return diffDays;
    }
    const duration = getDurationInDays(preferences.startDate, preferences.endDate);

  const prompt = `
    You are an expert travel planner specializing in creating itineraries for students with limited budgets. 
    Your goal is to create a detailed, engaging, and practical travel plan.

    **User Preferences:**
    - **Destination(s):** ${preferences.destination}
    - **Travel Period:** From ${preferences.startDate} to ${preferences.endDate} (${duration} days)
    - **Total Budget (for one person, excluding flights):** Approximately ${preferences.budget} USD
    ${interestsLine}

    **Your Task:**
    Generate a complete, day-by-day travel itinerary based on the user's preferences for the specified number of days.

    **Key Considerations (CRITICAL):**
    1.  **Multi-Destination Handling:** The 'Destination(s)' field may contain multiple locations separated by commas. If so, create a logical and efficient itinerary that covers these locations within the given travel period. Allocate days appropriately between locations and include suggestions for travel between them (e.g., train, bus) as a travel activity.
    2.  **Budget Focus:** Prioritize free activities, cheap eats (local street food, markets), and budget-friendly attractions. The total budget applies to the entire trip across all destinations.
    3.  **Student Discounts:** Where relevant, mention in activity descriptions that student discounts may be available (e.g., "Show your student ID for a discount"). Do not create a separate section for this.
    4.  **Efficiency:** Group activities by location to minimize travel time and cost. Suggest using public transport. For multi-destination trips, this is especially important.
    5.  **Local Experience:** Include authentic, non-touristy experiences.
    6.  **Structure:** Follow the provided JSON schema precisely. Ensure all costs are in a single, appropriate currency for the primary destination. The tripTitle should reflect the multi-destination nature of the trip, if applicable.
    7.  **Category:** Make sure to assign a relevant category for each activity from the list: Food, Museum, Nature, Sightseeing, Adventure, Nightlife, Art & Culture, History, Travel.

    Please generate the itinerary now.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: itinerarySchema,
        temperature: 0.7,
      },
    });

    const data = parseJsonFromMarkdown<Omit<Itinerary, 'id'>>(response.text);
    return {
        ...data,
        id: self.crypto.randomUUID(),
    };
  } catch (error) {
    console.error("Error generating itinerary:", error);
    throw new Error("Failed to generate itinerary. The AI model might be busy or the request is invalid. Please try again.");
  }
};

const currencyConversionSchema = {
    type: Type.OBJECT,
    properties: {
        convertedAmount: { type: Type.NUMBER, description: "The final converted amount." },
        exchangeRate: { type: Type.NUMBER, description: "The exchange rate used for the conversion from the source currency to the target currency." },
        targetCurrency: { type: Type.STRING, description: "The currency code of the target currency, e.g., 'EUR'." }
    },
    required: ["convertedAmount", "exchangeRate", "targetCurrency"]
};

export const convertCurrency = async (amount: number, fromCurrency: string, toCurrency: string): Promise<ConversionResult> => {
    const prompt = `
        You are a real-time currency conversion assistant. Your data must be accurate and up-to-date.
        Please convert exactly ${amount} ${fromCurrency} to ${toCurrency}.
        Provide the result in the specified JSON format, including the converted amount and the exchange rate you used.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: currencyConversionSchema,
                temperature: 0,
            },
        });

        const data = parseJsonFromMarkdown<ConversionResult>(response.text);
        return data;
    } catch (error) {
        console.error("Error converting currency:", error);
        throw new Error("Failed to convert currency. The AI model might be busy or the request is invalid. Please try again.");
    }
};