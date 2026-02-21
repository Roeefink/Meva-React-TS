import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { History, MessageSquarePlus } from "lucide-react";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import ChatHistoryDropdown from "../components/ChatHistoryDropdown";
import { supabase } from "../config/Supabase";

export interface Message {
  id: string; // Changed from number to string for MongoDB ObjectId compatibility
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}

interface Session {
  id: string; // Changed from number to string for MongoDB ObjectId compatibility
  title: string;
  created_at: string;
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  flex: 1;
  min-height: 78.3vh;
  position: relative;
  background-color: #ffffff;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 30px; /* Increased padding */
  background-color: #ffffff;
  border-bottom: 1px solid #f0f0f0;
  height: 80px; /* Increased height */
  position: relative;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const HistoryButton = styled.button<{ isActive: boolean }>`
  background: white;
  border: 1px solid ${({ isActive }) => isActive ? "#007bff" : "#e1e4e8"};
  color: ${({ isActive }) => isActive ? "#007bff" : "#555"};
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s;

  &:hover {
    background-color: #f8f9fa;
    border-color: #d1d5db;
  }
`;

const NewChatButton = styled.button`
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  box-shadow: 0 2px 5px rgba(0, 123, 255, 0.3);

  &:hover {
    background-color: #0056b3;
  }
`;

const CurrentSessionTitle = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  
  @media (max-width: 600px) {
    display: none;
  }
`;

const MessagesWrapper = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  background-color: #ffffff;
  padding: 20px 40px;
  display: flex;
  flex-direction: column;
  /* Removed align-items: center to restore standard layout */
`;

const LoadingIndicator = styled.div`
  padding: 10px 20px;
  color: #666;
  font-style: italic;
  font-size: 0.9em;
  align-self: center; /* Keep loader centered though */
`;

const WELCOME_MESSAGES = [
  "How can I help you today?",
  "What’s on your mind?",
  "Ready when you are! What should we talk about?",
  "Let’s get started. Ask me anything."
];

const getRandomWelcomeMessage = () => {
  return WELCOME_MESSAGES[Math.floor(Math.random() * WELCOME_MESSAGES.length)];
};

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [userToken, setUserToken] = useState<string | null>(null);
  const historyButtonRef = React.useRef<HTMLButtonElement>(null);

  // 1. Fetch User & Sessions on Mount
  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        setMessages([{
          id: '1',
          sender: "bot",
          text: "Hello! Please log in to chat with the medical assistant.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        }]);
        return;
      }

      setUserToken(token);
      await fetchSessions(token);
    };

    init();
  }, []);

  // 2. Fetch Sessions
  const fetchSessions = async (token: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/v1/chat/sessions`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        // Ensure sessions is an array to prevent crashes
        const sessionList = Array.isArray(data.sessions) ? data.sessions : [];
        setSessions(sessionList);

        // Only auto-select if we have sessions AND we don't have an active one yet.
        if (sessionList.length > 0 && activeSessionId === null) {
          setActiveSessionId(sessionList[0].id);
        }
      }
    } catch (err) {
      console.error("Failed to fetch sessions", err);
      // Don't crash the app, just show empty
      setSessions([]);
    }
  };

  // 3. Create New Session
  const createSession = async (token: string, initialMessage?: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/v1/chat/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        const newSession = data.session;
        setSessions(prev => [newSession, ...prev]);
        setActiveSessionId(newSession.id);

        if (!initialMessage) {
          setMessages([{
            id: Date.now().toString(),
            sender: "bot",
            text: getRandomWelcomeMessage(),
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }]);
        }
        setIsHistoryOpen(false);
        return newSession.id;
      }
    } catch (err) {
      console.error("Failed to create session", err);
    }
    return null;
  };

  // 4. Load Messages when active session changes
  useEffect(() => {
    if (!activeSessionId) {
      // If explicitly set to null (e.g. initial load empty, or deleted all), clear messages
      setMessages([]);
      return;
    }
    if (!userToken) return;

    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
        const response = await fetch(`${API_URL}/api/v1/chat?sessionId=${activeSessionId}`, {
          headers: { 'Authorization': `Bearer ${userToken}` }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
          } else {
            setMessages([{
              id: Date.now().toString(),
              sender: "bot",
              text: getRandomWelcomeMessage(),
              timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
            }]);
          }
        }
      } catch (err) {
        console.error("Failed to load messages", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [activeSessionId, userToken]);


  const handleSend = async (text: string) => {
    if (!userToken) return;

    // Auto-create session if none exists
    let currentSessionId = activeSessionId;
    if (!currentSessionId) {
      currentSessionId = await createSession(userToken, text);
      if (!currentSessionId) return; // Failed to create
      // Clear default messages if we just created it
      setMessages([]);
    }

    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/v1/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify({ message: text, sessionId: currentSessionId }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, botMsg]);

      // Update sessions list (to get new title)
      // Note: We avoid aggressive refetching that might resurrect deleted items if race condition
      fetchSessions(userToken);

    } catch (error: any) {
      console.error("Chat Error:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: "bot",
        text: "Error: " + error.message,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Delete Session
  const deleteSession = async (sessionId: string) => {
    if (!userToken) return;

    // Store previous state for rollback
    const previousSessions = [...sessions];
    const previousActiveId = activeSessionId;

    try {
      // Optimistic update
      setSessions(prev => prev.filter(s => s.id !== sessionId));

      if (activeSessionId === sessionId) {
        const remaining = sessions.filter(s => s.id !== sessionId);
        if (remaining.length > 0) {
          setActiveSessionId(remaining[0].id);
        } else {
          setActiveSessionId(null);
          setMessages([{
            id: Date.now().toString(),
            sender: "bot",
            text: getRandomWelcomeMessage(),
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }]);
        }
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/v1/chat/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${userToken}` }
      });

      if (!response.ok) {
        throw new Error("Failed to delete");
      }
    } catch (err) {
      console.error("Failed to delete session", err);
      alert("Failed to delete chat. Please try again.");
      // Revert state
      setSessions(previousSessions);
      setActiveSessionId(previousActiveId);
      // Force refresh to be safe
      fetchSessions(userToken);
    }
  };

  // 6. Delete All Sessions
  const deleteAllSessions = async () => {
    if (!userToken) return;

    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      const response = await fetch(`${API_URL}/api/v1/chat/sessions`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${userToken}` }
      });

      if (!response.ok) {
        throw new Error("Failed to delete all sessions");
      }

      // Success: Clear local state
      setSessions([]);
      setMessages([]); // Clear messages momentarily

      // Immediately create a new session so the user is ready to type
      await createSession(userToken);

    } catch (err) {
      console.error("Failed to delete all sessions", err);
      alert("Failed to delete all history. Please try again.");
    }
  };

  const currentSession = sessions.find(s => s.id === activeSessionId);

  return (
    <PageContainer>
      <Header>
        <HeaderLeft>
          <HistoryButton
            ref={historyButtonRef}
            isActive={isHistoryOpen}
            onClick={() => setIsHistoryOpen(!isHistoryOpen)}
          >
            <History size={18} />
            History
          </HistoryButton>

          {currentSession && (
            <CurrentSessionTitle>{currentSession.title}</CurrentSessionTitle>
          )}
        </HeaderLeft>

        <NewChatButton onClick={() => userToken && createSession(userToken)}>
          <MessageSquarePlus size={18} />
          New Chat
        </NewChatButton>
      </Header>

      <ChatHistoryDropdown
        sessions={sessions}
        activeSessionId={activeSessionId}
        onSelectSession={(id) => setActiveSessionId(id)}
        onDeleteSession={deleteSession}
        onDeleteAllSessions={deleteAllSessions}
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        toggleRef={historyButtonRef}
      />

      <MessagesWrapper>
        <MessageList messages={messages} />
        {isLoading && <LoadingIndicator>AI is thinking...</LoadingIndicator>}
      </MessagesWrapper>
      <MessageInput onSend={handleSend} />
    </PageContainer>
  );
};

export default ChatWindow;
