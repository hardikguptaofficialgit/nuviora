// This file would contain the actual implementation of the chat service
// using the GitHub AI model in a production environment

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatCompletionRequest {
  messages: ChatMessage[];
  temperature: number;
  top_p: number;
  model: string;
}

interface ChatCompletionResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: {
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

// In a real production environment, you would use environment variables
// and proper secret management for the token
const GITHUB_TOKEN = "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"; // This is a placeholder token
const ENDPOINT = "https://models.github.ai/inference";
const MODEL = "openai/gpt-4.1";

export async function getChatCompletion(messages: ChatMessage[]): Promise<string> {
  try {
    const response = await fetch(`${ENDPOINT}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${GITHUB_TOKEN}`
      },
      body: JSON.stringify({
        messages,
        temperature: 0.7,
        top_p: 1,
        model: MODEL
      } as ChatCompletionRequest)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data: ChatCompletionResponse = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error('Error in chat completion:', error);
    throw error;
  }
}

// Fallback implementation if the API is not available
export async function getFallbackChatCompletion(messages: ChatMessage[]): Promise<string> {
  console.warn('Using fallback chat completion as API is unavailable');
  await new Promise(resolve => setTimeout(resolve, 500));
  return "I'm sorry, I'm currently unable to connect to the health AI service. Please try again later.";
}

// Health-focused system prompt for the AI
const HEALTH_SYSTEM_PROMPT = `You are NuviOra's AI health assistant, an advanced AI integrated into a health monitoring application. 

Your capabilities:
- Analyze user health data from wearable devices
- Provide personalized health insights and recommendations
- Interpret biometric patterns including heart rate, sleep quality, and activity levels
- Suggest evidence-based lifestyle improvements
- Answer questions about nutrition, exercise, and wellness

When responding to users:
- Be conversational but professional
- Provide specific, actionable advice when possible
- Always prioritize user health and wellbeing
- Acknowledge when certain recommendations would require professional medical consultation
- Reference health metrics when relevant (e.g., "Your recent sleep data shows...")

Important: You have access to the user's health data from their NuviOra Watch X2 device, including heart rate (average 68 BPM), sleep patterns (7.2 hours/night with 15% deep sleep), and daily steps (average 8,500).`;

// Add the system prompt to the beginning of the messages array if not already present
function ensureSystemPrompt(messages: ChatMessage[]): ChatMessage[] {
  // Check if there's already a system message
  const hasSystemMessage = messages.some(msg => msg.role === 'system');
  
  if (!hasSystemMessage) {
    // Add the system prompt at the beginning
    return [
      { role: 'system', content: HEALTH_SYSTEM_PROMPT },
      ...messages
    ];
  }
  
  return messages;
}

// Use the real service with fallback
export const chatService = {
  getChatResponse: async (messages: ChatMessage[]): Promise<string> => {
    try {
      // Ensure we have a system prompt
      const messagesWithSystemPrompt = ensureSystemPrompt(messages);
      
      // Try to use the real API
      return await getChatCompletion(messagesWithSystemPrompt);
    } catch (error) {
      console.error('Error with primary chat service:', error);
      // Fall back to the fallback implementation
      return getFallbackChatCompletion(messages);
    }
  }
};
