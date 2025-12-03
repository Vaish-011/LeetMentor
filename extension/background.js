chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
    if (req.action === "CHATBOT") {
        fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(req.payload)
        })
        .then(res => res.json())
        .then(data => sendResponse({ answer: data.answer }))
        .catch(err => sendResponse({ answer: "Backend error: " + err.message }));

        return true; // Keep the messaging channel open for async response
    }
});
