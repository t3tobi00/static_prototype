# Story Weaver Testing Guide

## How to Test the Demo

1. **Open `index.html`** in a web browser
2. **Follow the step-by-step demo** by clicking "Next Step"

## Expected Behavior

### Step 1: Welcome
- **Action**: Click "Next Step"
- **Expected**: Narration changes to "First, let's name our plan. We'll call it 'Weekend Getaway'."
- **UI Changes**: Previous and Restart buttons become visible

### Step 2: Second Narration
- **Action**: Click "Next Step"
- **Expected**: Narration changes to "This is the second step of the narration."

### Step 3: Plan Introduction
- **Action**: Click "Next Step"
- **Expected**: Narration changes to "Alex starts by naming the plan..."

### Step 4: Typing Animation
- **Action**: Click "Next Step"
- **Expected**: 
  - Text "Weekend Getaway to the Mountains" types out in the placeholder area
  - After typing completes, the placeholder disappears
  - A new branch item appears with the typed text

### Step 5: Search Introduction
- **Action**: Click "Next Step"
- **Expected**: Narration changes to "Now, let's search for some activities..."

### Step 6: Populate Sidebar
- **Action**: Click "Next Step"
- **Expected**: 
  - Left sidebar populates with two cards:
    - "Mountain Hiking Tour" (Price: $75)
    - "Lake Kayaking" (Price: $40)

### Step 7: Card Selection
- **Action**: Click "Next Step"
- **Expected**: Narration changes to "'Mountain Hiking Tour' looks perfect. Let's add it to our plan."

### Step 8: Embed Card
- **Action**: Click "Next Step"
- **Expected**: 
  - The "Mountain Hiking Tour" card gets embedded inside the main branch
  - The embedded card shows without the "Export to Plan" button

### Step 9: Sub-Branch Introduction
- **Action**: Click "Next Step"
- **Expected**: Narration changes to "Each plan item can have its own detailed sub-steps. Let's add a note for our hiking tour."

### Step 10: Create Sub-Branch
- **Action**: Click "Next Step"
- **Expected**: 
  - A sub-branch appears under the main branch with text "To-Do: Confirm booking and check weather forecast."
  - The sub-branch is visually indented to show hierarchy
  - The parent branch toggle icon changes to "[v]" indicating expansion

### Step 11: Template Generation Introduction
- **Action**: Click "Next Step"
- **Expected**: Narration changes to "The agent can also generate entire plan templates. Here's a project plan..."

### Step 12: Agent Template Generation
- **Action**: Click "Next Step"
- **Expected**: 
  - Multiple sub-branches are automatically generated under the main branch:
    - "Phase 1: Research & Discovery"
    - "Phase 2: Design & Prototyping" (with its own sub-branches)
      - "Create wireframes"
      - "Build interactive prototype"
    - "Phase 3: Development"
  - All branches show proper hierarchical indentation

### Step 13: Demo Complete
- **Action**: Click "Next Step"
- **Expected**: 
  - Narration changes to "End of the demo. Click 'Restart' to watch again."
  - "Next Step" button becomes "Demo Complete" and gets disabled

## Enhanced Features (Plan 3)

### True Undo Functionality
- **Action**: Click "← Previous" at any step after the first
- **Expected**: 
  - **Visual undo**: The last visual change is actually reversed (not just narration)
  - **Branch removal**: If last action created a branch, it gets removed
  - **Card embedding undo**: If last action embedded a card, the card slot clears
  - **Sidebar undo**: If last action populated sidebar, it clears back to default
  - **Template undo**: If last action generated multiple branches, all are removed
  - **Typing undo**: If last action typed text, the prompt reappears and text clears

### Hierarchical Planning
- **Sub-branches**: Branches can contain child branches with visual indentation
- **Multi-level nesting**: Support for deep hierarchical structures
- **Visual hierarchy**: Proper indentation and toggle icons for organization

### Agent-Driven Templates
- **Automatic generation**: AI agent can populate entire plan structures
- **Nested templates**: Templates support multiple levels of hierarchy
- **Batch creation**: Multiple branches created in a single action

## Additional Features

### Restart Function
- **Action**: Click "↺ Restart" (visible after first step)
- **Expected**: 
  - Everything resets to initial state
  - Sidebar clears back to "Search results will appear here."
  - Branch container shows placeholder again
  - Button states reset

### Previous Step
- **Action**: Click "← Previous" (visible after first step)
- **Expected**: 
  - **NEW**: True undo functionality - actually reverses the last visual change
  - Goes back one step in the narration
  - Updates button states accordingly
  - Shows appropriate narration for that step

## Key Technical Features Demonstrated

1. **Story Engine Architecture**: Modular design with separate managers
2. **DOM Manipulation**: Creating elements from templates
3. **Typing Animation**: Simulated user input with blinking cursor
4. **Dynamic UI Updates**: Cards, branches, and state management
5. **Event-Driven Actions**: Step-by-step story progression
6. **Template System**: Reusable card and branch templates
7. **Hierarchical Branching**: Multi-level nested planning structure
8. **Undo Stack**: True undo functionality with visual reversals
9. **Agent Templates**: Automated multi-branch generation

## Browser Console
Check the browser console for detailed logging of each step and action execution.
