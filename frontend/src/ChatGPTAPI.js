// ChatGPTAPI.js
// This class handles calls to the OpenAI ChatGPT API for task refinement and prioritization.
// It is designed to be used in a React app for transforming user-entered tasks into Brian Tracy-style goals with priorities.

/**
 * Usage:
 * import ChatGPTAPI from './ChatGPTAPI';
 * const api = new ChatGPTAPI('YOUR_OPENAI_API_KEY');
 * const result = await api.refineTasks(tasksArray);
 */

class ChatGPTAPI {
  /**
   * @param {string} apiKey - Your OpenAI API key.
   */
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = 'https://api.openai.com/v1/chat/completions';
  }

  /**
   * Calls the OpenAI API to refine and prioritize tasks.
   * @param {Array<string>} tasks - The list of user-entered tasks.
   * @returns {Promise<Array<{text: string, priority: number, original: string}>>}
   */
  async refineTasks(tasks) {
    // Compose the prompt for ChatGPT
    const prompt = `You are an expert productivity coach.\n\nGiven this list of tasks:\n${tasks.map((t, i) => `${i + 1}. ${t}`).join('\n')}\n\nFor each task, do ALL of the following:\n- Assign a priority from 1 (highest) to 10 (lowest) based on urgency and importance.\n- Rewrite the task as if it is already accomplished, using Brian Tracy's goal-setting rules: present tense, emotionally charged verbs, and as if the goal is already achieved.\n- Make the original task past tense.\n\nReturn a JSON array of objects, each with:\n- 'text': the Brian Tracy style goal statement\n- 'priority': the assigned priority (1-10)\n- 'original': the original task, rewritten in past tense.\n\nExample output:\n[{"text": "I have confidently achieved...", "priority": 2, "original": "Completed the report."}]`;

    const body = {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 512
    };

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    const data = await response.json();
    // Extract the JSON array from the response
    const content = data.choices[0].message.content;
    try {
      // Try to parse the JSON array from the response
      const result = JSON.parse(content);
      return result;
    } catch (e) {
      // If parsing fails, try to extract JSON from the text
      const match = content.match(/\[.*\]/s);
      if (match) {
        return JSON.parse(match[0]);
      }
      throw new Error('Failed to parse AI response: ' + content);
    }
  }
}

export default ChatGPTAPI;
