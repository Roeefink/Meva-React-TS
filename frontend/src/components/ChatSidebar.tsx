import React from "react";
import styled from "styled-components";
import { MessageSquarePlus, MessageSquare } from "lucide-react";

interface Session {
  id: number;
  title: string;
  created_at: string;
}

interface Props {
  sessions: Session[];
  activeSessionId: number | null;
  onSelectSession: (id: number) => void;
  onNewChat: () => void;
  isOpen: boolean;
}

const SidebarContainer = styled.div<{ isOpen: boolean }>`
  width: 260px;
  background-color: #f8f9fa;
  border-right: 1px solid #e1e4e8;
  display: flex;
  flex-direction: column;
  height: 100%;
  transition: transform 0.3s ease-in-out;
  
  @media (max-width: 768px) {
    position: absolute;
    z-index: 100;
    transform: ${({ isOpen }) => (isOpen ? "translateX(0)" : "translateX(-100%)")};
    height: 100%;
    box-shadow: 2px 0 5px rgba(0,0,0,0.1);
  }
`;

const NewChatButton = styled.button`
  margin: 16px;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #374151;
  font-weight: 500;
  font-size: 0.95rem;

  &:hover {
    background-color: #f3f4f6;
    border-color: #9ca3af;
  }
`;

const SessionList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0 16px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const SessionItem = styled.div<{ isActive: boolean }>`
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s;
  background-color: ${({ isActive }) => (isActive ? "#e6f0ff" : "transparent")};
  color: ${({ isActive }) => (isActive ? "#007bff" : "#4b5563")};

  &:hover {
    background-color: ${({ isActive }) => (isActive ? "#e6f0ff" : "#eceef1")};
  }
`;

const SessionTitle = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.9rem;
`;

const ChatSidebar: React.FC<Props> = ({ sessions, activeSessionId, onSelectSession, onNewChat, isOpen }) => {
  return (
    <SidebarContainer isOpen={isOpen}>
      <NewChatButton onClick={onNewChat}>
        <MessageSquarePlus size={20} />
        New Chat
      </NewChatButton>
      <SessionList>
        {sessions.map((session) => (
          <SessionItem
            key={session.id}
            isActive={session.id === activeSessionId}
            onClick={() => onSelectSession(session.id)}
          >
            <MessageSquare size={18} />
            <SessionTitle>{session.title}</SessionTitle>
          </SessionItem>
        ))}
      </SessionList>
    </SidebarContainer>
  );
};

export default ChatSidebar;
