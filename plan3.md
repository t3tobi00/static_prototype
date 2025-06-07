
"The static shell and initial story engine are complete and approved. Your next task is to implement Phase 2 features to enhance the prototype's interactivity and demonstrate more advanced planning capabilities. Please implement the following steps in order, modifying the existing files as specified."

---

#### **Step 1: Implement Hierarchical Sub-Branch Creation**

**Goal:** Enable the story to create branches *inside* other branches, visually representing a planning hierarchy.

**A. Update `data/sample-story.js`:**
Add a new step to the story script that creates a sub-branch.

```javascript
// In data/sample-story.js, add this to the end of the steps array:
{
    action: "narrate",
    text: "Each plan item can have its own detailed sub-steps. Let's add a note for our hiking tour."
},
{
    action: "createSubBranch",
    parentId: "b0", // The ID of the parent branch
    newBranchId: "b0.1", // The ID for our new sub-branch
    text: "To-Do: Confirm booking and check weather forecast."
}
```

**B. Update `scripts/story-engine.js`:**
1.  **Create a `BranchManager.createSubBranch` function:** This will be similar to `createBranch` but will target the parent's `.branch-children` container and handle visual indentation.
2.  **Add the `createSubBranch` case to `executeStep`:**

```javascript
// In scripts/story-engine.js

// --- Inside the BranchManager object ---
const BranchManager = {
    // ... existing createBranch and embedCard functions
    createSubBranch: (parentId, branchId, text) => {
        const parentBranch = DOMUtils.getElement(`[data-branch-id="${parentId}"]`);
        if (!parentBranch) {
            console.error("Parent branch not found:", parentId);
            return;
        }

        const childrenContainer = parentBranch.querySelector('.branch-children');
        const newBranch = DOMUtils.createFromTemplate('branch-item-template');

        if (newBranch && childrenContainer) {
            newBranch.dataset.branchId = branchId;
            newBranch.querySelector('.branch-text-area').textContent = text;
            
            // Add indentation for visual hierarchy
            const currentDepth = parseInt(parentBranch.dataset.depth || 0);
            newBranch.dataset.depth = currentDepth + 1;
            newBranch.style.paddingLeft = `${(currentDepth + 1) * 20}px`;

            // Make children container visible and add the new sub-branch
            childrenContainer.style.display = 'block';
            childrenContainer.appendChild(newBranch);
            
            // Optional: Expand the parent if it was collapsed
            parentBranch.querySelector('.branch-toggle-icon').textContent = '[v]';
        }
    },
};

// --- Inside the executeStep function's switch statement ---
// Add a new case:
case 'createSubBranch':
    BranchManager.createSubBranch(step.parentId, step.newBranchId, step.text);
    break;

// --- In BranchManager.createBranch, add a depth dataset ---
// Modify the createBranch function to add the initial depth:
createBranch: (branchId, text) => {
    // ... existing code ...
    if (newBranch) {
        newBranch.dataset.branchId = branchId;
        newBranch.dataset.depth = 0; // Set initial depth for top-level branches
        // ... rest of the function
    }
},
```

**What this accomplishes:** The demo will now be able to show nested planning, a core part of the app's vision.

---

#### **Step 2: Implement Agent-Driven Template Generation**

**Goal:** Simulate the AI agent populating a multi-step plan structure automatically, showcasing a major "magic moment."

**A. Update `data/sample-data.js`:**
Add a new data structure for a plan template.

```javascript
// In data/sample-data.js, add this to the sampleData object:
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
```

**B. Update `data/sample-story.js`:**
Add a step that triggers the template generation.

```javascript
// In data/sample-story.js, add these steps to the end:
{
    action: "narrate",
    text: "The agent can also generate entire plan templates. Here's a project plan..."
},
{
    action: "agentGenerateTemplate",
    targetBranchId: "b0", // We'll add this template as sub-branches of our main branch
    templateDataKey: "projectPlanTemplate"
}
```

**C. Update `scripts/story-engine.js`:**
1.  **Create a recursive function in `BranchManager`** to handle nested template structures.
2.  **Add the `agentGenerateTemplate` case to `executeStep`:**

```javascript
// In scripts/story-engine.js

// --- Inside the BranchManager object ---
const BranchManager = {
    // ... existing functions
    generateFromTemplate: (parentElement, templateNode, parentId) => {
        // Recursive function to build out the template
        const branchText = templateNode.text;
        const branchId = parentId ? `${parentId}.${templateNode.id}` : templateNode.id;

        // Determine if it's a top-level branch or a sub-branch
        if (parentElement.id === 'branch-container') {
             const newBranch = BranchManager.createBranch(branchId, branchText);
             // If this new branch has children, recurse
             if (templateNode.children && templateNode.children.length > 0) {
                 templateNode.children.forEach(childNode => {
                     BranchManager.generateFromTemplate(newBranch, childNode, branchId);
                 });
             }
        } else {
             const newSubBranch = BranchManager.createSubBranch(parentId, branchId, branchText);
             // If this new sub-branch has children, recurse
             if (templateNode.children && templateNode.children.length > 0) {
                 templateNode.children.forEach(childNode => {
                     BranchManager.generateFromTemplate(newSubBranch, childNode, branchId);
                 });
             }
        }
    }
};

// --- Inside the executeStep function's switch statement ---
// Add a new case:
case 'agentGenerateTemplate':
    const parentBranch = DOMUtils.getElement(`[data-branch-id="${step.targetBranchId}"]`);
    const templateData = currentData[step.templateDataKey];
    if (parentBranch && templateData) {
        if (templateData.children) {
            templateData.children.forEach(childNode => {
                BranchManager.generateFromTemplate(parentBranch, childNode, step.targetBranchId);
            });
        }
    }
    break;
```

**What this accomplishes:** The demo now has a powerful example of agentic assistance, making the AI's role feel more tangible and intelligent.

---

#### **Step 3: Enhance "Previous Step" for True Undo Functionality**

**Goal:** Make the "Previous" button actually reverse the last visual change, not just update the narration.

**A. Update `scripts/story-engine.js`:**
Introduce an `undoStack` and modify actions to push their "undo" operations onto it.

```javascript
// In scripts/story-engine.js

// --- At the top of the StoryEngine IIFE ---
let undoStack = [];

// --- Inside the init() function ---
// Add this line to clear the stack on init
undoStack = [];

// --- Inside the restart() function ---
// Add this line to clear the stack on restart
undoStack = [];

// --- Modify actions inside executeStep to push to the undoStack ---
// For example, modify the 'createSubBranch' case:
case 'createSubBranch':
    BranchManager.createSubBranch(step.parentId, step.newBranchId, step.text);
    // Push the undo function
    undoStack.push(() => {
        const branchToRemove = DOMUtils.getElement(`[data-branch-id="${step.newBranchId}"]`);
        if (branchToRemove) branchToRemove.remove();
    });
    break;

// Do the same for other visual actions:
// 'typeInElement' with 'createsBranch': undo is to remove the branch and restore the prompt.
// 'showSidebarWithResults': undo is to clear the sidebar.
// 'embedCardInBranch': undo is to clear the card slot.
// 'agentGenerateTemplate': undo is more complex; it involves removing all generated branches.

// --- Modify the prevStep() function ---
const prevStep = () => {
    if (currentStepIndex >= 0) {
        // Pop and execute the last undo function
        const undoAction = undoStack.pop();
        if (undoAction) {
            undoAction();
        }

        currentStepIndex--;
        
        // Update narration to the new current step's text
        const step = currentStory.steps[currentStepIndex];
        if (step && step.action === 'narrate') {
            Narration.update(step.text);
        } else if (currentStepIndex === -1) {
            Narration.update("Welcome! Click 'Next Step' to begin the demo.");
        } else {
             // Handle cases where the previous step wasn't narration
            Narration.update(`(Undid last action)`);
        }
        
        ButtonStateManager.updateButtons();
    }
};
```

**What this accomplishes:** The prototype will feel significantly more robust and polished, allowing viewers to step back and forth through the demo seamlessly.

---

**Final Instruction:**

"After implementing these three steps, please ensure the `TESTING_GUIDE.md` is updated with the new story steps and their expected outcomes. The prototype will then be ready for the next round of feature enhancements."