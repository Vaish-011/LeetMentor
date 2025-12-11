const express = require("express");
const cors = require("cors");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const bodyParser = require("body-parser");
const axios = require("axios");
const { buildPrompt } = require("./utils/mentorPrompt");
require("dotenv").config();

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
    try {
        const { title, code, message, history, apiKey } = req.body;

        if (!apiKey) return res.json({ answer: "❌ Missing API Key!" });

        const prompt = buildPrompt({ title, code, message });
        const chatHistory = Array.isArray(history) ? history : [];

        const payload = {
            model: "deepseek/deepseek-chat",
            messages: [
                ...chatHistory.map(m => ({
                    role: m.role === "bot" ? "assistant" : m.role,
                    content: m.content
                })),
                { role: "user", content: prompt }
            ]
        };

        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            payload,
            {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${apiKey}`,
                    "HTTP-Referer": "https://leetmentor.onrender.com",
                    "X-Title": "LeetCode Mentor"
                }
            }
        );

        let answer = response.data.choices?.[0]?.message?.content || "No response";

        answer = formatResponse(answer);

        res.json({ answer });

    } catch (err) {
        console.error("ERROR:", err.response?.data || err.message);
        res.json({ answer: "Server error: " + (err.response?.data?.error?.message || err.message) });
    }
});



// -------------------------------------------
// 🛠️ FORMATTER FUNCTION (very important)
// -------------------------------------------
function formatResponse(text) {
    if (!text) return text;

    return text
        // Remove markdown headings (###, ##, #)
        .replace(/^#+\s*/gm, "")

        // Remove bullet points (* , -, •)
        .replace(/^\s*[-*•]\s*/gm, "")

        // Remove numbered lists (1., 2., etc)
        .replace(/^\s*\d+\.\s*/gm, "")

        // Replace multiple newlines with one
        .replace(/\n{2,}/g, "\n\n")

        // Trim spaces
        .trim();
}


app.listen(3000, () => console.log("Backend running on port 3000"));
