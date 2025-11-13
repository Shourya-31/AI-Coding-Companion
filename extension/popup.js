const queryInput = document.getElementById("query");
const sendBtn = document.getElementById("send");
const responseContainer = document.createElement("div");
responseContainer.id = "responseContainer";
document.body.appendChild(responseContainer);

// Typewriter animation for AI response
function typeWriter(element, text, speed = 12) {
  element.textContent = "";
  let i = 0;
  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      requestAnimationFrame(typing);
    }
  }
  typing();
}

// Show animated loading dots
function showLoader() {
  responseContainer.innerHTML = `<div class="loading">Thinking...</div>`;
}

// Fetch AI response
async function sendQuery() {
  const query = queryInput.value.trim();
  if (!query) return;

  showLoader();

  try {
    const response = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: query })
    });

    const data = await response.json();
    const text = data.output || "No response from AI.";

    const pre = document.createElement("pre");
    responseContainer.innerHTML = "";
    responseContainer.style.display = "block";

    responseContainer.appendChild(pre);

    // Typewriter animation
    typeWriter(pre, text);

    // Auto-scroll to bottom for long answers
    setTimeout(() => {
      responseContainer.scrollTop = responseContainer.scrollHeight;
    }, 100);

  } catch (err) {
    responseContainer.innerHTML = `<pre>Error connecting to server.</pre>`;
  }
}

// Button click
sendBtn.addEventListener("click", sendQuery);

// Press Enter to send
queryInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendQuery();
  }
});

queryInput.addEventListener("input", () => {
  queryInput.style.height = "auto";
  queryInput.style.height = queryInput.scrollHeight + "px";
});
