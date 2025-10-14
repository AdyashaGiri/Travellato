
export interface TravelerPreferences {
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  interests: string[];
}

export interface Cost {
  item: string;
  amount: number;
  currency: string;
}

export interface Activity {
  time: string;
  description: string;
  location: string;
  estimatedCost: number;
  category: string;
}

export interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
  dailyCost: number;
}

export interface Itinerary {
  id: string;
  tripTitle: string;
  totalEstimatedCost: number;
  currency: string;
  itinerary: DayPlan[];
}

export interface ConversionResult {
    convertedAmount: number;
    exchangeRate: number;
    targetCurrency: string;
}