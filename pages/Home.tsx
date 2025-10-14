
import React, { useState, useEffect } from 'react';
import { TravelerPreferences } from '../types';
import { generateItinerary } from '../services/geminiService';
import { CalendarIcon, PlaneIcon, SparklesIcon, WalletIcon, MapPinIcon } from '../components/Icons';

const interestOptions = ["Nature", "History", "Food", "Adventure", "Art & Culture", "Nightlife"];

const LoadingIndicator: React.FC<{ preferences: TravelerPreferences }> = ({ preferences }) => {
    const [messages, setMessages] = useState<string[]>([]);
    const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

    useEffect(() => {
        const progressMessages = [
            `Analyzing your destination(s): ${preferences.destination}...`,
            `Finding budget-friendly activities for your interests: ${preferences.interests.join(', ')}...`,
            "Scouting for the best local food spots...",
            "Searching for student discounts and deals...",
            "Mapping out your daily routes for efficiency...",
            "Assembling your personalized travel plan..."
        ];

        const tips = [
            "Tip: Pack a reusable water bottle to reduce plastic waste.",
            "Student Tip: Always carry your student ID. Many museums offer discounts!",
            "Tip: Use public transportation to lower your carbon footprint.",
            "Student Tip: Look for an International Student Identity Card (ISIC) for global deals.",
            "Tip: Support local businesses and artisans when you shop.",
            "Student Tip: Many restaurants near universities have student-friendly prices.",
            "Tip: Respect local wildlife and habitats by keeping your distance.",
            "Student Tip: Check for student fares on trains and buses."
        ];
        
        const shuffle = (array: string[]) => [...array].sort(() => Math.random() - 0.5);
        
        setMessages([...progressMessages, ...shuffle(tips)]);
        setCurrentMessageIndex(0);
    }, [preferences.destination, preferences.interests]);


    useEffect(() => {
        if (messages.length === 0) return;
        const interval = setInterval(() => {
            setCurrentMessageIndex(prevIndex => (prevIndex + 1) % messages.length);
        }, 2500);
        return () => clearInterval(interval);
    }, [messages]);

    return (
        <div className="mt-8 text-center p-8 bg-[var(--bg-card)] backdrop-blur-sm rounded-2xl shadow-2xl border border-white/10">
            <div className="flex justify-center items-center mb-4">
                <PlaneIcon className="w-12 h-12 text-[var(--accent-primary)] animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-white">Hang tight! Your adventure is being crafted...</h3>
            <div className="mt-4 h-6 text-gray-300 transition-opacity duration-500">
                <p key={currentMessageIndex}>{messages.length > 0 ? messages[currentMessageIndex] : "Initializing..."}</p>
            </div>
        </div>
    );
};


interface HomeProps {
    onGenerate: (preferences: TravelerPreferences) => void;
    isLoading: boolean;
    error: string | null;
}

const Home: React.FC<HomeProps> = ({ onGenerate, isLoading, error }) => {
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  
  const getInitialDates = () => {
      const today = new Date();
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(today.getDate() + 7);
      return {
          startDate: formatDate(today),
          endDate: formatDate(sevenDaysFromNow)
      };
  };

  const [preferences, setPreferences] = useState<TravelerPreferences>({
    destination: '',
    ...getInitialDates(),
    budget: 500,
    interests: [],
  });
  const [validationError, setValidationError] = useState<string | null>(null);


  const handleInterestChange = (interest: string) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest],
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!preferences.destination) {
        setValidationError("Please enter a destination.");
        return;
    }
    if (new Date(preferences.endDate) < new Date(preferences.startDate)) {
        setValidationError("End date cannot be before the start date.");
        return;
    }
    
    onGenerate(preferences);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-[var(--bg-card)] backdrop-blur-sm p-6 sm:p-8 rounded-2xl shadow-2xl border border-white/10 no-print">
        <h2 className="text-2xl font-bold mb-1 text-white">Plan Your Next Adventure</h2>
        <p className="text-gray-400 mb-6">Your AI travel companion for unforgettable, budget-friendly trips.</p>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <label htmlFor="destination" className="block text-sm font-medium text-gray-300 mb-1">Destination(s)</label>
              <div className="relative">
                 <MapPinIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                 <input type="text" id="destination" value={preferences.destination} onChange={e => setPreferences({...preferences, destination: e.target.value})} className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition" placeholder="e.g., Kyoto, Japan or Rome, Florence, Venice" />
              </div>
            </div>
            
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
              <div className="relative">
                <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                <input type="date" id="startDate" min={formatDate(new Date())} value={preferences.startDate} onChange={e => setPreferences({...preferences, startDate: e.target.value})} className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition" />
              </div>
            </div>
            
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
              <div className="relative">
                <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                <input type="date" id="endDate" min={preferences.startDate} value={preferences.endDate} onChange={e => setPreferences({...preferences, endDate: e.target.value})} className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition" />
              </div>
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-300 mb-1">Budget (USD)</label>
               <div className="relative">
                <WalletIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"/>
                <input type="number" id="budget" min="50" step="50" value={preferences.budget} onChange={e => setPreferences({...preferences, budget: parseInt(e.target.value)})} className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-[var(--accent-primary)] focus:border-[var(--accent-primary)] transition" />
              </div>
            </div>
          </div>
          
          <div>
             <label className="block text-sm font-medium text-gray-300 mb-2">Interests</label>
             <div className="flex flex-wrap gap-2">
                {interestOptions.map(interest => (
                    <button type="button" key={interest} onClick={() => handleInterestChange(interest)} className={`px-4 py-2 text-sm font-medium rounded-full border transition-all duration-200 ${preferences.interests.includes(interest) ? 'bg-gradient-to-r from-[var(--accent-gradient-from)] to-[var(--accent-gradient-to)] text-white border-transparent shadow-lg' : 'bg-white/5 text-gray-200 border-white/10 hover:bg-white/10 hover:border-white/20'}`}>
                        {interest}
                    </button>
                ))}
             </div>
          </div>

          {(validationError || error) && <div className="bg-red-900/50 border-l-4 border-red-500 text-red-200 p-3 rounded-md text-sm" role="alert"><p>{validationError || error}</p></div>}


          <div>
            <button type="submit" disabled={isLoading} className="w-full flex items-center justify-center bg-gradient-to-r from-[var(--accent-gradient-from)] to-[var(--accent-gradient-to)] text-white font-semibold py-3 px-4 rounded-lg hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--bg-primary)] focus:ring-[var(--accent-primary)] transition-all duration-300 transform hover:scale-105 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed disabled:scale-100 disabled:brightness-100">
                <SparklesIcon className="w-5 h-5 mr-2" />
                {isLoading ? 'Crafting Your Journey...' : 'Generate Itinerary'}
            </button>
          </div>
        </form>
      </div>

      {isLoading && <LoadingIndicator preferences={preferences} />}
    </div>
  );
};

export default Home;