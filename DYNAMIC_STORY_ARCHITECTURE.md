# Dynamic Story Architecture Guide 🎭

## 🎯 **Philosophy: Clean Separation of Concerns**

The **Story Engine** is now a pure execution engine that implements mechanics, while **Story Data** contains all content, messages, and narrative elements.

## 📋 **Story Data Structure**

### **Basic Story Object:**
```javascript
const story = {
    storyId: "unique_story_identifier",
    title: "Story Title",
    dataKey: "associatedDataObject", // Links to data file
    steps: [
        // Array of step objects
    ]
}
```

## 🎬 **Available Story Actions**

### **1. Narrative Actions**
```javascript
// Display AI thinking/processing message
{
    action: "showAiThinking",
    text: "Your custom AI message here..."
}

// Show chat message to user  
{
    action: "addChatMessage",
    message: "Message content",
    isUser: false // true for user messages, false for AI
}
```

### **2. UI Interaction Actions**
```javascript
// Type text into an element
{
    action: "typeInElement",
    targetSelector: "#element-id",
    textKey: "dataPropertyName", // References currentData[textKey]
    createsBranch: true, // Optional: creates new branch
    branchId: "unique_branch_id"
}

// Simulate user click
{
    action: "simulateUserClick", 
    targetSelector: ".button-class"
}
```

### **3. Results & Data Display**
```javascript
// Show search results in chat
{
    action: "showSidebarWithResults",
    resultsDataKey: "resultsArrayName", // References currentData[resultsDataKey]
    message: "Your contextual message introducing the results"
}

// Embed a card into a branch
{
    action: "embedCardInBranch",
    branchId: "target_branch_id",
    cardDataKey: "cardDataPropertyName"
}
```

### **4. User Interaction Actions**
```javascript
// Show confirmation dialog with custom responses
{
    action: "showConfirmationDialog",
    message: "Your question to the user?",
    confirmationResponses: {
        yes: "Response when user clicks Yes",
        no: "Response when user clicks No"
    }
}
```

### **5. Advanced Generation Actions**
```javascript
// Show template generation message
{
    action: "showTemplateGenerationEffect",
    targetBranchId: "branch_to_modify",
    message: "Custom message about what's being generated..."
}

// Generate template structure
{
    action: "agentGenerateTemplate",
    targetBranchId: "parent_branch_id",
    templateDataKey: "templateStructureProperty"
}
```

### **6. Utility Actions**
```javascript
// Wait/pause
{
    action: "wait",
    duration: 2000 // milliseconds
}

// Hide AI thinking (for cleanup)
{
    action: "hideAiThinking"
}
```

## 🎨 **Story Content Guidelines**

### **✅ Good Practice - Content in Story Data:**
```javascript
{
    action: "showAiThinking",
    text: "I'm analyzing your travel preferences and finding personalized recommendations..."
}

{
    action: "showSidebarWithResults", 
    resultsDataKey: "hotelResults",
    message: "Here are the perfect hotels I found for your dates and budget!"
}
```

### **❌ Bad Practice - Hardcoded Content in Engine:**
```javascript
// DON'T DO THIS IN STORY ENGINE
await InteractionManager.addChatMessage("I found some great options for your mountain getaway!");
```

## 📊 **Data Structure Requirements**

Your data file should provide all content referenced by story steps:

```javascript
const storyData = {
    // Text content for typing actions
    initialPlanName: "Weekend Mountain Getaway",
    
    // Results arrays for display actions
    activityResults: [
        {
            title: "Mountain Hiking Trail",
            description: "Scenic 3-mile trail with waterfall views",
            image: "hiking.jpg",
            extraInfo: "Difficulty: Moderate"
        }
    ],
    
    // Card data for embedding
    hikingTourCard: {
        title: "Guided Nature Tour", 
        description: "Professional guide included",
        image: "tour.jpg",
        extra: "Duration: 4 hours"
    },
    
    // Template structures for generation
    projectPlanTemplate: {
        children: [
            {
                id: "logistics",
                text: "Travel Logistics",
                children: [...]
            }
        ]
    }
};
```

## 🔧 **Engine Benefits**

### **Pure Execution Engine:**
- ✅ No hardcoded story content
- ✅ Reusable across any story type
- ✅ Easy to maintain and debug
- ✅ Clear separation of concerns

### **Dynamic Story System:**
- ✅ All content in story data files
- ✅ Easy to create new stories
- ✅ Translatable and localizable  
- ✅ A/B testable content

### **Flexible Architecture:**
- ✅ Add new action types without touching existing stories
- ✅ Modify story content without changing engine code
- ✅ Support multiple story formats
- ✅ Enable story versioning and branching

## 🚀 **Creating New Stories**

1. **Define your story steps** with actions and content
2. **Create associated data file** with all referenced content
3. **Test with the engine** - no engine modifications needed
4. **Iterate on content** without touching engine code

The story engine is now a **pure, reusable execution framework** that can power any type of interactive story! 🎉
