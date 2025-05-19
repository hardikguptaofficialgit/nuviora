import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Minimize, Maximize, Zap } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { githubModelService, ChatMessage } from '@/services/githubModelService';
import './ChatBot.css';

const ChatBot: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! I am NuviOra, your health assistant developed by NuviOra Healthcare Tech. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [fullResponse, setFullResponse] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const typingSpeed = 30; // milliseconds per character
  const [position, setPosition] = useState({ x: 'auto', y: 'auto' });
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Dragging functionality
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleOpen = () => {
    setIsOpen(true);
    setIsMinimized(false);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    
    try {
      // Get response from GitHub AI model
      const response = await githubModelService.getChatCompletion(
        [...messages, userMessage],
        "You are NuviOra, an advanced health assistant developed by NuviOra Healthcare Tech. You help users with their health monitoring, fitness tracking, and wellness goals. Answer questions about health, nutrition, exercise, sleep, and wellness in a concise, friendly, and professional manner. IMPORTANT: When asked who developed you, who created you, who made you, what is your name, or any similar question about your identity, ALWAYS respond that your name is NuviOra and you were developed by NuviOra Healthcare Tech. Never mention any other company, developer, or creator. Always identify yourself as NuviOra in all interactions."
      );
      
      // Store the full response and start typing animation
      setFullResponse(response);
      setTypingText('');
      setIsTyping(true);
    } catch (error) {
      console.error('Error getting chat response:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again later.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  // Typing animation effect
  useEffect(() => {
    if (isTyping && fullResponse) {
      if (typingText.length < fullResponse.length) {
        const timeout = setTimeout(() => {
          setTypingText(fullResponse.substring(0, typingText.length + 1));
        }, typingSpeed);
        return () => clearTimeout(timeout);
      } else {
        // Typing animation complete, add the message to the chat
        setMessages(prev => [...prev, { role: 'assistant', content: fullResponse }]);
        setIsTyping(false);
        setFullResponse('');
      }
    }
  }, [isTyping, fullResponse, typingText, typingSpeed]);

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target instanceof HTMLElement && e.target.classList.contains('chat-header')) {
      setIsDragging(true);
      const rect = chatRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
      }
    }
  };

  // Handle mouse move for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && chatRef.current) {
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;
        
        // Ensure the chat window stays within viewport bounds
        const chatWidth = chatRef.current.offsetWidth;
        const chatHeight = chatRef.current.offsetHeight;
        const maxX = window.innerWidth - chatWidth;
        const maxY = window.innerHeight - chatHeight;
        
        setPosition({
          x: `${Math.max(0, Math.min(newX, maxX))}px`,
          y: `${Math.max(0, Math.min(newY, maxY))}px`
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return (
    <>
      {/* Floating chat button */}
      {!isOpen && (
        <button 
          className="chat-button"
          onClick={handleOpen}
          aria-label="Open chat"
        >
          <Zap size={24} />
        </button>
      )}

      {/* Chat window */}
      {isOpen && (
        <div 
          ref={chatRef}
          className={`chat-container ${isMinimized ? 'minimized' : ''}`}
          style={{ 
            left: position.x, 
            bottom: position.y === 'auto' ? '20px' : 'auto',
            top: position.y !== 'auto' ? position.y : 'auto',
            cursor: isDragging ? 'grabbing' : 'auto'
          }}
          onMouseDown={handleMouseDown}
        >
          {/* Chat header */}
          <div className="chat-header">
            <h3>NuviOra</h3>
            <div className="chat-controls">
              <button onClick={handleMinimize} aria-label={isMinimized ? 'Maximize' : 'Minimize'}>
                {isMinimized ? <Maximize size={16} /> : <Minimize size={16} />}
              </button>
              <button onClick={handleClose} aria-label="Close chat">
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Chat content */}
          {!isMinimized && (
            <>
              {/* Messages area */}
              <div className="chat-messages">
                {!isAuthenticated ? (
                  <div className="login-message">
                    <p>Please log in to continue chatting with our assistant.</p>
                    <a href="/login" className="login-link">Login</a>
                  </div>
                ) : (
                  <>
                    {messages.map((msg, index) => (
                      <div 
                        key={index} 
                        className={`message ${msg.role === 'user' ? 'user-message' : 'assistant-message'}`}
                      >
                        <div className="message-content">{msg.content}</div>
                      </div>
                    ))}
                    {(isLoading || isTyping) && (
                      <div className="message assistant-message">
                        {isLoading ? (
                          <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                        ) : (
                          <div className="message-content typing-animation">{typingText}</div>
                        )}
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input area */}
              {isAuthenticated && (
                <form onSubmit={handleSubmit} className="chat-input-container">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type your message..."
                    disabled={isLoading || isTyping}
                    className="chat-input"
                  />
                  <button 
                    type="submit" 
                    disabled={isLoading || isTyping || !input.trim()} 
                    className="send-button"
                    aria-label="Send message"
                  >
                    <Send size={18} />
                  </button>
                </form>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;
