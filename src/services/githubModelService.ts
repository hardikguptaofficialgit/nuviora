import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

// GitHub token and endpoint configuration
const token = "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";
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4o"; // Using the DeepSeek-V3-0324 model as specified in memories

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
  // Method to get chat completion from GitHub model with enhanced error handling and retry logic
  getChatCompletion: async (
    messages: ChatMessage[], 
    systemPrompt: string = "", 
    options: ApiOptions = {}
  ): Promise<string> => {
    const maxRetries = 2;
    let retries = 0;
    let lastError: any = null;
    
    // Default API options with sensible values
    const defaultOptions: ApiOptions = {
      temperature: 0.7,
      top_p: 0.1,
      max_tokens: 2048,
      presence_penalty: 0.1,
      frequency_penalty: 0.1
    };
    
    // Merge default options with provided options
    const apiOptions = { ...defaultOptions, ...options };
    
    // Retry logic for API calls
    while (retries <= maxRetries) {
      try {
        // Create model client with GitHub token
        const client = ModelClient(
          endpoint,
          new AzureKeyCredential(token)
        );

        // Add system prompt if provided
        const allMessages = systemPrompt 
          ? [{ role: "system" as const, content: systemPrompt }, ...messages]
          : messages;

        // Make API request to GitHub model
        const response = await client.path("/chat/completions").post({
          body: {
            messages: allMessages,
            temperature: apiOptions.temperature,
            top_p: apiOptions.top_p,
            max_tokens: apiOptions.max_tokens,
            presence_penalty: apiOptions.presence_penalty,
            frequency_penalty: apiOptions.frequency_penalty,
            model: model
          }
        });

        // Handle unexpected responses
        if (isUnexpected(response)) {
          throw new Error(response.body.error?.message || "Unexpected API response");
        }

        // Process and return the model's response
        const content = response.body.choices[0].message.content;
        return content.trim();
      } catch (error: any) {
        lastError = error;
        console.error(`Error getting chat completion (attempt ${retries + 1}/${maxRetries + 1}):`, error);
        
        // If it's a rate limit or temporary server error, retry after a delay
        const isRetryableError = 
          error?.message?.includes("rate limit") || 
          error?.message?.includes("timeout") || 
          error?.message?.includes("503") || 
          error?.message?.includes("502");
          
        if (isRetryableError && retries < maxRetries) {
          // Exponential backoff with jitter
          const delay = Math.floor(1000 * Math.pow(2, retries) * (0.8 + Math.random() * 0.4));
          console.log(`Retrying after ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          retries++;
          continue;
        }
        
        // If we've exhausted retries or it's not a retryable error, break out of the loop
        break;
      }
    }
    
    // If we get here, all retries failed
    console.error("All API call attempts failed:", lastError);
    return "Sorry, I encountered a technical issue. Please try again in a moment.";
  },
  
  // Method to check API connection health
  checkHealth: async (): Promise<boolean> => {
    try {
      const client = ModelClient(
        endpoint,
        new AzureKeyCredential(token)
      );
      
      // Simple test query to check if the API is responsive
      const response = await client.path("/chat/completions").post({
        body: {
          messages: [{ role: "user", content: "Hello" }],
          temperature: 0.1,
          max_tokens: 10,
          model: model
        }
      });
      
      return !isUnexpected(response);
    } catch (error) {
      console.error("Health check failed:", error);
      return false;
    }
  }
};
