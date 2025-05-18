import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, Minimize2, Maximize2, Send, Bot, Sparkles, ChevronUp, Moon, RotateCcw, Zap, MessageSquare, Brain } from 'lucide-react';
import { githubModelService, ChatMessage } from '@/services/githubModelService';
import './ChatBot.css';

const ChatBot: React.FC = () => {
  // State management
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hi there! I\'m your NuviOra health assistant. How can I help with your wellness journey today?' }
  ]);
  const MAX_MESSAGES = 50; // Maximum number of messages to keep in history
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  
  // Refs
  const chatbotRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dragStartRef = useRef<{x: number, y: number} | null>(null);
  
  // Enhanced auto-scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      // Use a small timeout to ensure DOM has updated
      const scrollTimeout = setTimeout(() => {
        const messagesContainer = document.querySelector('.chatbot-messages');
        const isScrolledToBottom = messagesContainer ? 
          messagesContainer.scrollHeight - messagesContainer.clientHeight <= messagesContainer.scrollTop + 100 : true;
        
        // Only auto-scroll if already near the bottom or it's a new message
        if (isScrolledToBottom || messages.length > 0) {
          messagesEndRef.current?.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'end'
          });
        }
      }, 100);
      
      return () => clearTimeout(scrollTimeout);
    }
  }, [messages, typingText, isOpen]);
  
  // Focus input when chat is opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen, isMinimized]);
  
  // Handle clicks outside the chatbot to auto-close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && chatbotRef.current && !chatbotRef.current.contains(event.target as Node)) {
        // Don't close if clicking on the toggle button
        const toggleButton = document.querySelector('.chatbot-toggle');
        if (toggleButton && toggleButton.contains(event.target as Node)) {
          return;
        }
        
        // Only close if not dragging
        if (!isDragging) {
          // Close the chatbot completely instead of minimizing
          setIsOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside); // Add touch support
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen, isDragging]);
  
  // Clean up any timeouts on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);
  
  // Drag functionality
  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement && e.target.closest('.chatbot-header')) {
      e.preventDefault();
      setIsDragging(true);
      dragStartRef.current = {
        x: e.clientX - position.x,
        y: e.clientY - position.y
      };
    }
  }, [position]);
  
  const handleDragMove = useCallback((e: MouseEvent) => {
    if (isDragging && dragStartRef.current) {
      const newX = e.clientX - dragStartRef.current.x;
      const newY = e.clientY - dragStartRef.current.y;
      
      // Ensure the chatbot stays within viewport bounds
      const chatbotWidth = chatbotRef.current?.offsetWidth || 380;
      const chatbotHeight = chatbotRef.current?.offsetHeight || 550;
      
      const maxX = window.innerWidth - chatbotWidth;
      const maxY = window.innerHeight - chatbotHeight;
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY))
      });
    }
  }, [isDragging]);
  
  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    dragStartRef.current = null;
  }, []);
  
  // Set up drag event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleDragMove);
      document.addEventListener('mouseup', handleDragEnd);
    } else {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleDragMove);
      document.removeEventListener('mouseup', handleDragEnd);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);
  
  // Enhanced typing effect for assistant messages with word-by-word animation
  const simulateTyping = useCallback((text: string) => {
    // Clear any existing typing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    
    setIsTyping(true);
    setTypingText('');
    
    // Split text into words and punctuation for more natural typing
    const words = text.match(/[\w']+|[.,!?;:]|\s+/g) || [];
    
    // Calculate a dynamic typing speed based on text length
    const baseWordDelay = 100; // base delay between words in ms
    const minWordDelay = 40; // minimum delay between words for long responses
    const maxWordDelay = 200; // maximum delay between words for short responses
    
    // Adjust word delay based on text length - shorter texts get longer delays for more dramatic effect
    const wordDelay = Math.max(minWordDelay, Math.min(maxWordDelay, baseWordDelay * (1000 / text.length)));
    
    let currentIndex = 0;
    let currentText = '';
    
    const typeNextWord = () => {
      if (currentIndex < words.length) {
        const word = words[currentIndex];
        currentText += word;
        setTypingText(currentText);
        currentIndex++;
        
        // Calculate delay for next word based on various factors
        let delay = wordDelay;
        
        // Add extra delay after punctuation
        const endsWithPunctuation = /[.!?]$/.test(currentText.trim());
        const hasComma = /,$/.test(currentText.trim());
        
        // Longer pauses at the end of sentences
        if (endsWithPunctuation) {
          delay *= 2.5;
        } 
        // Slight pause after commas
        else if (hasComma) {
          delay *= 1.5;
        }
        
        // Add some randomness to make it feel more human
        const randomFactor = 0.7 + (Math.random() * 0.6); // 0.7 to 1.3 multiplier
        delay *= randomFactor;
        
        // Slightly longer pause before starting a new sentence
        const nextWordStartsSentence = currentIndex < words.length && /^[A-Z]/.test(words[currentIndex]) && endsWithPunctuation;
        if (nextWordStartsSentence) {
          delay *= 1.3;
        }
        
        // Schedule next word
        typingTimeoutRef.current = setTimeout(typeNextWord, delay);
      } else {
        // Typing complete - add a small delay before finalizing
        setTimeout(() => {
          setIsTyping(false);
          // Add the message to the chat history, limiting to MAX_MESSAGES
          setMessages(prev => {
            const newMessages = [...prev, { role: 'assistant' as const, content: text }];
            // If we exceed the max, trim the oldest messages (but keep the first welcome message)
            return newMessages.length > MAX_MESSAGES ? 
              [newMessages[0], ...newMessages.slice(-(MAX_MESSAGES-1))] : 
              newMessages;
          });
          setTypingText('');
        }, 300);
      }
    };
    
    // Start typing with an initial thinking delay
    const thinkingDelay = Math.min(1000, 300 + text.length / 10);
    typingTimeoutRef.current = setTimeout(typeNextWord, thinkingDelay);
  }, []);
  
  // Handle sending a message
  const handleSendMessage = useCallback(async () => {
    if (!inputValue.trim()) return;
    
    // Add user message with message limit
    const userMessage: ChatMessage = { role: 'user', content: inputValue.trim() };
    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      // If we exceed the max, trim the oldest messages (but keep the first welcome message)
      return newMessages.length > MAX_MESSAGES ? 
        [newMessages[0], ...newMessages.slice(-(MAX_MESSAGES-1))] : 
        newMessages;
    });
    
    // Clear input
    setInputValue('');
    
    try {
      // Start typing animation with a loading indicator
      setIsTyping(true);
      
      // System prompt for the health assistant
      const systemPrompt = "You are NuviOra's health and wellness AI assistant. Provide helpful, concise advice about health, fitness, nutrition, sleep, and mental wellbeing. Be friendly, supportive, and empathetic. Keep responses brief (under 150 words) and focused on actionable advice. Avoid medical diagnoses or prescriptions.";
      
      // Get response from GitHub model
      const response = await githubModelService.getChatCompletion(
        [...messages, userMessage],
        systemPrompt
      );
      
      // Process the response to prevent repetitive introductions
      let processedResponse = response;
      
      // Remove common introduction patterns if they exist
      const introPatterns = [
        /^(Hello|Hi|Hey|Greetings).*?\s/i,
        /^(I'm|I am)\s+(your|the)\s+(NuviOra|health|wellness|assistant).*?\s/i,
        /^As\s+(your|the)\s+(NuviOra|health|wellness|assistant).*?\s/i
      ];
      
      for (const pattern of introPatterns) {
        if (pattern.test(processedResponse)) {
          processedResponse = processedResponse.replace(pattern, '');
          // Capitalize first letter if needed
          processedResponse = processedResponse.charAt(0).toUpperCase() + processedResponse.slice(1);
          break;
        }
      }
      
      // Simulate typing effect with the processed response
      simulateTyping(processedResponse);
      
    } catch (error) {
      console.error('Error getting response:', error);
      setIsTyping(false);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error processing your request. Please try again in a moment.' 
      }]);
    }
  }, [inputValue, messages, simulateTyping]);
  
  // Handle input key press (Enter to send)
  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);
  
  // Toggle chatbot open/closed
  const toggleChatbot = useCallback(() => {
    if (isOpen && isMinimized) {
      // If it's open but minimized, just maximize it
      setIsMinimized(false);
    } else {
      // Otherwise toggle open/closed state
      setIsOpen(prev => !prev);
      if (isMinimized) {
        setIsMinimized(false);
      }
    }
  }, [isOpen, isMinimized]);
  
  // Toggle minimize/maximize
  const toggleMinimize = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(prev => !prev);
  }, []);
  
  // Clear chat history
  const clearChat = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setMessages([
      { role: 'assistant', content: 'Chat history cleared. How can I help you today?' }
    ]);
  }, []);
  
  // Auto-resize textarea as user types
  const handleTextareaInput = useCallback((e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = 'auto';
    // Set the height to scrollHeight to fit content
    textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
  }, []);
  
  // Calculate style for the chatbot container based on position and dragging state
  const chatbotStyle = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    cursor: isDragging ? 'grabbing' : 'default',
    transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
  };
  
  return (
    <div className="nuviora-chatbot">
      {/* Chatbot toggle button with pulse animation */}
      <button 
        className="chatbot-toggle"
        onClick={toggleChatbot}
        aria-label="Toggle health assistant"
      >
        {isOpen && isMinimized ? (
          <ChevronUp size={20} />
        ) : (
          <>
            <Zap size={22} />
            <div className="chatbot-toggle-pulse"></div>
          </>
        )}
      </button>
      
      {/* Chatbot window */}
      {isOpen && (
        <div 
          ref={chatbotRef}
          className={`chatbot-container ${isMinimized ? 'chatbot-minimized' : ''}`}
          style={chatbotStyle}
          onMouseDown={handleDragStart}
          onClick={(e) => e.stopPropagation()} // Prevent clicks from propagating to document
        >
          <div className="chatbot-window">
            {/* Header with drag handle */}
            <div className="chatbot-header">
              <div className="chatbot-title">
                <Brain size={18} className="chatbot-title-icon" />
                <span>NuviOra Health Assistant</span>
              </div>
              <div className="chatbot-controls">
                <button 
                  className="chatbot-control-button"
                  onClick={clearChat}
                  aria-label="Clear chat history"
                  title="Clear chat history"
                >
                  <RotateCcw size={16} />
                </button>
                <button 
                  className="chatbot-control-button"
                  onClick={toggleMinimize}
                  aria-label={isMinimized ? "Maximize" : "Minimize"}
                  title={isMinimized ? "Maximize" : "Minimize"}
                >
                  {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                </button>
                <button 
                  className="chatbot-control-button"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {/* Messages container */}
            <div className="chatbot-messages">
              {messages.map((message, index) => (
                <div 
                  key={index} 
                  className={`message ${message.role === 'user' ? 'user-message' : 'assistant-message'}`}
                >
                  {message.content}
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                typingText ? (
                  <div className="message assistant-message">
                    <div className="typing-text">{typingText}</div>
                  </div>
                ) : (
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                )
              )}
              
              {/* Invisible div for auto-scrolling */}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input area */}
            <div className="chatbot-input">
              <textarea
                ref={inputRef}
                className="chatbot-input-field"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                onInput={handleTextareaInput}
                placeholder="Type your message..."
                rows={1}
                disabled={isTyping}
              />
              <button 
                className="chatbot-send-button"
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isTyping}
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
