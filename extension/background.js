chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "explainWithAI",
        title: "Explain with AI",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "explainWithAI") {

        // Block restricted chrome:// pages
        if (!tab || !tab.url || !tab.url.startsWith("http")) {
            chrome.notifications.create({
                type: "basic",
                iconUrl: "icon.png",
                title: "AI Coding Companion",
                message: "Explain with AI works only on normal web pages."
            });
            return;
        }

        // Send message to content script
        chrome.tabs.sendMessage(
            tab.id,
            {
                type: "AI_EXPLAIN_REQUEST",
                code: info.selectionText
            },
            (response) => {
                if (chrome.runtime.lastError) {
                    console.warn("Content script not responding:", chrome.runtime.lastError.message);

                    // Auto-inject content.js if it's missing
                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        files: ["content.js"]
                    }, () => {
                        // Retry sending message after injection
                        chrome.tabs.sendMessage(tab.id, {
                            type: "AI_EXPLAIN_REQUEST",
                            code: info.selectionText
                        });
                    });
                }
            }
        );
    }
});

// Handles the floating button triggering popup
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === "OPEN_POPUP") {
        chrome.action.openPopup();
    }
});
