function buildPrompt({ title, code, message, history }) {
  const historyText = Array.isArray(history)
    ? history.map(h => `${h.role.toUpperCase()}: ${h.content}`).join("\n")
    : "";

  return `
You are an expert coding mentor.  
Your FIRST priority is to answer the user's question directly and clearly.  
After answering the question, if the message includes code or the user is asking for coding help, then ALSO perform the analysis tasks.

---------------------------
Conversation History:
${historyText}

---------------------------
User Message:
${message}

---------------------------
Problem Title (if any):
${title || "Not provided"}

---------------------------
Student Code (if provided):
${code || "No code given"}

---------------------------

If code is present, also perform these tasks:
1. Explain what the code tries to do.
2. Find bugs.
3. Suggest improvements.
4. State time & space complexity.
5. Provide 3 edge cases.

Be clear, concise, and helpful.
`;
}

module.exports = { buildPrompt };
