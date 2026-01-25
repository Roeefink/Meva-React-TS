import React, { useState, useEffect } from "react";
import styled from "styled-components";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import { supabase } from "../config/Supabase";

export interface Message {
  id: number;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

const ChatContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  min-height: 78.3vh;
`;

const MessagesWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  max-height: calc(80vh - 100px);
`;

const LoadingIndicator = styled.div`
  padding: 10px 20px;
  color: #666;
  font-style: italic;
  font-size: 0.9em;
`;

const ChatWindow: React.FC = () => {
  // Start with empty state, let useEffect populate it
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token;

        if (!token) {
           // If not logged in, show default message
           setMessages([{
              id: 1,
              sender: "bot",
              text: "Hello! Please log in to chat with the medical assistant.",
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
           }]);
           return;
        }

        const response = await fetch('http://localhost:3001/api/v1/chat', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
          } else {
             // No history, show default welcome
             setMessages([{
                id: 1,
                sender: "bot",
                text: "Hello! I am your medical assistant. How can I help you today?",
                timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
             }]);
          }
        }
      } catch (error) {
        console.error("Error loading history:", error);
      }
    };

    loadHistory();
  }, []);

  const handleSend = async (text: string) => {
    // 1. Optimistic Update (Show user message immediately)
    const userMsg: Message = {
      id: Date.now(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // 2. Get Auth Token
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        throw new Error("Please log in to chat.");
      }

      // 3. Call Backend API
      const response = await fetch('http://localhost:3001/api/v1/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response");
      }

      // 4. Add Bot Message
      const botMsg: Message = {
        id: Date.now() + 1, // Note: Ideally use ID from backend if provided
        sender: "bot",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, botMsg]);

    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMsg: Message = {
        id: Date.now() + 1,
        sender: "bot",
        text: "Sorry, I encountered an issue: " + error.message,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ChatContent>
      <MessagesWrapper>
        <MessageList messages={messages} />
        {isLoading && <LoadingIndicator>AI is thinking...</LoadingIndicator>}
      </MessagesWrapper>
      <MessageInput onSend={handleSend} />
    </ChatContent>
  );
};

export default ChatWindow;
