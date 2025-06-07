Okay, let's design the detailed blueprint for your "Story Weaver" static site prototype. This will serve as precise instructions for an LLM agent to generate the initial HTML, CSS, and basic JavaScript structure.

**Project Title:** "Story Weaver: Agentic Planner Prototype"

**Overall Goal:** A static website shell that visually represents an "Evolving Branch Planner" application, ready to be driven by JavaScript story scripts. The UI should be clean, modern, and intuitive.

**I. Global Page Structure & Styling (HTML `<body>` and Global CSS)**

1.  **Font:** Use a clean, modern sans-serif font (e.g., Inter, Lato, Open Sans - specify one, or ask for a common system sans-serif like Arial/Helvetica as a fallback).
2.  **Background:** A very light grey (`#F8F9FA`) or off-white (`#FEFEFE`) for the main body.
3.  **App Container (`<div id="app-container">`):**
    *   Max-width: `1400px` (or similar, to prevent extreme width on large monitors).
    *   Margin: `0 auto` (to center it).
    *   Padding: `20px`.
    *   Display: `flex`, `flex-direction: column` (to stack narrator and main app UI).
4.  **Color Palette (Suggest specific hex codes):**
    *   Primary Action/Highlight: A pleasant blue (e.g., `#007BFF`).
    *   Secondary/Subtle: Light grey (e.g., `#CED4DA`).
    *   Text (Primary): Dark grey/near black (e.g., `#212529`).
    *   Text (Secondary/Muted): Medium grey (e.g., `#6C757D`).
    *   Borders: Very light grey (e.g., `#E9ECEF`).
    *   Success/Confirmation: A calm green (e.g., `#28A745`).
    *   Warning/Attention: A soft yellow/orange (e.g., `#FFC107`).
    *   Card Backgrounds: White (`#FFFFFF`).

**II. Story Narrator Section (`<div id="story-narrator">`)**

*   **Purpose:** To display step-by-step instructions/narration for the demo viewer and provide navigation controls for the scripted story.
*   **Styling:**
    *   Position: Fixed at the bottom or top of the viewport, or a distinct section above the main app UI. Let's go with **fixed at the bottom** for this spec.
    *   Background: Slightly darker than the body, or a subtle accent color (e.g., a slightly darker grey `#E9ECEF` or a muted version of the primary blue).
    *   Padding: `15px`.
    *   Box-shadow: A gentle top shadow to lift it off the page.
    *   `z-index`: High, to ensure it's above other content.
    *   `display: flex`, `align-items: center`, `justify-content: space-between`.
*   **Elements:**
    1.  **Narration Text (`<p id="narration-text">`):**
        *   Flex-grow: `1` (to take available space).
        *   Font size: `16px`.
        *   Color: Primary text color.
        *   Initial Text: "Welcome! Click 'Next Step' to begin the demo."
    2.  **Buttons Container (a `div` to group buttons):**
        *   `display: flex`, `gap: 10px`.
    3.  **Previous Step Button (`<button id="prev-step-button">`):**
        *   Text: `← Previous`
        *   Styling: Standard button style (light background, primary color text/border on hover). Initially, `visibility: hidden` or `disabled` state until a previous step exists.
    4.  **Next Step Button (`<button id="next-step-button">`):**
        *   Text: `Next Step →`
        *   Styling: Prominent button style (primary color background, white text).
    5.  **Restart Story Button (`<button id="restart-story-button">`):**
        *   Text: `↺ Restart`
        *   Styling: Standard button style. `visibility: hidden` or `disabled` until the story is past the first step.

**III. Main App UI Container (`<div id="main-app-ui">`)**

*   **Purpose:** To hold the two main panes of the simulated application.
*   **Styling:**
    *   `display: flex`.
    *   `flex-direction: row` (left and right panes side-by-side).
    *   `height`: e.g., `calc(100vh - 120px)` (to fill most of the screen, accounting for narrator bar and some padding; adjust height as needed).
    *   `background-color`: White or a very light neutral if `app-container` is off-white.
    *   `border`: `1px solid` (border color).
    *   `border-radius`: `8px`.
    *   `overflow: hidden` (to contain children and maintain border radius).

**IV. Left Pane (`<div id="left-pane">`)**

*   **Purpose:** To display the search input area and search results sidebar.
*   **Styling:**
    *   `flex-basis: 30%` (takes up 30% of the `main-app-ui` width).
    *   `min-width: 300px`.
    *   `border-right`: `1px solid` (border color) to separate from the right pane.
    *   `display: flex`, `flex-direction: column`.
    *   `padding: 15px`.
*   **Elements:**
    1.  **Search Area (`<div id="search-area">`):**
        *   `margin-bottom: 15px`.
        *   **Search Input Container (`<div id="search-input-container">`):**
            *   Will hold a dynamically created `<input type="text">` or `<textarea>` by JavaScript to simulate typing. For initial static HTML, it can be empty or contain a placeholder div.
            *   **Placeholder div:** `<div class="search-input-placeholder">Click an action to search...</div>` (styled like a disabled input field).
        *   **Search Action Button (`<button id="search-action-button">`):**
            *   Text: `Search` (or an icon).
            *   Initially `display: none;` (JS will show it when appropriate).
    2.  **Results Sidebar (`<div id="results-sidebar">`):**
        *   `flex-grow: 1` (to take remaining vertical space).
        *   `overflow-y: auto` (to allow scrolling if many results).
        *   Initial State: Empty, or with a message like `<p class="no-results-message">Search results will appear here.</p>`.
        *   **Result Card Template (`<template id="result-card-template">`):** (Define its internal structure exactly as needed)
            *   `<div class="result-card">`
                *   `background-color`: Card background (white).
                *   `border`: `1px solid` (border color).
                *   `border-radius`: `6px`.
                *   `padding: 10px`.
                *   `margin-bottom: 10px`.
                *   `box-shadow`: Subtle, `0 2px 4px rgba(0,0,0,0.05)`.
                *   `display: flex`, `flex-direction: column` or `row` if image is side-by-side. Let's say `column`.
                *   `<img src="" alt="Result Image" class="card-image">`: `max-width: 100%`, `height: 150px` (or similar), `object-fit: cover`, `border-radius: 4px`, `margin-bottom: 8px`.
                *   `<h3 class="card-title"></h3>`: Font size `18px`, bold.
                *   `<p class="card-description"></p>`: Font size `14px`, muted text color.
                *   `<p class="card-extra-info"></p>`: Font size `12px`, very muted, italic.
                *   `<button class="export-to-plan-button">Export to Plan</button>`: Styled like a primary action button, but smaller. `margin-top: auto` to push to bottom if card is flex column.

**V. Right Pane / Planning Canvas (`<div id="right-pane" class="planning-canvas">`)**

*   **Purpose:** The main area where the plan is built with branches.
*   **Styling:**
    *   `flex-basis: 70%`.
    *   `padding: 20px`.
    *   `overflow-y: auto`.
    *   `position: relative` (if needed for absolute positioning of certain UI elements within it).
*   **Elements:**
    1.  **Plan Title Area (`<div id="plan-title-area">`):**
        *   Initially `display: none;` (JS shows when a plan is "named").
        *   `margin-bottom: 20px`.
        *   `<h2 id="plan-title-text"></h2>`: Font size `24px`, bold.
    2.  **Branch Container (`<div id="branch-container">`):**
        *   This is where all top-level branches will be appended.
        *   Initial state: Could have a placeholder message if empty: `<p class="empty-plan-message">Start your plan by adding a main branch or initiating a search.</p>`.
        *   **Branch Item Template (`<template id="branch-item-template">`):**
            *   `<div class="branch-item" data-branch-id="">` (JS will set `data-branch-id`)
                *   `display: flex`, `margin-bottom: 8px`.
                *   `padding-left`: Varies based on depth (JS will set this using an inline style or depth-based classes).
                *   `position: relative` (for connector lines).
                *   `border-left: 2px solid transparent` (can be colored by JS to show active state).
            *   **Indent & Connector (`<div class="branch-indent">`):**
                *   `display: flex`, `align-items: center`.
                *   `width: 20px` (or adjusted by JS based on depth).
                *   `<span class="branch-connector"></span>`: For JS/CSS to draw lines connecting parent/child. Initially empty. Could be styled with CSS borders to create tree lines.
                *   `<span class="branch-toggle-icon">[&gt;]</span>`: Clickable to collapse/expand. Cursor: pointer. Primary action color. Can be `[v]` when expanded.
            *   **Branch Content (`<div class="branch-content">`):**
                *   `flex-grow: 1`.
                *   `background-color`: White (or a very light shade for distinction).
                *   `border`: `1px solid` (border color).
                *   `border-radius`: `4px`.
                *   `padding: 8px 12px`.
                *   `display: flex`, `flex-direction: column`.
                *   `<div class="branch-text-area" contenteditable="false"></div>`: For main branch text. Min-height `24px`. JS will make it "editable" by swapping with an input or handling typing.
                *   `<div class="branch-card-slot"></div>`: Empty by default. JS will insert an exported "result-card" here. When filled, give it `margin-top: 8px`.
                *   `<div class="branch-actions" style="display:none;">`: Initially hidden, JS shows on hover/focus.
                    *   `display: flex`, `gap: 8px`, `margin-top: 8px`.
                    *   `<button class="branch-search-button">🔍 Search</button>`
                    *   `<button class="add-sub-branch-button">+ Sub-branch</button>`
                    *   `<button class="branch-more-options-button">...</button>` (all styled as small, subtle action buttons).
            *   **Branch Children (`<div class="branch-children" style="display:none;">`):**
                *   Where nested `branch-item`s go.
                *   `padding-left: 20px` (or same as indent width). `margin-top: 5px`.
    3.  **Add Main Branch Button (`<button id="add-main-branch-button">`):**
        *   Text: `+ Add Step to Plan` (or similar).
        *   Position: Could be fixed at the bottom of the `right-pane` or appear dynamically.
        *   Styling: A clear call-to-action button.
        *   Initially `display: none;` or subtly visible if plan is empty.

**VI. Basic JavaScript File Structure (Placeholders)**

1.  **`scripts/story-engine.js`:**
    ```javascript
    // Placeholder for the StoryEngine class/object
    // Will contain init, nextStep, prevStep, executeAction, etc.
    // Will contain helper modules/objects like DOMUtils, BranchManager, SidebarManager, Animation
    console.log("Story Engine Loaded");
    ```
2.  **`scripts/main-story-player.js`:**
    ```javascript
    // Placeholder for loading the specific story script & data
    // And initializing the StoryEngine
    document.addEventListener('DOMContentLoaded', () => {
        console.log("Main Story Player Loaded");
        // const storyToLoad = someStoryObject; // Will be loaded dynamically
        // const storyDataToLoad = someStoryDataObject;
        // StoryEngine.init(storyToLoad, storyDataToLoad);

        // Placeholder: Add event listeners for narrator buttons
        // document.getElementById('next-step-button').addEventListener('click', () => StoryEngine.nextStep());
    });
    ```
3.  **`data/sample-story.js` & `data/sample-data.js`:**
    *   Create dummy files with the structure outlined previously (even if very minimal, like one step) so `main-story-player.js` has something to notionally load.

**Instructions to LLM Agent for Generation:**

"Please generate a static website with the following HTML structure, CSS styling, and JavaScript file placeholders. This website is intended as a shell for a 'Story Weaver' prototype to demonstrate an agentic planning application.

1.  **Global Page:** Implement the specified font, background color, and app container styling. Adhere to the provided color palette.
2.  **Story Narrator Section:** Create the fixed bottom bar with narration text and navigation buttons as described. Ensure buttons are initially in their correct visibility/disabled state if specified (e.g., 'Previous' hidden at start).
3.  **Main App UI:** Structure the two-pane layout (left and right).
4.  **Left Pane:** Implement the search area (with placeholder input) and the results sidebar. Include the `<template id="result-card-template">` with its detailed internal structure and styling.
5.  **Right Pane (Planning Canvas):** Implement the plan title area and the main branch container. Include the `<template id="branch-item-template">` with its detailed internal structure (indent, content, actions, children) and styling. Include the "Add Main Branch" button.
6.  **CSS:**
    *   Implement all specified styling for dimensions, colors, flexbox layouts, padding, margins, borders, border-radii, and typography.
    *   Include basic hover states for buttons (e.g., slightly darker background or primary color emphasis).
    *   Ensure `overflow-y: auto` is set for scrollable areas (`results-sidebar`, `right-pane`).
7.  **JavaScript Files:** Create the three placeholder `.js` files (`story-engine.js`, `main-story-player.js`) and the sample data files (`data/sample-story.js`, `data/sample-data.js`) with basic console logs or empty object structures as indicated. Link the main JS files correctly in the HTML.

The goal is a visually complete static shell. No complex JavaScript logic is needed at this stage beyond the file structures; interactivity will be added later. Pay close attention to the `id` and `class` names as they will be used by JavaScript for DOM manipulation."

---

This detailed specification should give the LLM a very clear idea of what to build. After generation, you'll review and refine it, then proceed to integrate the JavaScript story engine logic.