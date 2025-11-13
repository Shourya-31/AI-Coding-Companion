chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (msg.type === "AI_EXPLAIN_REQUEST") {
        const codeSnippet = msg.code;

        const explanation = await getAIExplanation(codeSnippet);
        showPopup(explanation);
    }
});

async function getAIExplanation(codeSnippet) {
    const response = await fetch("http://localhost:3000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: `Explain this code:\n${codeSnippet}` })
    });

    const data = await response.json();
    return data.output || "No response from AI";
}

function showPopup(text) {
    const bubble = document.createElement("div");
    bubble.style.position = "fixed";
    bubble.style.bottom = "20px";
    bubble.style.right = "20px";
    bubble.style.maxWidth = "300px";
    bubble.style.background = "#161b22";
    bubble.style.color = "#c9d1d9";
    bubble.style.border = "1px solid #30363d";
    bubble.style.padding = "12px";
    bubble.style.borderRadius = "8px";
    bubble.style.zIndex = "999999";
    bubble.style.fontSize = "14px";
    bubble.style.fontFamily = "Segoe UI, Roboto";

    bubble.textContent = text;

    document.body.appendChild(bubble);

    setTimeout(() => bubble.remove(), 12000);
}
