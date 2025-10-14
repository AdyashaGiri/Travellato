
import React, { useState } from 'react';
import { Itinerary, Activity } from '../types';
import { 
    MapPinIcon, FoodIcon, MuseumIcon, NatureIcon, 
    SightseeingIcon, AdventureIcon, ArtAndCultureIcon, NightlifeIcon, HistoryIcon, BookmarkIcon
} from '../components/Icons';

interface ItineraryPageProps {
    itinerary: Itinerary;
    onSave: (itinerary: Itinerary) => void;
    onDelete: (itineraryId: string) => void;
    savedItineraries: Itinerary[];
}

const categoryIcons: { [key: string]: React.FC<{ className?: string }> } = {
    "Food": FoodIcon,
    "Museum": MuseumIcon,
    "Nature": NatureIcon,
    "Sightseeing": SightseeingIcon,
    "Adventure": AdventureIcon,
    "Art & Culture": ArtAndCultureIcon,
    "Nightlife": NightlifeIcon,
    "History": HistoryIcon,
    "Default": SightseeingIcon
};

// Sub-component for rendering a single activity to reduce duplication
const ActivityCard: React.FC<{ activity: Activity; currency: string; }> = ({ activity, currency }) => {
    const IconComponent = categoryIcons[activity.category] || categoryIcons["Default"];
    return (
        <div className="mb-8 relative">
            <div className="absolute -left-[42px] top-1.5 w-5 h-5 bg-[var(--bg-primary)] rounded-full border-2 border-[var(--accent-primary)] flex items-center justify-center">
               <IconComponent className="w-3 h-3 text-[var(--accent-primary)]" />
            </div>
            <div className="p-4 bg-black/20 rounded-lg">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-sm font-bold text-[var(--accent-primary)] print-text-black">{activity.time}</p>
                        <p className="font-semibold text-gray-100 mt-1 print-text-black">{activity.description}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                        <p className="font-semibold text-gray-200 print-text-black">~{activity.estimatedCost} {currency}</p>
                        <span className="text-xs text-gray-500 capitalize print-text-black">{activity.category}</span>
                    </div>
                </div>
                 <div className="flex items-center text-sm text-gray-400 mt-3 pt-3 border-t border-white/10 print-text-black">
                    <MapPinIcon className="w-4 h-4 mr-2 flex-shrink-0"/>
                    <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.location)}`} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent-primary)] hover:underline truncate">
                        {activity.location}
                    </a>
                </div>
            </div>
        </div>
    );
};


const ItineraryPage: React.FC<ItineraryPageProps> = ({ itinerary, onSave, onDelete, savedItineraries }) => {
    const [activeDay, setActiveDay] = useState(1);
    const selectedDayData = itinerary.itinerary.find(day => day.day === activeDay);
    
    const isSaved = savedItineraries.some(saved => saved.id === itinerary.id);

    const handleSaveToggle = () => {
        if (isSaved) {
            onDelete(itinerary.id);
        } else {
            onSave(itinerary);
        }
    };

    const shareItinerary = async () => {
        let shareText = `${itinerary.tripTitle}\n\n`;
        shareText += `Total Estimated Cost: ${itinerary.totalEstimatedCost} ${itinerary.currency}\n\n`;

        itinerary.itinerary.forEach(day => {
            shareText += `**Day ${day.day}: ${day.title}**\n`;
            day.activities.forEach(activity => {
                shareText += `- ${activity.time}: ${activity.description} at ${activity.location}\n`;
            });
            shareText += `\n`;
        });
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: itinerary.tripTitle,
                    text: shareText,
                });
            } catch (error) {
                console.error('Error sharing itinerary:', error);
            }
        } else {
            navigator.clipboard.writeText(shareText).then(() => {
                alert('Itinerary copied to clipboard!');
            });
        }
    };
    
    return (
        <div id="printable-area" className="mt-8 bg-[var(--bg-card)] backdrop-blur-sm p-4 sm:p-8 rounded-2xl shadow-2xl border border-white/10 printable-content">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white print-text-black">{itinerary.tripTitle}</h2>
                    <p className="text-lg text-[var(--accent-primary)] font-semibold mt-1">
                        Total Cost: ~{new Intl.NumberFormat().format(itinerary.totalEstimatedCost)} {itinerary.currency}
                    </p>
                </div>
                <div className="flex space-x-2 no-print">
                    <button 
                        onClick={handleSaveToggle} 
                        title={isSaved ? "Unsave Itinerary" : "Save Itinerary"} 
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-gray-300 transition-colors"
                    >
                        <BookmarkIcon className="w-5 h-5" solid={isSaved} />
                    </button>
                    <button onClick={shareItinerary} title="Share" className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-gray-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12s-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.368a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" /></svg>
                    </button>
                    <button onClick={() => window.print()} title="Print" className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-gray-300 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm7-8a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2h6a2 2 0 002-2V9z" /></svg>
                    </button>
                </div>
            </div>

            {/* Screen-Only Tab Navigation */}
            <div className="border-b border-white/10 mb-6 no-print">
                <nav className="-mb-px flex space-x-6 overflow-x-auto" aria-label="Tabs">
                    {itinerary.itinerary.map((day) => (
                        <button
                            key={day.day}
                            onClick={() => setActiveDay(day.day)}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                                activeDay === day.day
                                    ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]'
                                    : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
                            }`}
                        >
                            Day {day.day}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Screen-Only Day View */}
            <div className="space-y-8 no-print">
                {selectedDayData && (
                     <div key={selectedDayData.day} className="transition-opacity duration-300 ease-in-out">
                        <h3 className="text-2xl font-bold text-gray-200 mb-6 print:text-xl print-text-black">Day {selectedDayData.day}: {selectedDayData.title}</h3>
                        <div className="relative border-l-2 border-white/10 pl-8">
                            {selectedDayData.activities.map((activity, index) => (
                                <ActivityCard key={index} activity={activity} currency={itinerary.currency} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            
            {/* Print-Only Full Itinerary View */}
            <div className="hidden print:block space-y-10">
                {itinerary.itinerary.map((dayData) => (
                     <div key={dayData.day} className="page-break-before">
                        <h3 className="text-2xl font-bold text-gray-200 mb-6 print:text-xl print-text-black">Day {dayData.day}: {dayData.title}</h3>
                        <div className="relative border-l-2 border-gray-300 pl-8">
                            {dayData.activities.map((activity, index) => (
                                <ActivityCard key={index} activity={activity} currency={itinerary.currency} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default ItineraryPage;