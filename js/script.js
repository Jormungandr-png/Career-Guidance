function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

async function sendMessage() {
  const input = document.getElementById("chatInput");
  const messages = document.getElementById("chatMessages");
  const userMessage = input.value.trim();
  if (!userMessage) return;

  // Disable input and button during fetch
  input.disabled = true;
  const sendBtn = input.nextElementSibling; // assuming button next to input
  if (sendBtn) sendBtn.disabled = true;

  // Append user message
  messages.insertAdjacentHTML(
    "beforeend",
    `<p><strong>You:</strong> ${escapeHtml(userMessage)}</p>`
  );
  messages.scrollTop = messages.scrollHeight;
  input.value = "";

  // Append AI typing indicator
  messages.insertAdjacentHTML("beforeend", `<p id="typing-indicator"><em>AI is typing...</em></p>`);
  messages.scrollTop = messages.scrollHeight;

  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await response.json();

    // Remove typing indicator
    const typingElem = document.getElementById("typing-indicator");
    if (typingElem) typingElem.remove();

    if (data.reply) {
      messages.insertAdjacentHTML(
        "beforeend",
        `<p><strong>AI:</strong> ${escapeHtml(data.reply)}</p>`
      );
    } else if (data.error) {
      messages.insertAdjacentHTML(
        "beforeend",
        `<p><strong>AI:</strong> Error: ${escapeHtml(data.error)}</p>`
      );
    } else {
      messages.insertAdjacentHTML(
        "beforeend",
        `<p><strong>AI:</strong> No response received.</p>`
      );
    }
    messages.scrollTop = messages.scrollHeight;
  } catch (error) {
    const typingElem = document.getElementById("typing-indicator");
    if (typingElem) typingElem.remove();

    messages.insertAdjacentHTML(
      "beforeend",
      `<p><strong>AI:</strong> Network error: ${escapeHtml(error.message)}</p>`
    );
    messages.scrollTop = messages.scrollHeight;
  } finally {
    input.disabled = false;
    if (sendBtn) sendBtn.disabled = false;
    input.focus();
  }
}
