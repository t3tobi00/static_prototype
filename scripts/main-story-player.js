// Placeholder for loading the specific story script & data
// And initializing the StoryEngine

document.addEventListener('DOMContentLoaded', () => {
    console.log("Main Story Player Loaded");
    
    // Link the engine to the HTML narrator buttons
    const nextButton = document.getElementById('next-step-button');
    const prevButton = document.getElementById('prev-step-button');
    const restartButton = document.getElementById('restart-story-button');

    // Initialize the engine with our sample story and data
    StoryEngine.init(sampleStory, sampleData);

    // Add event listeners
    nextButton.addEventListener('click', () => StoryEngine.nextStep());
    prevButton.addEventListener('click', () => StoryEngine.prevStep());
    restartButton.addEventListener('click', () => StoryEngine.restart());
    
    console.log("Story player initialized and ready.");
});
