// Sample data for the Story Weaver prototype
// This contains mock search results and other data used in the demo

const sampleData = {
    initialPlanName: "Weekend Getaway to the Mountains",
    
    activityResults: [
        { 
            id: "hike", 
            title: "Mountain Hiking Tour", 
            description: "A guided 6-hour hike through scenic mountain trails.", 
            image: "https://via.placeholder.com/250x150", 
            extra: "Price: $75" 
        },
        { 
            id: "kayak", 
            title: "Lake Kayaking", 
            description: "Rent a kayak for the day and explore the pristine mountain lake.", 
            image: "https://via.placeholder.com/250x150", 
            extra: "Price: $40" 
        }
    ],
    
    hikingTourCard: { 
        id: "hike", 
        title: "Mountain Hiking Tour", 
        description: "A guided 6-hour hike through scenic mountain trails.", 
        image: "https://via.placeholder.com/250x150", 
        extra: "Price: $75" 
    },
    searchResults: {
        "sample-travel-results": [
            {
                id: "result-1",
                title: "Paris, France",
                description: "The City of Light offers world-class museums, iconic landmarks like the Eiffel Tower, and incredible cuisine.",
                image: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=200&fit=crop",
                extraInfo: "Flight time: 8 hours, Best time: Spring/Fall",
                type: "destination"
            },
            {
                id: "result-2",
                title: "Tokyo, Japan",
                description: "A vibrant metropolis blending traditional culture with cutting-edge technology and amazing food scene.",
                image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop",
                extraInfo: "Flight time: 14 hours, Best time: Spring/Autumn",
                type: "destination"
            },
            {
                id: "result-3",
                title: "Santorini, Greece",
                description: "Beautiful Greek island known for stunning sunsets, white-washed buildings, and crystal-clear waters.",
                image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=300&h=200&fit=crop",
                extraInfo: "Flight time: 10 hours, Best time: May-October",
                type: "destination"
            },
            {
                id: "result-4",
                title: "Weekend Packing Checklist",
                description: "Essential items to pack for a perfect weekend getaway, including clothing, toiletries, and travel documents.",
                image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=300&h=200&fit=crop",
                extraInfo: "Updated: 2024, Category: Travel Tips",
                type: "checklist"
            },
            {
                id: "result-5",
                title: "Budget Travel Tips",
                description: "Money-saving strategies for affordable travel, including booking tips, accommodation hacks, and dining suggestions.",
                image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=300&h=200&fit=crop",
                extraInfo: "Save up to 40%, Category: Budget Travel",
                type: "tips"
            }
        ]
    },
    
    sampleBranches: [
        {
            id: "branch-1",
            text: "Plan a weekend trip",
            parentId: null,
            depth: 0,
            children: []
        },
        {
            id: "branch-2",
            text: "Choose destination",
            parentId: "branch-1",
            depth: 1,
            children: []
        },
        {
            id: "branch-3",
            text: "Book accommodation",
            parentId: "branch-1",
            depth: 1,
            children: []
        }
    ],
    
    placeholderImages: {
        default: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop",
        travel: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=300&h=200&fit=crop",
        planning: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=300&h=200&fit=crop"
    },
      narrationMessages: {
        welcome: "Welcome to Story Weaver! This is an agentic planning application where you can build evolving branch plans.",
        firstBranch: "Let's start by creating your first planning branch. Click the 'Add Step to Plan' button.",
        searchDemo: "Now let's search for relevant information. We'll demonstrate the search functionality.",
        exportDemo: "Click 'Export to Plan' on one of the results to add it as a sub-branch.",
        complete: "Excellent! You've learned the basics of Story Weaver. You can continue exploring or restart the demo."
    },
    
    projectPlanTemplate: {
        text: "New Project Kick-off Plan",
        children: [
            { id: "p1", text: "Phase 1: Research & Discovery" },
            { 
                id: "p2", 
                text: "Phase 2: Design & Prototyping",
                children: [
                    { id: "p2.1", text: "Create wireframes" },
                    { id: "p2.2", text: "Build interactive prototype" }
                ]
            },
            { id: "p3", text: "Phase 3: Development" }
        ]
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = sampleData;
} else {
    window.sampleData = sampleData;
}
