document.getElementById("send").addEventListener("click", async () => {
  const query = document.getElementById("query").value;
  const resBox = document.getElementById("response");

  resBox.textContent = "Thinking...";

  try {
    const response = await fetch("https://ai-coding-companion.onrender.com/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: query })
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();
    resBox.textContent = data.reply || "No response from AI.";
  } catch (error) {
    console.error(error);
    resBox.textContent = "Error connecting to server.";
  }
});