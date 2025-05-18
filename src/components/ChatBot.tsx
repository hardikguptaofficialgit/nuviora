import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Minimize2, Maximize2, Zap, Bot, Sparkles } from 'lucide-react';
import Draggable from 'react-draggable';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { chatService } from '@/services/chatService';

// Define message types
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

// Use the chat service to get responses
const fetchChatResponse = async (messages: Message[]): Promise<string> => {
  // Convert our Message type to the ChatMessage type expected by the service
  const chatMessages = messages.map(({ role, content }) => ({
    role,
    content
  }));
  
  return chatService.getChatResponse(chatMessages);
};

const ChatBot: React.FC = () => {
  // Always visible, but can be minimized
  const [isOpen, setIsOpen] = useState(true);
  const [isMinimized, setIsMinimized] = useState(true); // Start minimized
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'system',
      content: 'Welcome to NuviOra Health Assistant. How can I help you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!input.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get response from AI
      const response = await fetchChatResponse([...messages, userMessage]);
      
      // Add assistant message
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      
      // Add error message
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const toggleChat = () => {
    if (isMinimized) setIsMinimized(false);
  };
  
  const toggleMinimize = () => {
    setIsMinimized(prev => !prev);
  };
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleDragStop = (e: any, data: any) => {
    setPosition({ x: data.x, y: data.y });
  };

  return (
    <div className="chatbot-container">
      <Draggable
        handle=".drag-handle"
        defaultPosition={{ x: 0, y: 0 }}
        position={position}
        onStop={handleDragStop}
        bounds="parent"
      >
        <div className="fixed bottom-6 right-6 z-[9999]">
        {/* Chat window */}
          <Card className={`${isMinimized ? 'w-16 h-16' : 'w-80 sm:w-96'} shadow-2xl border border-neon overflow-hidden rounded-xl backdrop-blur-lg bg-black/70`}>
            {isMinimized ? (
              // Minimized view - just the thunder icon
              <div 
                className="h-full w-full flex items-center justify-center cursor-pointer drag-handle"
                onClick={toggleMinimize}
              >
                <div className="bg-neon rounded-full p-3 flex items-center justify-center">
                  <Zap size={24} className="text-black" />
                </div>
              </div>
            ) : (
              // Full view with header
              <div className="bg-gradient-to-r from-black/90 to-gray-800/90 border-b border-neon p-3 flex justify-between items-center drag-handle cursor-move">
                <div className="flex-1 flex justify-center items-center">
                  <div className="bg-neon rounded-full p-2 flex items-center justify-center">
                    <Zap size={20} className="text-black" />
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full hover:bg-neon/20"
                    onClick={toggleMinimize}
                  >
                    <Minimize2 size={16} className="text-neon" />
                  </Button>
                </div>
              </div>
            )}
            
            {/* Chat body - only shown when not minimized */}
            {!isMinimized && (
              <div className="max-h-[500px]">
                <div className="h-96 overflow-y-auto p-4 bg-gradient-to-b from-black/70 to-gray-900/70 backdrop-blur-lg">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${
                      message.role === 'user'
                        ? 'flex flex-col items-end'
                        : 'flex flex-col items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-3 shadow-lg ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-neon to-neon/90 text-black'
                          : message.role === 'system'
                          ? 'bg-gradient-to-r from-gray-800 to-gray-700 text-white border border-gray-700'
                          : 'bg-gradient-to-r from-gray-700 to-gray-600 text-white border border-gray-600'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-70 text-right">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="flex items-center gap-2 text-neon-dim">
                    <div className="loading-dots">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                    <span className="text-xs">AI is thinking...</span>
                  </div>
                )}
              </div>
              
              {/* Chat input */}
              <div className="p-3 border-t border-neon/30 bg-gradient-to-r from-black/90 to-gray-800/90">
                <div className="flex items-center gap-2">
                  <Input
                    type="text"
                    placeholder="Ask about your health..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="flex-1 bg-gray-800/60 border-neon/40 focus:border-neon rounded-xl placeholder:text-gray-400 text-white"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={isLoading || !input.trim()}
                    className="bg-neon text-black hover:bg-neon/80 rounded-xl transition-all duration-200 shadow-lg hover:shadow-neon/30"
                  >
                    <Send size={16} />
                  </Button>
                </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </Draggable>
        
      <style>{`
          .loading-dots {
            display: flex;
            align-items: center;
            gap: 4px;
          }
          
          .loading-dots span {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background-color: #BEEA9E;
            display: inline-block;
            animation: bounce 1.4s infinite ease-in-out both;
          }
          
          .loading-dots span:nth-child(1) {
            animation-delay: -0.32s;
          }
          
          .loading-dots span:nth-child(2) {
            animation-delay: -0.16s;
          }
          
          @keyframes bounce {
            0%, 80%, 100% {
              transform: scale(0);
              opacity: 0.5;
            }
            40% {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}</style>
    </div>
  );
};

export default ChatBot;
