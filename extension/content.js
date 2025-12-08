let chatHistory = [];

function createMentorPanel() {
    if (document.getElementById("mentor-box")) return;

    const box = document.createElement("div");
    box.id = "mentor-box";
    box.innerHTML = `
        <div id="mentor-header">LeetCode Mentor Chat</div>
        <div id="mentor-output"></div>
        <textarea id="mentor-input" placeholder="Ask anything..."></textarea>
        <button id="mentor-send">Send</button>
    `;
    document.body.appendChild(box);

    document.getElementById("mentor-send").addEventListener("click", sendMessage);
}

async function sendMessage() {
    const input = document.getElementById("mentor-input");
    const output = document.getElementById("mentor-output");

    const msg = input.value.trim();
    if (!msg) return;

    appendMessage(output, msg, "user");
    input.value = "";

    chatHistory.push({ role: "user", content: msg });

    // Always grab problem title and code
    const title = document.querySelector(".css-v3d350 h1")?.innerText || "Unknown Problem";
    const codeLines = document.querySelectorAll(".view-line");
    const code = codeLines.length > 0 
        ? Array.from(codeLines).map(line => line.innerText).join("\n") 
        : "// Code not detected";

    // Send title, code, and message to background
    if (chrome.runtime && chrome.runtime.sendMessage) {
        chrome.runtime.sendMessage(
            {
                action: "CHATBOT",
                payload: { title, code, message: msg, history: chatHistory }
            },
            (response) => {
                let reply = response?.answer || "No response";
                reply = reply.replace(/\*\*/g, "");
                appendMessage(output, reply, "bot");
                chatHistory.push({ role: "bot", content: reply });
            }
        );
    } else {
        console.error("chrome.runtime.sendMessage is undefined");
    }
}

// Helper to append messages in a styled way
function appendMessage(container, text, sender) {
    const msgDiv = document.createElement("div");
    msgDiv.className = sender === "user" ? "user-msg" : "bot-msg";

    // Split into lines and create paragraphs
    const lines = text.split(/\n+/).filter(l => l.trim() !== "");
    lines.forEach(line => {
        const p = document.createElement("p");
        p.textContent = line.trim();
        msgDiv.appendChild(p);
    });

    container.appendChild(msgDiv);
    container.scrollTop = container.scrollHeight;
}

async function askMentor(title, code) {
  const apiKey = document.getElementById("api-key-input").value;

  if (!apiKey) {
    alert("Please enter your Gemini API key!");
    return;
  }

  const res = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      code,
      apiKey
    })
  });

  const data = await res.json();
  return data.answer;
}


// Initialize the mentor panel after page loads
window.addEventListener("load", () => {
    setTimeout(createMentorPanel, 2000);
});

