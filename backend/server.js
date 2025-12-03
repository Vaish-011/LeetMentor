require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const { GoogleGenerativeAI } = require("@google/generative-ai");
const { buildPrompt } = require("./utils/mentorPrompt");

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;
const GEMINI_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_KEY) {
    console.error("Error: GEMINI_API_KEY is not set in .env file");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(GEMINI_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

app.post("/chat", async (req, res) => {
    try {
        const { title, code, message, history = [] } = req.body;

        if (!title || !code || !message) {
            return res.status(400).json({ answer: "Title, code, or message missing." });
        }

        const historyFormatted = history.map(m => ({
            role: m.role === "user" ? "user" : "model",
            parts: [{ text: m.content }]
        }));

        const prompt = buildPrompt({ title, code, message });

        const result = await model.generateContent({
            contents: [
                ...historyFormatted,
                { role: "user", parts: [{ text: prompt }] }
            ]
        });

        let answer;
        try {
            answer = result.response?.text?.();
            if (!answer) answer = "No response from AI.";
        } catch {
            answer = "Failed to parse AI response.";
        }

        res.json({ answer });

    } catch (err) {
        console.error("CHAT ERROR:", err);
        res.status(500).json({ answer: "Server error: " + (err.message || "") });
    }
});

app.listen(PORT, () => {
    console.log(`Chatbot backend running on port ${PORT}`);
});
