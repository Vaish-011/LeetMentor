chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.action === "CHATBOT") {
    
    chrome.storage.local.get("gemini_api_key", async (data) => {

      if (!data.gemini_api_key) {
        sendResponse({ answer: "❌ No API key found. Please add it from extension popup." });
        return;
      }

      try {
        const result = await fetch("http://localhost:3000/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: req.payload.title,
            code: req.payload.code,
            message: req.payload.message,
            history: req.payload.history,
            apiKey: data.gemini_api_key
          })
        });

        const json = await result.json();
        sendResponse(json);

      } catch (err) {
        sendResponse({ answer: "Backend error: " + err.message });
      }
    });

    return true; // KEEP CHANNEL OPEN
  }
});
