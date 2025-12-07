import React, { useState } from "react";
import styled from "styled-components";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";

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

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: "bot",
      text: "Hello! I am your medical assistant. How can I help you today?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const handleSend = (text: string) => {
    const userMsg: Message = {
      id: messages.length + 1,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "bot",
          text: "Thank you for your message. An AI assistant will assist you shortly.",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    }, 1200);
  };

  return (
    <ChatContent>
      <MessagesWrapper>
        <MessageList messages={messages} />
      </MessagesWrapper>
      <MessageInput onSend={handleSend} />
    </ChatContent>
  );
};

export default ChatWindow;
