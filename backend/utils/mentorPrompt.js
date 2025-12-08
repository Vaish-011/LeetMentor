function buildPrompt({ title, code }) {
  return `
You are an expert coding mentor.

Problem: ${title}

Student Code:
${code}

Tasks:
1. Explain what the code tries to do.
2. Find bugs.
3. Suggest improvements.
4. Time & space complexity.
5. 3 edge cases to test.

Be clear and concise.
`;
}

module.exports = { buildPrompt };
