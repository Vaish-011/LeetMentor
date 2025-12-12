chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  if (req.action === "CHATBOT") {
    // Use async IIFE to safely handle async/await
    (async () => {
      try {
        const data = await new Promise(resolve => chrome.storage.local.get("gemini_api_key", resolve));

        if (!data.gemini_api_key) {
          sendResponse({ answer: "❌ No API key found. Please add it from extension popup." });
          return;
        }

        const result = await fetch("https://leetmentor.onrender.com/chat", {
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
    })();

    return true; // IMPORTANT: Keeps the message channel open for async response
  }
});
