import React from 'react';
import { Itinerary } from '../types';
import { TrashIcon, PlaneIcon, SparklesIcon } from '../components/Icons';

interface SavedTripsProps {
    savedItineraries: Itinerary[];
    onLoad: (itinerary: Itinerary) => void;
    onDelete: (itineraryId: string) => void;
}

const SavedTrips: React.FC<SavedTripsProps> = ({ savedItineraries, onLoad, onDelete }) => {
    
    const handlePlanNewTripClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        window.location.hash = '#';
    };

    if (savedItineraries.length === 0) {
        return (
            <div className="max-w-2xl mx-auto text-center py-12">
                <div className="bg-[var(--bg-card)] backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-white/10">
                    <div className="flex justify-center items-center mb-4">
                        <PlaneIcon className="w-12 h-12 text-[var(--accent-primary)]" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">No Saved Trips Yet</h2>
                    <p className="text-gray-400 mt-2 mb-6">Your planned adventures will appear here once you save them.</p>
                    <a 
                        href="#" 
                        onClick={handlePlanNewTripClick}
                        className="inline-flex items-center justify-center bg-gradient-to-r from-[var(--accent-gradient-from)] to-[var(--accent-gradient-to)] text-white font-semibold py-2 px-5 rounded-lg hover:brightness-110 transition-all transform hover:scale-105"
                    >
                        <SparklesIcon className="w-5 h-5 mr-2" />
                        Plan a New Trip
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Your Saved Trips</h2>
            <div className="space-y-4">
                {savedItineraries.map((itinerary) => (
                    <div key={itinerary.id} className="bg-[var(--bg-card)] backdrop-blur-sm p-4 rounded-xl shadow-lg border border-white/10 flex justify-between items-center transition-all hover:border-[var(--accent-primary)]/50 hover:bg-white/5">
                        <button onClick={() => onLoad(itinerary)} className="text-left flex-grow">
                            <h3 className="font-semibold text-lg text-white">{itinerary.tripTitle}</h3>
                            <p className="text-sm text-gray-400">
                                {itinerary.itinerary.length} days · Approx. {itinerary.totalEstimatedCost} {itinerary.currency}
                            </p>
                        </button>
                        <button 
                            onClick={(e) => {
                                e.stopPropagation(); // Prevent triggering the onLoad
                                if (window.confirm(`Are you sure you want to delete "${itinerary.tripTitle}"?`)) {
                                    onDelete(itinerary.id);
                                }
                            }}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-500/10 transition-colors flex-shrink-0 ml-4"
                            aria-label={`Delete ${itinerary.tripTitle}`}
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SavedTrips;