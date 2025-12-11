# LeetCode Mentor – AI Coding Assistant (Chrome Extension)

LeetCode Mentor is a Chrome Extension that injects an AI coding assistant directly into the LeetCode interface. It extracts the problem title, reads your code from the editor, tracks chat history, and sends everything to a deployed backend that uses the OpenRouter DeepSeek model to generate structured, helpful responses.

---

## Features

### Chrome Extension
- Floating AI chat panel embedded inside LeetCode
- Draggable and minimizable UI
- Fully scrollable conversation window
- Automatically extracts:
  - Problem title
  - Code from LeetCode editor
  - Chat history
- Stores API key locally using Chrome Storage

### AI Mentor Capabilities
If user code is detected, the mentor also:
- Explains what the code does
- Finds bugs and logical mistakes
- Suggests improvements and optimizations
- Provides time and space complexity
- Gives possible edge cases

### Backend (Already Deployed)
- You **do not** need to run anything locally

## Project Structure

```

project/
│
├── utils/
│   └── mentorPrompt.js
│
├── server.js      
│
├── extension/
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   └── manifest.json
│
└── README.md

```

---

## Chrome Extension Setup

1. Open Chrome and visit:
```

chrome://extensions

```
2. Enable **Developer Mode**
3. Click **Load Unpacked**
4. Select the `extension/` folder
5. Open the extension popup and enter your **OpenRouter DeepSeek API Key**

You can refer Demo Video.

## Future Improvements

* Allow switching between multiple AI models
* Syntax highlighting for AI-generated code
* Export chat as Markdown
* Save chats locally
* Light/dark mode theme

## Contributing
Feel free to contribute!  
Pull requests, ideas, and improvements are always welcome.

