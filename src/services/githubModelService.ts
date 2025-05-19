import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";


const token = "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"; // 
const endpoint = "https://models.github.ai/inference";
const modelName = "microsoft/Phi-4-mini-instruct";

// Interface for chat message
export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

// Interface for API options
interface ApiOptions {
  temperature?: number;
  top_p?: number;
  max_tokens?: number;
  presence_penalty?: number;
  frequency_penalty?: number;
}

// Service for interacting with GitHub AI models
export const githubModelService = {
  /** 
   * Get a chat completion from the GitHub-hosted AI model.
   */
  getChatCompletion: async (
    messages: ChatMessage[], 
    systemPrompt: string = "", 
    options: ApiOptions = {}
  ): Promise<string> => {
    const maxRetries = 2;
    let retries = 0;
    let lastError: any = null;
    
    // Default API options
    const defaultOptions: ApiOptions = {
      temperature: 0.7,
      top_p: 1.0,
      max_tokens: 1000,
      presence_penalty: 0,
      frequency_penalty: 0,
    };
    
    const apiOptions = { ...defaultOptions, ...options };
    
    while (retries <= maxRetries) {
      try {
        const client = ModelClient(endpoint, new AzureKeyCredential(token));
        
        const allMessages = systemPrompt 
          ? [{ role: "system" as const, content: systemPrompt }, ...messages]
          : [...messages];
        
        const response = await client.path("/chat/completions").post({
          body: {
            messages: allMessages,
            temperature: apiOptions.temperature,
            top_p: apiOptions.top_p,
            max_tokens: apiOptions.max_tokens,
            presence_penalty: apiOptions.presence_penalty,
            frequency_penalty: apiOptions.frequency_penalty,
            model: modelName,
          },
        });
        
        if (isUnexpected(response)) {
          throw new Error(response.body.error?.message || "Unexpected API response");
        }
        
        return response.body.choices[0].message.content.trim();
      } catch (error: any) {
        lastError = error;
        console.error(`Error getting chat completion (attempt ${retries + 1}/${maxRetries + 1}):`, error.message);
        
        const isRetryableError = 
          error?.message?.includes("rate limit") || 
          error?.message?.includes("timeout") || 
          error?.status >= 500 || 
          error?.message?.includes("503") || 
          error?.message?.includes("502");
          
        if (isRetryableError && retries < maxRetries) {
          const delay = Math.floor(1000 * Math.pow(2, retries) * (0.8 + Math.random() * 0.4));
          console.log(`Retrying after ${delay}ms...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          retries++;
          continue;
        }
        
        break;
      }
    }
    
    console.error("All attempts failed:", lastError);
    return "Sorry, I encountered a technical issue. Please try again later.";
  },
  
  /** 
   * Check if the GitHub AI inference service is responsive.
   */
  checkHealth: async (): Promise<boolean> => {
    try {
      const client = ModelClient(endpoint, new AzureKeyCredential(token));
      
      const response = await client.path("/chat/completions").post({
        body: {
          messages: [{ role: "user", content: "Hello" }],
          temperature: 0.1,
          max_tokens: 10,
          model: modelName,
        },
      });
      
      return !isUnexpected(response);
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  },
};
