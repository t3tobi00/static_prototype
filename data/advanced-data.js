// Advanced Travel Data - Demonstrates Dynamic Content System
// This data file showcases variable interpolation and dynamic content

const advancedTravelData = {
    // User personalization data
    userName: "Alex",
    tripType: "adventure",
    userDestination: "Swiss Alps Adventure",
    dayCount: "7",
    totalLocations: "500+",
    resultCount: "12",
    activityCount: "25",
    restaurantCount: "15",

    // Dynamic results that reference interpolated variables
    destinationResults: [
        {
            title: "Alpine Hiking Expedition", 
            description: "Multi-day trekking through pristine mountain trails with professional guides",
            image: "https://via.placeholder.com/300x200/4CAF50/ffffff?text=Alpine+Hiking",
            extraInfo: "Duration: 3 days | Difficulty: Intermediate"
        },
        {
            title: "Scenic Railway Journey",
            description: "Experience breathtaking mountain views on Europe's most spectacular train routes", 
            image: "https://via.placeholder.com/300x200/2196F3/ffffff?text=Mountain+Railway",
            extraInfo: "Duration: Full day | Includes meal"
        },
        {
            title: "Traditional Alpine Village Tour",
            description: "Discover authentic Swiss culture, local crafts, and mountain cuisine",
            image: "https://via.placeholder.com/300x200/FF9800/ffffff?text=Village+Tour", 
            extraInfo: "Duration: Half day | Small groups"
        },
        {
            title: "Adventure Sports Package",
            description: "Paragliding, rock climbing, and mountain biking in stunning alpine settings",
            image: "https://via.placeholder.com/300x200/F44336/ffffff?text=Adventure+Sports",
            extraInfo: "Duration: 2 days | All skill levels"
        }
    ],

    // Card data for drag operations
    hikingExpeditionCard: {
        title: "Alpine Hiking Expedition",
        description: "Multi-day trekking adventure with mountain guides", 
        image: "https://via.placeholder.com/300x200/4CAF50/ffffff?text=Hiking",
        extra: "Professional guides included"
    },

    // Dynamic itinerary template that can be customized
    dynamicItineraryTemplate: {
        children: [
            {
                id: "day1_arrival",
                text: "Day 1: Arrival & Alpine Welcome",
                children: [
                    {
                        id: "arrival_logistics", 
                        text: "Airport transfer and hotel check-in"
                    },
                    {
                        id: "welcome_dinner",
                        text: "Traditional Swiss welcome dinner"
                    },
                    {
                        id: "gear_preparation",
                        text: "Equipment check and adventure briefing"
                    }
                ]
            },
            {
                id: "day2_exploration",
                text: "Day 2-3: Mountain Exploration", 
                children: [
                    {
                        id: "guided_hike",
                        text: "Guided alpine hiking expedition"
                    },
                    {
                        id: "scenic_viewpoints", 
                        text: "Visit spectacular mountain viewpoints"
                    },
                    {
                        id: "local_cuisine",
                        text: "Mountain hut dining experience"
                    }
                ]
            },
            {
                id: "day4_adventure",
                text: "Day 4-5: Adventure Activities",
                children: [
                    {
                        id: "paragliding",
                        text: "Tandem paragliding over alpine valleys"
                    },
                    {
                        id: "railway_journey", 
                        text: "Scenic mountain railway excursion"
                    },
                    {
                        id: "village_tour",
                        text: "Traditional alpine village exploration"
                    }
                ]
            },
            {
                id: "day6_relaxation",
                text: "Day 6: Relaxation & Culture",
                children: [
                    {
                        id: "spa_wellness",
                        text: "Alpine spa and wellness experience"
                    },
                    {
                        id: "cultural_sites",
                        text: "Visit local museums and cultural sites"
                    },
                    {
                        id: "farewell_dinner",
                        text: "Farewell dinner with mountain views"
                    }
                ]
            },
            {
                id: "day7_departure", 
                text: "Day 7: Departure",
                children: [
                    {
                        id: "final_breakfast",
                        text: "Final mountain breakfast"
                    },
                    {
                        id: "departure_transfer",
                        text: "Transfer to airport or train station"
                    }
                ]
            }
        ]
    }
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = advancedTravelData;
} else {
    window.advancedTravelData = advancedTravelData;
}
