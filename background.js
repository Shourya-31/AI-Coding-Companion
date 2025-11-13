chrome.runtime.OnInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "explainWithAI",
        title: "Explain with AI",
        contexts: ["selection"]
    });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "explainWithAI") {
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: sendCodeToContentScript,
            args: [info.selectionText]
        });
    }
});

function sendCodeToContentScript(selectedCode) {
    window.postMessage({ type: "AI_EXPLAIN_REQUEST", code: selectedCode });
}