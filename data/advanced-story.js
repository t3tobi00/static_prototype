// Advanced Story Example - Demonstrates Dynamic Engine Capabilities
// This story showcases content interpolation, conditional execution, and flexible responses

const advancedStory = {
    storyId: "dynamic_travel_planner", 
    title: "Dynamic Travel Planning Experience",
    dataKey: "advancedTravelData",
    steps: [
        {
            action: "addChatMessage",
            message: "Welcome {{userName}}! I'm excited to help you plan your perfect {{tripType}} adventure. Let's get started!",
            isUser: false
        },
        {
            action: "typeInElement",
            targetSelector: "#initial-plan-prompt", 
            textKey: "userDestination",
            createsBranch: true,
            branchId: "main_destination"
        },
        {
            action: "simulateUserClick",
            targetSelector: "[data-branch-id='main_destination'] .branch-search-icon"
        },
        {
            action: "showAiThinking",
            text: "Perfect choice! I'm analyzing {{userDestination}} and finding the best {{tripType}} experiences. Let me search my database of {{totalLocations}} destinations..."
        },
        {
            action: "wait",
            duration: 2500
        },
        {
            action: "showSidebarWithResults",
            resultsDataKey: "destinationResults",
            message: "Fantastic! I found {{resultCount}} amazing options for your {{userDestination}} {{tripType}}. Here are my top recommendations:"
        },
        {
            action: "showConfirmationDialog",
            message: "These look perfect for your {{tripType}}! Would you like me to create a detailed itinerary with day-by-day activities?",
            confirmationResponses: {
                yes: "Excellent! I'll create a comprehensive {{dayCount}}-day itinerary for your {{userDestination}} adventure.",
                no: "No worries! Feel free to explore these options and let me know if you need any specific recommendations."
            }
        },
        {
            action: "showTemplateGenerationEffect", 
            targetBranchId: "main_destination",
            message: "Creating your personalized {{dayCount}}-day {{userDestination}} itinerary with activities, dining, and logistics...",
            condition: {
                type: "confirmation",
                value: true
            }
        },
        {
            action: "agentGenerateTemplate",
            targetBranchId: "main_destination", 
            templateDataKey: "dynamicItineraryTemplate",
            condition: {
                type: "confirmation", 
                value: true
            }
        },
        {
            action: "addChatMessage",
            message: "Your {{userDestination}} {{tripType}} plan is ready! I've included {{activityCount}} activities, {{restaurantCount}} dining recommendations, and all the logistics you'll need. Have an amazing trip!",
            isUser: false,
            condition: {
                type: "confirmation",
                value: true
            }
        }
    ]
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = advancedStory;
} else {
    window.advancedStory = advancedStory;
}
