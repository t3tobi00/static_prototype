**Primary Directive:** Overhaul the prototype's UI/UX and implement a new set of reusable interaction primitives to simulate a dynamic conversation between a "User" and an "AI Agent." The focus is on visual storytelling, focus management, and reducing reliance on the bottom narrator bar.

---

### **Phase 1: A Complete UI/UX & Aesthetic Overhaul**

**Goal:** Create a more premium, modern, and focused visual environment. A better stage makes the play more believable.

**Instructions:**

**1. Update `styles/main.css` with a new Color Palette and Typography:**

```css
/* In styles/main.css, replace the :root variables and update body styles */

:root {
    --bg-primary: #1a1d21; /* A very dark, near-black charcoal */
    --bg-secondary: #25282d; /* A slightly lighter charcoal for panes */
    --surface-color: #31353c; /* For cards and interactive surfaces */
    --border-color: #4a4e57; /* A visible but not harsh border */
    
    --primary-accent: #00A9FF; /* A vibrant, modern blue */
    --primary-accent-hover: #0087cc;

    --text-primary: #EAECEF; /* Off-white for high contrast */
    --text-secondary: #A0A5B1; /* Lighter grey for descriptions, etc. */
    --text-muted: #6f7581; /* For subtle hints and placeholder text */

    --font-main: 'Inter', sans-serif;
    --shadow-soft: 0 4px 12px rgba(0, 0, 0, 0.2);
    --shadow-focus: 0 0 0 3px rgba(0, 169, 255, 0.3); /* For focus rings */
}

body {
    font-family: var(--font-main);
    background-color: var(--bg-primary);
    color: var(--text-primary);
    line-height: 1.6;
}

/* Update all existing CSS rules to use these new variables. 
   For example, #main-app-ui background should be var(--bg-secondary), 
   .result-card background should be var(--surface-color), etc. 
   All text colors should be updated to var(--text-primary) or var(--text-secondary).
*/
```

**2. Implement a "Focus Mode" System in CSS:** This will be used to draw the viewer's attention to specific parts of the UI.

```css
/* In styles/main.css, add these new styles */

/* This backdrop will dim the rest of the app */
#focus-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.6);
    z-index: 100; /* Below focused elements but above the app */
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease, visibility 0.3s ease;
}

#focus-backdrop.is-active {
    opacity: 1;
    visibility: visible;
}

/* This class will be added by JS to elements we want to highlight */
.is-in-focus {
    position: relative;
    z-index: 101; /* Above the backdrop */
    box-shadow: var(--shadow-focus);
    transition: box-shadow 0.3s ease;
}
```

**3. Add the Focus Backdrop to `index.html`:**

```html
<!-- In index.html, add this div just inside the <body> tag, before #app-container -->
<body>
    <div id="focus-backdrop"></div>
    <div id="app-container">
        <!-- ... rest of the app -->
```

---

### **Phase 2: Creating the Core Interaction Primitives**

**Goal:** Build the reusable visual elements that will simulate user and AI actions.

**Instructions:**

**1. Create the Simulated Mouse Cursor:** This is the most critical new element for showing user interaction.

*   **Add to `index.html`:**
    ```html
    <!-- In index.html, add this inside #app-container, after #main-app-ui -->
    <div id="simulated-cursor">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6.293 21.707L13.586 14.414L10 10.828L2.293 18.535C1.902 18.926 1.902 19.559 2.293 19.95L4.05 21.707C4.441 22.098 5.074 22.098 5.465 21.707H6.293ZM21.707 5.465L19.95 4.05C19.559 3.659 18.926 3.659 18.535 4.05L12 10.586L15.586 14.172L21.707 8.05C22.098 7.659 22.098 6.074 21.707 5.465Z" fill="var(--primary-accent)"/>
        </svg>
    </div>
    ```
*   **Add to `styles/main.css`:**
    ```css
    #simulated-cursor {
        position: absolute;
        z-index: 9999;
        pointer-events: none;
        transition: top 0.4s ease-out, left 0.4s ease-out, transform 0.1s ease-in-out;
        transform-origin: top left;
    }
    #simulated-cursor.is-clicking {
        transform: scale(0.8);
    }
    ```

**2. Create the "AI Thinking" Indicator:**

*   **Add to `index.html`:**
    ```html
    <!-- In index.html, add this inside #left-pane, at the top of #results-sidebar -->
    <div id="ai-thinking-indicator" style="display: none;">
        <div class="spinner"></div>
        <p id="ai-thinking-text">Thinking...</p>
    </div>
    ```
*   **Add to `styles/main.css`:**
    ```css
    #ai-thinking-indicator {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        text-align: center;
        color: var(--text-secondary);
    }
    .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid var(--border-color);
        border-top-color: var(--primary-accent);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 15px;
    }
    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    ```

**3. Create "Thought Bubble" Narration:** This will replace the bottom bar for most narration.

*   **Add to `index.html`:**
    ```html
    <!-- In index.html, add this inside #app-container, after the cursor -->
    <div id="thought-bubble" class="user-thought">
        <div class="thought-bubble-content"></div>
    </div>
    ```
*   **Add to `styles/main.css`:**
    ```css
    #thought-bubble {
        position: absolute;
        z-index: 9998;
        background-color: var(--surface-color);
        border: 1px solid var(--border-color);
        padding: 12px 16px;
        border-radius: 8px;
        max-width: 300px;
        box-shadow: var(--shadow-soft);
        opacity: 0;
        transform: translateY(10px);
        visibility: hidden;
        transition: all 0.3s ease;
        line-height: 1.5;
    }
    #thought-bubble.is-visible {
        opacity: 1;
        transform: translateY(0);
        visibility: visible;
    }
    /* Add a triangle "tail" to the bubble */
    #thought-bubble::after {
        content: '';
        position: absolute;
        width: 0;
        height: 0;
        border-style: solid;
    }
    #thought-bubble.user-thought {
        border-left: 3px solid var(--primary-accent);
    }
    #thought-bubble.ai-thought {
        /* Optional different styling for AI thoughts */
        border-left: 3px solid var(--success-color); /* Assuming you add this to :root */
    }
    ```

---

### **Phase 3: Rewriting the Story Engine for Experiential Flow**

**Goal:** Modify the JavaScript to use these new UI primitives and create a more dynamic, role-based story.

**Instructions:**

**1. Create a new `InteractionManager` module in `scripts/story-engine.js`:**

```javascript
// In scripts/story-engine.js, add this new module inside the StoryEngine IIFE
const InteractionManager = {
    cursor: DOMUtils.getElement('#simulated-cursor'),
    aiIndicator: DOMUtils.getElement('#ai-thinking-indicator'),
    thoughtBubble: DOMUtils.getElement('#thought-bubble'),
    
    // Moves the cursor to an element and returns a Promise
    moveTo: (selector) => {
        return new Promise(resolve => {
            const target = DOMUtils.getElement(selector);
            if (!target) { resolve(); return; }
            const rect = target.getBoundingClientRect();
            InteractionManager.cursor.style.top = `${rect.top + (rect.height / 2)}px`;
            InteractionManager.cursor.style.left = `${rect.left + (rect.width / 2)}px`;
            setTimeout(resolve, 500); // Wait for transition
        });
    },

    // Simulates a click and returns a Promise
    click: () => {
        return new Promise(resolve => {
            InteractionManager.cursor.classList.add('is-clicking');
            setTimeout(() => {
                InteractionManager.cursor.classList.remove('is-clicking');
                resolve();
            }, 200);
        });
    },

    // Shows a thought bubble near an element
    showThought: (role, text, attachToSelector) => {
        const bubble = InteractionManager.thoughtBubble;
        const content = bubble.querySelector('.thought-bubble-content');
        content.textContent = text;
        
        bubble.className = 'thought-bubble'; // Reset classes
        bubble.classList.add(`${role}-thought`);
        
        const target = DOMUtils.getElement(attachToSelector);
        if (target) {
            const rect = target.getBoundingClientRect();
            bubble.style.top = `${rect.bottom + 10}px`;
            bubble.style.left = `${rect.left}px`;
        }
        bubble.classList.add('is-visible');
    },

    hideThought: () => {
        InteractionManager.thoughtBubble.classList.remove('is-visible');
    },

    showAiThinking: (text) => {
        const indicator = InteractionManager.aiIndicator;
        indicator.querySelector('#ai-thinking-text').textContent = text;
        indicator.style.display = 'flex';
        DOMUtils.getElement('#results-sidebar .no-results-message').style.display = 'none';
    },

    hideAiThinking: () => {
        InteractionManager.aiIndicator.style.display = 'none';
    }
};
```

**2. Update the Story Script Schema and Rewrite `sample-story.js`:**
The old `narrate` is out. The new actions are more expressive.

```javascript
// In data/sample-story.js, COMPLETELY REPLACE the old script with this new one:

const sampleStory = {
    storyId: "experiential_demo",
    title: "An Experiential Story",
    dataKey: "sampleData",
    steps: [
        {
            action: "showThoughtBubble",
            role: "user", // 'user' or 'ai'
            text: "Okay, let's plan a quick trip. I'm thinking a weekend getaway to the mountains.",
            attachToSelector: "#initial-plan-prompt"
        },
        {
            action: "hideThoughtBubble"
        },
        {
            action: "typeInElement", // This action is still good
            targetSelector: "#initial-plan-prompt",
            textKey: "initialPlanName",
            createsBranch: true,
            branchId: "b0"
        },
        {
            action: "showThoughtBubble",
            role: "user",
            text: "Great. Now, what are some activities I can do there? Let's ask the agent.",
            attachToSelector: "[data-branch-id='b0']"
        },
        {
            // NEW ACTION: Simulate the user clicking the search button
            action: "simulateUserClick",
            targetSelector: "[data-branch-id='b0'] .branch-search-button"
        },
        {
            action: "hideThoughtBubble"
        },
        {
            // NEW ACTION: Show the AI thinking
            action: "showAiThinking",
            text: "Analyzing 'Weekend Getaway to the Mountains' for activity suggestions..."
        },
        {
            // NEW ACTION: A timed pause to simulate processing time
            action: "wait",
            duration: 2000 // in milliseconds
        },
        {
            action: "hideAiThinking"
        },
        {
            action: "showSidebarWithResults", // This is still useful
            resultsDataKey: "activityResults"
        },
        {
            action: "showThoughtBubble",
            role: "ai",
            text: "I've found a couple of highly-rated options. The 'Mountain Hiking Tour' is very popular.",
            attachToSelector: "#results-sidebar .result-card:first-child"
        },
        {
            action: "showThoughtBubble",
            role: "user",
            text: "Perfect, that sounds great. Let's add it to the plan.",
            attachToSelector: "[data-branch-id='b0']"
        },
        {
            action: "simulateUserClick",
            targetSelector: "#results-sidebar .result-card:first-child .export-to-plan-button"
        },
        {
            action: "hideThoughtBubble"
        },
        {
            action: "embedCardInBranch", // Still useful
            branchId: "b0",
            cardDataKey: "hikingTourCard"
        },
        {
            action: "showThoughtBubble",
            role: "ai",
            text: "Excellent choice. I can also generate a multi-step project plan for you based on a simple prompt.",
            attachToSelector: "[data-branch-id='b0']"
        },
        {
            action: "wait",
            duration: 1500
        },
        {
            action: "agentGenerateTemplate",
            targetBranchId: "b0",
            templateDataKey: "projectPlanTemplate"
        }
    ]
};
```

**3. Update `story-engine.js` `executeStep` to handle the new actions:**

```javascript
// In scripts/story-engine.js, update the executeStep function

// Make executeStep async to handle promises from InteractionManager and waits
const executeStep = async (step) => {
    if (!step) return;

    // Hide any previous thought bubble before the next action
    if (step.action !== 'showThoughtBubble') {
        InteractionManager.hideThought();
    }
    
    switch (step.action) {
        // ... OLD 'typeInElement', 'showSidebarWithResults', 'embedCardInBranch', 'agentGenerateTemplate' cases remain...
        // ... (You will need to add undo functions for the new actions)

        // NEW and REVISED cases:
        case 'narrate': // DEPRECATED, but keep for now
            Narration.update(step.text);
            break;

        case 'showThoughtBubble':
            InteractionManager.showThought(step.role, step.text, step.attachToSelector);
            break;

        case 'hideThoughtBubble':
            InteractionManager.hideThought();
            break;

        case 'simulateUserClick':
            await InteractionManager.moveTo(step.targetSelector);
            await InteractionManager.click();
            // This is a bit tricky. The actual click logic from your old code
            // needs to be triggered here. For an 'Export' button, it would be
            // to find the card data and trigger the embed. For a search button,
            // it would trigger the search flow. This requires refactoring.
            // For now, let's assume the click is purely visual.
            break;

        case 'showAiThinking':
            InteractionManager.showAiThinking(step.text);
            break;

        case 'hideAiThinking':
            InteractionManager.hideAiThinking();
            break;

        case 'wait':
            await new Promise(resolve => setTimeout(resolve, step.duration));
            break;

        // ...
    }
};

// You must also make nextStep async
const nextStep = async () => {
    if (currentStepIndex < currentStory.steps.length - 1) {
        // Disable next button while step is processing
        DOMUtils.getElement('#next-step-button').disabled = true;

        currentStepIndex++;
        const step = currentStory.steps[currentStepIndex];
        console.log(`Executing step ${currentStepIndex + 1}:`, step.action);
        await executeStep(step); // Use await here
        
        ButtonStateManager.updateButtons(); // Update states
        DOMUtils.getElement('#next-step-button').disabled = false; // Re-enable
    } else {
        // ... end of story logic
    }
};
```

**Final Instruction:**

"After implementing these three phases, the prototype will have a completely new, dynamic, and engaging feel. The focus should be on making the interaction primitives in `InteractionManager` robust and ensuring the `executeStep` function in the story engine correctly calls them based on the new, more expressive story script. The `simulateUserClick` action will require the most thought to connect the visual click to the functional outcome of that click."