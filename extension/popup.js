document.getElementById("send").addEventListener("click", async () => {
  const query = document.getElementById("query").value;
  const resBox = document.getElementById("response");

  resBox.textContent = "Thinking...";

  try {
    const response = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: query })
    });

    const data = await response.json();
    resBox.textContent = data.output || "No response from AI.";
  } catch (error) {
    resBox.textContent = "Error connecting to server.";
  }
});