import React, { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Converter from './pages/Converter';
import ItineraryPage from './pages/Itinerary';
import SavedTrips from './pages/SavedTrips';
import { Itinerary, TravelerPreferences } from './types';
import { generateItinerary } from './services/geminiService';

const SAVED_ITINERARIES_KEY = 'travelato-saved-itineraries';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState(window.location.hash || '#');
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedItineraries, setSavedItineraries] = useState<Itinerary[]>([]);

  // Load saved itineraries from local storage on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(SAVED_ITINERARIES_KEY);
      if (stored) {
        setSavedItineraries(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load saved itineraries:", e);
      setSavedItineraries([]);
    }
  }, []);

  // Update local storage whenever saved itineraries change
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_ITINERARIES_KEY, JSON.stringify(savedItineraries));
    } catch (e) {
      console.error("Failed to save itineraries:", e);
    }
  }, [savedItineraries]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash || '#';
      // If navigating away from itinerary, clear it unless we are viewing a saved one
      if (hash !== '#/itinerary' && hash !== '#/saved') {
          setItinerary(null);
      }
      setCurrentPath(hash);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleGenerateItinerary = useCallback(async (preferences: TravelerPreferences) => {
    setIsLoading(true);
    setError(null);
    setItinerary(null);
    try {
      const result = await generateItinerary(preferences);
      setItinerary(result);
      window.location.hash = '#/itinerary';
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
      window.location.hash = '#';
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSaveItinerary = useCallback((itineraryToSave: Itinerary) => {
    setSavedItineraries(prev => {
        if (prev.some(i => i.id === itineraryToSave.id)) {
            return prev; // Already saved
        }
        return [...prev, itineraryToSave];
    });
  }, []);

  const handleDeleteItinerary = useCallback((itineraryId: string) => {
      setSavedItineraries(prev => prev.filter(i => i.id !== itineraryId));
  }, []);

  const handleLoadItinerary = useCallback((itineraryToLoad: Itinerary) => {
    setItinerary(itineraryToLoad);
    window.location.hash = '#/itinerary';
  }, []);

  const renderPage = () => {
    switch (currentPath) {
      case '#':
        return <Home onGenerate={handleGenerateItinerary} isLoading={isLoading} error={error} />;
      case '#/converter':
        return <Converter />;
      case '#/saved':
        return <SavedTrips savedItineraries={savedItineraries} onLoad={handleLoadItinerary} onDelete={handleDeleteItinerary} />;
      case '#/itinerary':
        return itinerary ? <ItineraryPage itinerary={itinerary} onSave={handleSaveItinerary} onDelete={handleDeleteItinerary} savedItineraries={savedItineraries} /> : <Home onGenerate={handleGenerateItinerary} isLoading={isLoading} error={error} />;
      default:
        return <Home onGenerate={handleGenerateItinerary} isLoading={isLoading} error={error} />;
    }
  };

  return (
    <Layout currentPath={currentPath}>
      {renderPage()}
    </Layout>
  );
};

export default App;