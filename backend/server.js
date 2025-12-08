const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const bodyParser = require("body-parser");
const { buildPrompt } = require("./utils/mentorPrompt");

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
    try {
        const { title, code, message, history, apiKey } = req.body;

        if (!apiKey) {
            return res.json({ answer: "❌ Missing API Key!" });
        }

        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = buildPrompt({ title, code, message });

        // Ensure history is an array
        const chatHistory = Array.isArray(history) ? history : [];

        const result = await model.generateContent({
            contents: [
                ...chatHistory.map(m => ({
                    role: m.role,
                    parts: [{ text: m.content }]
                })),
                { role: "user", parts: [{ text: prompt }] }
            ]
        });

        const answer = result.response?.text?.() || "No response";
        res.json({ answer });

    } catch (err) {
        console.error("ERROR:", err);
        res.json({ answer: "Server error: " + err.message });
    }
});

app.listen(3000, () => console.log("Backend running on port 3000"));
