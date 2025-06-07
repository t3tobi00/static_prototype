// Sample story structure for the Story Weaver prototype
// This defines the sequence of steps and actions for the demo

const sampleStory = {
    storyId: "experiential_demo",
    title: "An Experiential Story",
    dataKey: "sampleData",
    steps: [
        {
            action: "typeInElement",
            targetSelector: "#initial-plan-prompt",
            textKey: "initialPlanName",
            createsBranch: true,
            branchId: "b0"
        },
        {
            action: "simulateUserClick",
            targetSelector: "[data-branch-id='b0'] .branch-search-icon"
        },
        {
            action: "showAiThinking",
            text: "Let me help you plan a perfect weekend getaway to the mountains! I'll search for the best activities, accommodations, and local attractions to make your trip unforgettable."
        },
        {
            action: "wait",
            duration: 3000
        },
        {
            action: "hideAiThinking"
        },        {
            action: "showSidebarWithResults",
            resultsDataKey: "activityResults",
            message: "I found some great options for your mountain getaway! Here are the best activities I discovered:"
        },
        {
            action: "simulateUserClick",
            targetSelector: "#results-sidebar .result-card:first-child .export-to-plan-button"
        },
        {
            action: "embedCardInBranch",
            branchId: "b0",
            cardDataKey: "hikingTourCard"
        },        {
            action: "wait",
            duration: 1500
        },        {
            action: "showConfirmationDialog",
            message: "I can generate a detailed template with sub-branches for your mountain getaway plan. Would you like me to create that for you?",
            confirmationResponses: {
                yes: "Perfect! Let me generate a detailed template for your mountain getaway plan.",
                no: "No problem! Your current plan looks great as is."
            }
        },
        {
            action: "showTemplateGenerationEffect",
            targetBranchId: "b0",
            message: "I'm analyzing your plan structure and generating comprehensive sub-branches with activities, logistics, and timing details..."
        },
        {
            action: "agentGenerateTemplate",
            targetBranchId: "b0",
            templateDataKey: "projectPlanTemplate"
        }
    ]
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = sampleStory;
} else {
    window.sampleStory = sampleStory;
}
