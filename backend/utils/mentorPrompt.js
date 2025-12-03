function buildPrompt({ title, code, message }) {
  return `
You are an expert programming mentor. Analyze this LeetCode solution.

Problem: ${title}

Student Code:
${code}

User Question:
${message}

Tasks:
1. Explain what the code tries to do.
2. Identify bugs or failing test cases.
3. Suggest improvements.
4. Provide time & space complexity.
5. Give 3 edge cases to test.

Keep it short but useful.
`;
}

module.exports = { buildPrompt };
