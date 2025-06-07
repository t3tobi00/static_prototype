// Story Engine - The core director that orchestrates the demo
const StoryEngine = (() => {
    let currentStory = {};
    let currentData = {};
    let currentStepIndex = -1;
    let undoStack = [];

    // --- Helper Modules ---
    const DOMUtils = {
        getElement: (selector) => document.querySelector(selector),
        updateText: (selector, text) => {
            const element = DOMUtils.getElement(selector);
            if (element) {
                element.textContent = text;
            } else {
                console.warn("Element not found:", selector);
            }
        },
        typeText: (element, text, speed = 50, callback) => {
            let i = 0;
            element.textContent = ""; // Clear it first
            element.classList.add('is-typing'); // For styling a blinking cursor
            
            function type() {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                } else {
                    element.classList.remove('is-typing');
                    if (callback) callback();
                }
            }
            type();
        },
        createFromTemplate: (templateId) => {
            const template = document.getElementById(templateId);
            if (template) {
                return template.content.firstElementChild.cloneNode(true);
            } else {
                console.error("Template not found:", templateId);
                return null;
            }
        }
    };

    const Narration = {
        update: (text) => {
            DOMUtils.updateText('#narration-text', text);
        }
    };

    // --- Interaction Manager Module ---
    const InteractionManager = {
        get cursor() { return DOMUtils.getElement('#simulated-cursor'); },
        get aiIndicator() { return DOMUtils.getElement('#ai-thinking-indicator'); },
        get thoughtBubble() { return DOMUtils.getElement('#thought-bubble'); },

        // Moves the cursor to an element and returns a Promise
        moveTo: (selector) => {
            return new Promise(resolve => {
                const target = DOMUtils.getElement(selector);
                if (!target) { 
                    console.warn("Target element not found for cursor movement:", selector);
                    resolve(); 
                    return; 
                }
                const rect = target.getBoundingClientRect();
                InteractionManager.cursor.style.top = `${rect.top + (rect.height / 2)}px`;
                InteractionManager.cursor.style.left = `${rect.left + (rect.width / 2)}px`;
                InteractionManager.cursor.classList.add('is-visible');
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
            const bubble = InteractionManager.thoughtBubble;
            if (bubble) {
                bubble.classList.remove('is-visible');
            }
        },

        // New chatbot methods for improved UX
        addChatMessage: (message, isUser = false) => {
            return new Promise(resolve => {
                const chatMessages = DOMUtils.getElement('#chat-messages');
                const messageDiv = document.createElement('div');
                messageDiv.className = `chat-message ${isUser ? 'user-message' : 'ai-message'}`;
                
                const contentDiv = document.createElement('div');
                contentDiv.className = 'message-content';
                messageDiv.appendChild(contentDiv);
                
                chatMessages.appendChild(messageDiv);
                
                // Add slide-in animation
                messageDiv.style.transform = 'translateY(20px)';
                messageDiv.style.opacity = '0';
                messageDiv.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    messageDiv.style.transform = 'translateY(0)';
                    messageDiv.style.opacity = '1';
                }, 50);
                
                if (isUser) {
                    contentDiv.textContent = message;
                    setTimeout(() => {
                        chatMessages.scrollTop = chatMessages.scrollHeight;
                        resolve();
                    }, 100);
                } else {
                    // Show typing indicator first
                    const typingDiv = document.createElement('div');
                    typingDiv.className = 'typing-indicator';
                    typingDiv.innerHTML = '<span></span><span></span><span></span>';
                    contentDiv.appendChild(typingDiv);
                    
                    setTimeout(() => {
                        contentDiv.removeChild(typingDiv);
                        DOMUtils.typeText(contentDiv, message, 30, () => {
                            chatMessages.scrollTop = chatMessages.scrollHeight;
                            resolve();
                        });
                    }, 1200);
                }
            });
        },

        showChatConfirmation: (message) => {
            return new Promise(resolve => {
                const chatMessages = DOMUtils.getElement('#chat-messages');
                const messageDiv = document.createElement('div');
                messageDiv.className = 'chat-message ai-message';
                
                const contentDiv = document.createElement('div');
                contentDiv.className = 'message-content';
                contentDiv.innerHTML = `
                    <div style="margin-bottom: 12px;">${message}</div>
                    <div class="confirmation-buttons">
                        <button class="confirm-yes">Yes</button>
                        <button class="confirm-no">No</button>
                    </div>
                `;
                
                messageDiv.appendChild(contentDiv);
                chatMessages.appendChild(messageDiv);
                chatMessages.scrollTop = chatMessages.scrollHeight;
                
                // Add slide-in animation
                messageDiv.style.transform = 'translateY(20px)';
                messageDiv.style.opacity = '0';
                messageDiv.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    messageDiv.style.transform = 'translateY(0)';
                    messageDiv.style.opacity = '1';
                }, 50);
                
                // Handle button clicks
                contentDiv.querySelector('.confirm-yes').addEventListener('click', () => resolve(true));
                contentDiv.querySelector('.confirm-no').addEventListener('click', () => resolve(false));
            });
        },

        showResultsInChat: (results) => {
            const resultsContainer = DOMUtils.getElement('#results-sidebar');
            resultsContainer.innerHTML = '';
            resultsContainer.style.display = 'block';
            resultsContainer.classList.add('in-chat');
            
            results.forEach((result, index) => {
                const resultCard = DOMUtils.createFromTemplate('result-card-template');
                if (resultCard) {
                    resultCard.querySelector('.card-image').src = result.image;
                    resultCard.querySelector('.card-title').textContent = result.title;
                    resultCard.querySelector('.card-description').textContent = result.description;
                    resultCard.querySelector('.card-extra-info').textContent = result.extraInfo || result.extra || '';
                    
                    // Add staggered animation
                    resultCard.style.opacity = '0';
                    resultCard.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        resultCard.style.opacity = '1';
                        resultCard.style.transform = 'translateY(0)';
                    }, index * 100);
                    
                    resultsContainer.appendChild(resultCard);
                }
            });
        },

        createRippleEffect: (element, event) => {
            const rect = element.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const ripple = document.createElement('span');
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (event ? event.clientX - rect.left - size / 2 : rect.width / 2 - size / 2) + 'px';
            ripple.style.top = (event ? event.clientY - rect.top - size / 2 : rect.height / 2 - size / 2) + 'px';
            ripple.classList.add('ripple');
            
            const rippleContainer = element.querySelector('.ripple-container') || element;
            rippleContainer.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        },

        animateExportButton: (button) => {
            button.classList.add('is-clicked');
            setTimeout(() => {
                button.classList.remove('is-clicked');
            }, 600);
        },

        animateCardDrag: (card, targetSlot) => {
            return new Promise(resolve => {
                // Get positions for smooth transition
                const cardRect = card.getBoundingClientRect();
                const slotRect = targetSlot.getBoundingClientRect();
                
                // Create a flying card clone
                const flyingCard = card.cloneNode(true);
                flyingCard.style.position = 'fixed';
                flyingCard.style.top = cardRect.top + 'px';
                flyingCard.style.left = cardRect.left + 'px';
                flyingCard.style.width = cardRect.width + 'px';
                flyingCard.style.height = cardRect.height + 'px';
                flyingCard.style.zIndex = '9999';
                flyingCard.style.transition = 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                flyingCard.style.pointerEvents = 'none';
                
                document.body.appendChild(flyingCard);
                
                // Add dragging class to original card
                card.classList.add('is-dragging');
                
                // Add receiving class to slot
                targetSlot.classList.add('is-receiving');
                
                // Animate the flying card to target
                setTimeout(() => {
                    flyingCard.style.top = slotRect.top + 'px';
                    flyingCard.style.left = slotRect.left + 'px';
                    flyingCard.style.transform = 'scale(0.9) rotate(3deg)';
                    flyingCard.style.opacity = '0.8';
                }, 50);
                
                // Clean up after animation
                setTimeout(() => {
                    card.classList.remove('is-dragging');
                    targetSlot.classList.remove('is-receiving');
                    document.body.removeChild(flyingCard);
                    resolve();
                }, 900);
            });
        },

        hideCursor: () => {
            const cursor = InteractionManager.cursor;
            if (cursor) {
                cursor.classList.remove('is-visible');
            }
        }
    };

    // --- Branch Manager Module ---
    const BranchManager = {
        createBranch: (branchId, text) => {
            const branchContainer = DOMUtils.getElement('#branch-container');
            const initialPrompt = DOMUtils.getElement('#initial-plan-prompt');
            
            if (initialPrompt) {
                initialPrompt.style.display = 'none';
            }
            
            const newBranch = DOMUtils.createFromTemplate('branch-item-template');
            if (newBranch) {
                newBranch.setAttribute('data-branch-id', branchId);
                newBranch.querySelector('.branch-text-area').textContent = text;
                branchContainer.appendChild(newBranch);
                
                // Setup event listeners for the new branch
                EventHandlers.setupSearchIconHandlers();
                EventHandlers.setupExportButtonHandlers();
                
                return newBranch;
            }
            return null;
        },

        embedCard: (branchId, cardData) => {
            const branch = DOMUtils.getElement(`[data-branch-id="${branchId}"]`);
            if (!branch) {
                console.error("Branch not found:", branchId);
                return;
            }
            
            const cardSlot = branch.querySelector('.branch-card-slot');
            const card = DOMUtils.createFromTemplate('result-card-template');
            
            if (card && cardSlot) {
                card.querySelector('.card-title').textContent = cardData.title;
                card.querySelector('.card-description').textContent = cardData.description;
                card.querySelector('.card-image').src = cardData.image;
                card.querySelector('.card-extra-info').textContent = cardData.extra || cardData.extraInfo || '';
                card.querySelector('.export-to-plan-button').style.display = 'none';
                
                cardSlot.innerHTML = '';
                cardSlot.appendChild(card);
            }
        },

        generateFromTemplate: (parentElement, templateNode, parentId, depth = 0) => {
            const branchId = parentId ? `${parentId}.${templateNode.id}` : templateNode.id;
            const newBranch = DOMUtils.createFromTemplate('branch-item-template');
            
            if (newBranch) {
                newBranch.setAttribute('data-branch-id', branchId);
                newBranch.querySelector('.branch-text-area').textContent = templateNode.text;
                newBranch.style.setProperty('--depth', depth);
                
                const childrenContainer = newBranch.querySelector('.branch-children');
                
                if (templateNode.children && templateNode.children.length > 0) {
                    templateNode.children.forEach(childNode => {
                        BranchManager.generateFromTemplate(childrenContainer, childNode, branchId, depth + 1);
                    });
                }
                
                if (parentElement.classList && parentElement.classList.contains('branch-children')) {
                    parentElement.appendChild(newBranch);
                } else {
                    const existingChildren = parentElement.querySelector('.branch-children');
                    if (existingChildren) {
                        existingChildren.appendChild(newBranch);
                    } else {
                        parentElement.appendChild(newBranch);
                    }
                }
                
                // Setup event listeners
                EventHandlers.setupSearchIconHandlers();
                EventHandlers.setupExportButtonHandlers();
                
                return newBranch;
            }
            return null;
        },

        generateFromTemplateAnimated: (parentElement, templateNode, parentId, delay = 0, depth = 0) => {
            return new Promise(resolve => {
                setTimeout(() => {
                    const branchId = parentId ? `${parentId}.${templateNode.id}` : templateNode.id;
                    const newBranch = DOMUtils.createFromTemplate('branch-item-template');
                    
                    if (newBranch) {
                        newBranch.setAttribute('data-branch-id', branchId);
                        newBranch.querySelector('.branch-text-area').textContent = templateNode.text;
                        newBranch.style.setProperty('--depth', depth);
                        
                        // Add to parent with animation
                        const childrenContainer = newBranch.querySelector('.branch-children');
                        
                        if (parentElement.classList && parentElement.classList.contains('branch-children')) {
                            parentElement.appendChild(newBranch);
                        } else {
                            const existingChildren = parentElement.querySelector('.branch-children');
                            if (existingChildren) {
                                existingChildren.appendChild(newBranch);
                            } else {
                                parentElement.appendChild(newBranch);
                            }
                        }
                        
                        // Animate in
                        newBranch.style.opacity = '0';
                        newBranch.style.transform = 'translateY(-10px)';
                        newBranch.style.transition = 'all 0.3s ease';
                        
                        setTimeout(() => {
                            newBranch.style.opacity = '1';
                            newBranch.style.transform = 'translateY(0)';
                        }, 100);

                        // Process children with additional delays
                        if (templateNode.children && templateNode.children.length > 0) {
                            let childDelay = 800;
                            templateNode.children.forEach((childNode, index) => {
                                setTimeout(() => {
                                    BranchManager.generateFromTemplateAnimated(newBranch, childNode, branchId, childDelay + (index * 300), depth + 1);
                                }, childDelay + (index * 300));
                            });
                        }
                        
                        // Setup event listeners
                        EventHandlers.setupSearchIconHandlers();
                        EventHandlers.setupExportButtonHandlers();
                    }
                    
                    setTimeout(resolve, 300);
                }, delay);
            });
        }
    };

    // --- Sidebar Manager Module ---
    const SidebarManager = {
        populateResults: (resultsData) => {
            const sidebar = DOMUtils.getElement('#results-sidebar');
            if (!sidebar) return;
            
            sidebar.innerHTML = '';
            
            resultsData.forEach(data => {
                const card = DOMUtils.createFromTemplate('result-card-template');
                if (card) {
                    card.querySelector('.card-title').textContent = data.title;
                    card.querySelector('.card-description').textContent = data.description;
                    card.querySelector('.card-image').src = data.image;
                    card.querySelector('.card-extra-info').textContent = data.extra || data.extraInfo || '';
                    sidebar.appendChild(card);
                }
            });
            
            sidebar.style.display = 'block';
        },
        show: () => { 
            console.log("Showing sidebar");
        },
        hide: () => { 
            console.log("Hiding sidebar");
        }
    };

    // --- Button State Manager ---
    const ButtonStateManager = {
        updateButtons: () => {
            const prevButton = DOMUtils.getElement('#prev-step-button');
            const nextButton = DOMUtils.getElement('#next-step-button');
            const restartButton = DOMUtils.getElement('#restart-story-button');
            
            // Previous button: visible if we're past step 0
            if (prevButton) {
                prevButton.style.visibility = currentStepIndex > 0 ? 'visible' : 'hidden';
            }
            
            // Restart button: visible if we're past step 0
            if (restartButton) {
                restartButton.style.visibility = currentStepIndex > 0 ? 'visible' : 'hidden';
            }
            
            // Next button: show "End" if we're at the last step
            if (nextButton) {
                if (currentStepIndex >= currentStory.steps.length - 1) {
                    nextButton.textContent = "Demo Complete";
                    nextButton.disabled = true;
                } else {
                    nextButton.textContent = "Next Step →";
                    nextButton.disabled = false;
                }
            }
        }
    };

    // --- Event Handlers Module ---
    const EventHandlers = {
        setupSearchIconHandlers: () => {
            // Add event delegation for search icons - only for ripple effect during story mode
            document.addEventListener('click', (event) => {
                if (event.target.closest('.branch-search-icon')) {
                    const searchIcon = event.target.closest('.branch-search-icon');
                    InteractionManager.createRippleEffect(searchIcon, event);
                    
                    // Only trigger search functionality if not in story mode
                    if (currentStepIndex === -1) {
                        // Simulate search functionality for free play mode
                        const branch = searchIcon.closest('.branch-item');
                        if (branch) {
                            const textArea = branch.querySelector('.branch-text-area');
                            const searchText = textArea.textContent || textArea.innerText;
                            
                            if (searchText.trim()) {
                                // Show AI thinking in chat
                                InteractionManager.addChatMessage(`Let me search for the best options for "${searchText}". I'll analyze location data, reviews, and recommendations...`).then(() => {
                                    // Show results after AI thinking
                                    setTimeout(() => {
                                        InteractionManager.addChatMessage("I found some excellent options! Here are my top recommendations:").then(() => {
                                            InteractionManager.showResultsInChat(currentData.activityResults || []);
                                            SidebarManager.populateResults(currentData.activityResults || []);
                                        });
                                    }, 2000);
                                });
                            }
                        }
                    }
                }
            });
        },

        setupExportButtonHandlers: () => {
            // Add event delegation for export buttons
            document.addEventListener('click', (event) => {
                if (event.target.classList.contains('export-to-plan-button')) {
                    const button = event.target;
                    InteractionManager.animateExportButton(button);
                    
                    // Find the card and target branch for dragging animation
                    const card = button.closest('.result-card');
                    const targetBranch = document.querySelector('.branch-item:last-child .branch-card-slot');
                    
                    if (card && targetBranch) {
                        InteractionManager.animateCardDrag(card, targetBranch).then(() => {
                            // After animation, embed the card
                            const cardData = {
                                title: card.querySelector('.card-title').textContent,
                                description: card.querySelector('.card-description').textContent,
                                image: card.querySelector('.card-image').src,
                                extra: card.querySelector('.card-extra-info').textContent
                            };
                            
                            const branchId = document.querySelector('.branch-item:last-child').getAttribute('data-branch-id');
                            BranchManager.embedCard(branchId, cardData);
                        });
                    }
                }
            });
        },

        generateLLMResponse: (searchText) => {
            const responses = [
                `Analyzing "${searchText}" and finding the best options for you...`,
                `Let me search for recommendations related to "${searchText}"...`,
                `I'll help you find great options for "${searchText}". Let me check my database...`
            ];
            return responses[Math.floor(Math.random() * responses.length)];
        }
    };

    // --- Main Story Execution ---
    const executeStep = async (step) => {
        if (!step) return;

        // Hide any previous thought bubble before the next action (unless we're showing a thought bubble)
        if (step.action !== 'showThoughtBubble') {
            InteractionManager.hideThought();
        }

        // This is our main "switch" that will grow over time
        switch (step.action) {
            case 'narrate': // DEPRECATED, but keep for now
                Narration.update(step.text);
                break;

            case 'showThoughtBubble':
                InteractionManager.showThought(step.role, step.text, step.attachToSelector);
                // Add undo function
                undoStack.push(() => {
                    InteractionManager.hideThought();
                });
                break;

            case 'hideThoughtBubble':
                InteractionManager.hideThought();
                // Add undo function (to show it again)
                undoStack.push(() => {
                    // We can't perfectly restore the previous thought bubble state
                    // but we can add a placeholder undo function
                });
                break;

            case 'simulateUserClick':
                await InteractionManager.moveTo(step.targetSelector);
                await InteractionManager.click();
                
                // Add ripple effect to search icons
                const targetElement = DOMUtils.getElement(step.targetSelector);
                if (targetElement) {
                    if (targetElement.classList.contains('branch-search-icon')) {
                        InteractionManager.createRippleEffect(targetElement);
                    } else if (targetElement.classList.contains('export-to-plan-button')) {
                        InteractionManager.animateExportButton(targetElement);
                    }
                    targetElement.click();
                }
                
                // Add undo function
                undoStack.push(() => {
                    // The click effects are handled by other action undos
                });
                break;

            case 'showAiThinking':
                await InteractionManager.addChatMessage(step.text);
                // Add undo function
                undoStack.push(() => {
                    // Can't easily undo chat messages, but we can track this
                });
                break;

            case 'hideAiThinking':
                // No longer needed with chat-based UI
                undoStack.push(() => {
                    // No action needed for chat-based system
                });
                break;

            case 'wait':
                await new Promise(resolve => setTimeout(resolve, step.duration));
                // Add undo function
                undoStack.push(() => {
                    // No visual changes to undo for a wait action
                });
                break;

            case 'typeInElement':
                const elementToTypeIn = DOMUtils.getElement(step.targetSelector);
                const textToType = currentData[step.textKey];
                
                if (elementToTypeIn && textToType) {
                    DOMUtils.typeText(elementToTypeIn, textToType, 50, () => {
                        // This is the callback function that runs after typing is done
                        if (step.createsBranch) {
                            BranchManager.createBranch(step.branchId, textToType);
                        }
                    });
                    // Push undo function for typeInElement
                    undoStack.push(() => {
                        if (step.createsBranch) {
                            const branchToRemove = DOMUtils.getElement(`[data-branch-id="${step.branchId}"]`);
                            if (branchToRemove) branchToRemove.remove();
                        }
                        const initialPrompt = DOMUtils.getElement('#initial-plan-prompt');
                        if (initialPrompt) {
                            initialPrompt.style.display = 'block';
                            elementToTypeIn.textContent = '';
                        }
                    });
                }
                break;

            case 'showSidebarWithResults':
                const results = currentData[step.resultsDataKey];
                if (results) {
                    await InteractionManager.addChatMessage("I found some great options for your mountain getaway! Here are the best activities I discovered:");
                    InteractionManager.showResultsInChat(results);
                    SidebarManager.populateResults(results);
                    // Push undo function
                    undoStack.push(() => {
                        const sidebar = DOMUtils.getElement('#results-sidebar');
                        if (sidebar) {
                            sidebar.innerHTML = '<p class="no-results-message">Search results will appear here.</p>';
                            sidebar.style.display = 'none';
                        }
                    });
                }
                break;

            case 'embedCardInBranch':
                const cardData = currentData[step.cardDataKey];
                if (cardData) {
                    // Find source card and target slot for animation
                    const sourceCard = document.querySelector('#results-sidebar .result-card:first-child');
                    const targetBranch = DOMUtils.getElement(`[data-branch-id="${step.branchId}"]`);
                    const targetSlot = targetBranch ? targetBranch.querySelector('.branch-card-slot') : null;
                    
                    if (sourceCard && targetSlot) {
                        await InteractionManager.animateCardDrag(sourceCard, targetSlot);
                    }
                    
                    BranchManager.embedCard(step.branchId, cardData);
                    // Push undo function
                    undoStack.push(() => {
                        const branch = DOMUtils.getElement(`[data-branch-id="${step.branchId}"]`);
                        if (branch) {
                            const cardSlot = branch.querySelector('.branch-card-slot');
                            if (cardSlot) {
                                cardSlot.innerHTML = '';
                            }
                        }
                    });
                }
                break;

            case 'agentGenerateTemplate':
                const parentBranch = DOMUtils.getElement(`[data-branch-id="${step.targetBranchId}"]`);
                const templateData = currentData[step.templateDataKey];
                if (parentBranch && templateData) {
                    const generatedBranchIds = [];
                    
                    if (templateData.children) {
                        for (let i = 0; i < templateData.children.length; i++) {
                            const childNode = templateData.children[i];
                            const delay = i * 500; // Stagger the generation
                            await BranchManager.generateFromTemplateAnimated(parentBranch, childNode, step.targetBranchId, delay);
                            
                            const branchId = `${step.targetBranchId}.${childNode.id}`;
                            generatedBranchIds.push(branchId);
                            
                            // Collect sub-branch IDs for undo
                            const collectSubBranchIds = (node, parentId) => {
                                if (node.children) {
                                    node.children.forEach(subNode => {
                                        const subBranchId = `${parentId}.${subNode.id}`;
                                        generatedBranchIds.push(subBranchId);
                                        collectSubBranchIds(subNode, subBranchId);
                                    });
                                }
                            };
                            collectSubBranchIds(childNode, branchId);
                        }
                        
                        // Push undo function for all generated branches
                        undoStack.push(() => {
                            generatedBranchIds.forEach(branchId => {
                                const branchToRemove = DOMUtils.getElement(`[data-branch-id="${branchId}"]`);
                                if (branchToRemove) branchToRemove.remove();
                            });
                        });
                    }
                }
                break;

            case 'showConfirmationDialog':
                const userConfirmed = await InteractionManager.showChatConfirmation(step.message);
                // Store the confirmation result for potential use in next steps
                currentData.lastConfirmation = userConfirmed;
                if (userConfirmed) {
                    await InteractionManager.addChatMessage("Perfect! Let me generate a detailed template for your mountain getaway plan.", false);
                } else {
                    await InteractionManager.addChatMessage("No problem! Your current plan looks great as is.", false);
                }
                undoStack.push(() => {
                    delete currentData.lastConfirmation;
                });
                break;

            case 'showTemplateGenerationEffect':
                await InteractionManager.addChatMessage("I'm analyzing your plan structure and generating comprehensive sub-branches with activities, logistics, and timing details...");
                undoStack.push(() => {
                    // No specific undo needed for chat messages
                });
                break;

            default:
                console.warn("Unknown action:", step.action);
        }
    };

    const nextStep = async () => {
        if (currentStepIndex < currentStory.steps.length - 1) {
            // Disable next button while step is processing
            const nextButton = DOMUtils.getElement('#next-step-button');
            if (nextButton) nextButton.disabled = true;

            currentStepIndex++;
            const step = currentStory.steps[currentStepIndex];
            console.log(`Executing step ${currentStepIndex + 1}:`, step.action);
            await executeStep(step); // Use await here
            
            ButtonStateManager.updateButtons(); // Update states
            if (nextButton) nextButton.disabled = false; // Re-enable
        } else {
            Narration.update("End of the demo. Click 'Restart' to watch again.");
            console.log("End of story.");
            ButtonStateManager.updateButtons(); // Update button states after each step
        }
    };
    
    const prevStep = () => {
        if (currentStepIndex >= 0) {
            // Pop and execute the last undo function
            const undoAction = undoStack.pop();
            if (undoAction) {
                undoAction();
            }

            currentStepIndex--;
            
            // Update narration to the new current step's text
            if (currentStepIndex >= 0) {
                const step = currentStory.steps[currentStepIndex];
                if (step && step.action === 'narrate') {
                    Narration.update(step.text);
                } else {
                    Narration.update(`(Step ${currentStepIndex + 1} completed)`);
                }
            } else {
                Narration.update("Welcome! Click 'Next Step' to begin the demo.");
            }
            
            ButtonStateManager.updateButtons();
        }
    };
    
    const restart = () => {
        // Reset state
        currentStepIndex = -1;
        undoStack = [];
        
        // Clear UI
        const sidebar = DOMUtils.getElement('#results-sidebar');
        if (sidebar) {
            sidebar.innerHTML = '<div class="no-results-message">Search results will appear here.</div>';
            sidebar.style.display = 'none';
        }
        
        const branchContainer = DOMUtils.getElement('#branch-container');
        if (branchContainer) {
            branchContainer.innerHTML = '<div id="initial-plan-prompt" class="branch-item-placeholder">What are you planning?</div>';
        }
        
        // Reset chat messages to initial state
        const chatMessages = DOMUtils.getElement('#chat-messages');
        if (chatMessages) {
            chatMessages.innerHTML = `
                <div class="chat-message ai-message">
                    <div class="message-content">
                        Hello! I'm here to help you plan your perfect getaway. What would you like to plan today?
                    </div>
                </div>
            `;
        }
        
        // Reset InteractionManager elements
        InteractionManager.hideThought();
        InteractionManager.hideCursor();
        
        // Reset narration
        Narration.update("Welcome! Click 'Next Step' to begin the demo.");
        
        // Update button states
        ButtonStateManager.updateButtons();
        
        console.log("Story restarted");
    };

    const init = (story, data) => {
        currentStory = story;
        currentData = data;
        currentStepIndex = -1;
        undoStack = [];
        console.log(`Engine initialized with story: ${story.title}`);
        
        // Setup event handlers
        EventHandlers.setupSearchIconHandlers();
        EventHandlers.setupExportButtonHandlers();
        
        // Setup narrator buttons
        DOMUtils.getElement('#next-step-button')?.addEventListener('click', nextStep);
        DOMUtils.getElement('#prev-step-button')?.addEventListener('click', prevStep);
        DOMUtils.getElement('#restart-story-button')?.addEventListener('click', restart);
        
        Narration.update("Welcome! Click 'Next Step' to begin the demo.");
        ButtonStateManager.updateButtons();
    };

    return {
        init,
        nextStep,
        prevStep,
        restart
    };
})();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (typeof sampleStory !== 'undefined' && typeof sampleData !== 'undefined') {
        StoryEngine.init(sampleStory, sampleData);
    } else {
        console.error("Story data not found. Make sure sample-story.js and sample-data.js are loaded.");
    }
});
