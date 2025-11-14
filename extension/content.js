chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (msg.type === "AI_EXPLAIN_REQUEST") {
        showPopup("Thinking... ✨");

        const explanation = await getAIExplanation(msg.code);
        updatePopup(explanation);
    }
});

// Fetch AI result
async function getAIExplanation(codeSnippet) {
    try {
        const response = await fetch("http://localhost:3000/api/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt: `Explain this code:\n${codeSnippet}` })
        });

        const data = await response.json();
        return data.output || "No response from AI.";
    } catch (e) {
        return "❌ Error: Unable to connect to AI backend.";
    }
}

// GLOBAL popup instance
let popupDiv = null;

// Show popup
function showPopup(initialText) {
    if (popupDiv) popupDiv.remove();

    popupDiv = document.createElement("div");
    popupDiv.id = "aiExplainPopup";

    popupDiv.innerHTML = `
        <div class="ai-header">
            <span>AI Coding Companion 💙</span>
            <button id="aiCloseBtn">✖</button>
        </div>
        <div id="aiContent">${initialText}</div>
    `;

    document.body.appendChild(popupDiv);

    document.getElementById("aiCloseBtn").onclick = () => popupDiv.remove();

    injectStyles();
}

// Update popup with response
function updatePopup(text) {
    const content = document.getElementById("aiContent");
    if (content) {
        content.textContent = text;
    }
}

function injectFloatingStyles() {
    if (document.getElementById("aiFloatingStyles")) return;

    const style = document.createElement("style");
    style.id = "aiFloatingStyles";

    style.textContent = `
        #ai-floating-btn {
            position: fixed;
            bottom: 28px;
            right: 28px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #2f7dff, #7fc9ff);
            color: #fff;
            font-size: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            border-radius: 50%;
            box-shadow: 0 8px 22px rgba(0,0,0,0.25);
            z-index: 99999999;
            transition: 0.25s ease;
            user-select: none;
        }

        #ai-floating-btn:hover {
            transform: scale(1.12);
            box-shadow: 0 12px 26px rgba(0,0,0,0.30);
        }
    `;

    document.head.appendChild(style);
}

// window.addEventListener("message", (event) => {
//     if (event.data && event.data.type === "OPEN_POPUP_REQUEST") {
//         chrome.runtime.sendMessage({ type: "OPEN_POPUP" });
//     }
// });

(function createFloatingButton() {
    if (document.getElementById("ai-floating-btn")) return;

    const btn = document.createElement("div");
    btn.id = "ai-floating-btn";
    btn.innerHTML = "💬";

    // CLICK HANDLER
    btn.onclick = () => {
        chrome.runtime.sendMessage({ type: "OPEN_POPUP" });
    };

    // Append button OUTSIDE the onclick
    document.body.appendChild(btn);

    // Load style
    injectFloatingStyles();
})();




