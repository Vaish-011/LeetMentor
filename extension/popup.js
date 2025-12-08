document.getElementById("save-key").onclick = () => {
  const key = document.getElementById("api-key-input").value.trim();

  chrome.storage.local.set({ gemini_api_key: key }, () => {
    document.getElementById("status").innerText = "API Key Saved!";
  });
};

document.getElementById("delete-key").onclick = () => {
  chrome.storage.local.remove("gemini_api_key", () => {
    document.getElementById("status").innerText = "API Key Removed!";
  });
};
