window.addEventListener("message", async (event) => {
    if (event.source !== window) return;
    if (event.data.type === "AI_EXPLAIN_REQUEST") {
        const codeSnippet =  event.data.code;

        // calling AI endpoint <3
        const explanation = await getAIExplanation(codeSnippet);

        // floating pop up <3
        showPopup(explanation);

    }
});

async function getAIExplanation(codeSnippet) {
    const response = await fetch()
}