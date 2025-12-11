let chatHistory = [];
let isMinimized = false;

function createMentorPanel() {
    if (document.getElementById("mentor-box")) return;

    const box = document.createElement("div");
    box.id = "mentor-box";

    box.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 350px;
        height: 520px;
        display: flex;
        flex-direction: column;
        background: #1e1e2f;    
        border-radius: 18px;
        border: 1px solid #2c2c3c;
        box-shadow: 0 8px 28px rgba(0,0,0,0.6);
        font-family: 'Inter', Arial, sans-serif;
        z-index: 999999999;
        overflow: hidden;
        color: #ddd;
    `;

    box.innerHTML = `
        <!-- HEADER -->
        <div id="mentor-header" 
            style="
                background: #2c2c3c;
                padding: 12px 16px;
                font-size: 15px;
                font-weight: 600;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: grab;
                border-bottom: 1px solid #3a3a4a;
            ">
            <span>LeetCode Mentor</span>
            <button id="mentor-toggle" 
                style="
                    background: #3a3a4a;
                    border: none;
                    padding: 4px 10px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    color: #ddd;
                ">—</button>
        </div>

        <!-- CHAT CONTENT -->
        <div id="mentor-body" style="flex: 1; display: flex; flex-direction: column; overflow: hidden;">

            <div id="mentor-output" style="
                flex: 1;
                padding: 12px;
                overflow-y: auto;   
                font-size: 14px;
                display: flex;
                flex-direction: column;
                gap: 6px;
                scrollbar-width: thin;
            "></div>

            <!-- INPUT SECTION -->
            <div style="
                padding: 10px 12px;
                background: #2c2c3c;
                border-top: 1px solid #3a3a4a;
                display: flex;
                flex-direction: column;
            ">
                <textarea id="mentor-input" placeholder="Ask anything..." 
                    style="
                        width: 100%;
                        height: 70px;
                        border-radius: 12px;
                        border: 1px solid #444;
                        padding: 10px;
                        font-size: 14px;
                        outline: none;
                        resize: none;
                        background: #1e1e2f;
                        color: #ddd;
                        margin-bottom: 6px;
                        overflow-y: auto;
                    ">
                </textarea>

                <button id="mentor-send" style="
                    width: 100%;
                    padding: 10px;
                    background: #4b73ff;
                    border: none;
                    color: white;
                    border-radius: 10px;
                    cursor: pointer;
                    font-size: 14px;
                ">Send</button>
            </div>
        </div>
    `;

    document.body.appendChild(box);

    document.getElementById("mentor-send").addEventListener("click", sendMessage);
    document.getElementById("mentor-toggle").addEventListener("click", toggleMinimize);

    makeDraggable(box, document.getElementById("mentor-header"));
}


function makeDraggable(box, header) {
    let isDown = false, offsetX = 0, offsetY = 0;

    header.addEventListener("mousedown", e => {
        isDown = true;
        offsetX = box.offsetLeft - e.clientX;
        offsetY = box.offsetTop - e.clientY;
        header.style.cursor = "grabbing";
    });

    document.addEventListener("mouseup", () => {
        isDown = false;
        header.style.cursor = "grab";
    });

    document.addEventListener("mousemove", e => {
        if (!isDown) return;
        box.style.left = (e.clientX + offsetX) + "px";
        box.style.top = (e.clientY + offsetY) + "px";
    });
}


function toggleMinimize() {
    const body = document.getElementById("mentor-body");
    const toggleBtn = document.getElementById("mentor-toggle");
    const box = document.getElementById("mentor-box");

    if (!isMinimized) {
        body.style.display = "none";
        box.style.height = "48px";
        toggleBtn.textContent = "▢";
    } else {
        body.style.display = "flex";
        box.style.height = "520px";
        toggleBtn.textContent = "—";
    }
    isMinimized = !isMinimized;
}

async function sendMessage() {
    const input = document.getElementById("mentor-input");
    const output = document.getElementById("mentor-output");

    const msg = input.value.trim();
    if (!msg) return;

    appendMessage(output, msg, "user");
    input.value = "";

    chatHistory.push({ role: "user", content: msg });

    const title = document.querySelector(".css-v3d350 h1")?.innerText || "Unknown Problem";
    const codeLines = document.querySelectorAll(".view-line");
    const code = codeLines.length > 0 ? 
        Array.from(codeLines).map(l => l.innerText).join("\n") :
        "// Code not detected";

    chrome.runtime.sendMessage(
        { action: "CHATBOT", payload: { title, code, message: msg, history: chatHistory } },
        (response) => {
            let reply = response?.answer || "No response";
            reply = reply.replace(/\*\*/g, "");
            appendMessage(output, reply, "bot");
            chatHistory.push({ role: "bot", content: reply });
        }
    );
}

function appendMessage(container, text, sender) {
    const msg = document.createElement("div");

    msg.style.cssText = `
        max-width: 85%;
        padding: 10px 14px;
        margin: 6px 0;
        border-radius: 14px;
        line-height: 1.4;
        white-space: pre-wrap;
        word-break: break-word;
        color: #fff;
        ${sender === "user" ? 
            "background: #4b73ff; margin-left:auto;" : 
            "background: #7b42ff; margin-right:auto;"}
    `;

    msg.textContent = text;
    container.appendChild(msg);

    container.scrollTop = container.scrollHeight;
}

window.addEventListener("load", () => {
    setTimeout(createMentorPanel, 1500);
});
