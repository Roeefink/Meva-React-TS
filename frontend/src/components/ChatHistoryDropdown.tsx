import React, { useRef, useEffect } from "react";
import styled from "styled-components";
import { MessageSquare, CalendarClock, Trash2 } from "lucide-react";

interface Session {
  id: number;
  title: string;
  created_at: string;
}

interface Props {
  sessions: Session[];
  activeSessionId: number | null;
  onSelectSession: (id: number) => void;
  onDeleteSession: (id: number) => void;
  onDeleteAllSessions: () => void;
  isOpen: boolean;
  onClose: () => void;
  toggleRef: React.RefObject<any>; // Using any to avoid strict null checks
}

const DropdownContainer = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 60px; /* Below the header */
  left: 20px;
  width: 320px;
  max-height: 480px;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0,0,0,0.05);
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  flex-direction: column;
  z-index: 1000;
  overflow: hidden;
  animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const Header = styled.div`
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fafafa;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Footer = styled.div`
  padding: 12px;
  border-top: 1px solid #f0f0f0;
  background-color: #fafafa;
`;

const ClearAllButton = styled.button`
  width: 100%;
  padding: 10px;
  border: 1px solid #fee2e2;
  background-color: #fff;
  color: #ef4444;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s;

  &:hover {
    background-color: #fee2e2;
  }
`;

const List = styled.div`
  overflow-y: auto;
  padding: 8px;
  max-height: 400px;
  flex: 1;

  /* Custom Scrollbar */
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #e1e4e8;
    border-radius: 3px;
  }
`;

const DeleteButton = styled.button`
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  opacity: 0; /* Hidden by default */

  &:hover {
    background-color: #fee2e2;
    color: #ef4444;
  }
`;

const Item = styled.div<{ isActive: boolean }>`
  padding: 14px 16px;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 14px;
  transition: all 0.2s ease;
  background-color: ${({ isActive }) => (isActive ? "#f0f9ff" : "transparent")};
  color: ${({ isActive }) => (isActive ? "#007bff" : "#333")};
  margin-bottom: 4px;
  position: relative;

  &:hover {
    background-color: ${({ isActive }) => (isActive ? "#f0f9ff" : "#f8f9fa")};
    transform: translateX(2px);
  }

  /* Show delete button on hover */
  &:hover ${DeleteButton} {
    opacity: 1;
  }
`;

const Title = styled.span`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 0.95rem;
  font-weight: 500;
  flex: 1;
`;

const DateText = styled.span`
  font-size: 0.75rem;
  color: #999;
  min-width: fit-content;
`;

const EmptyState = styled.div`
    padding: 30px;
    text-align: center;
    color: #999;
    font-size: 0.9rem;
`;

const ChatHistoryDropdown: React.FC<Props> = ({ sessions, activeSessionId, onSelectSession, onDeleteSession, onDeleteAllSessions, isOpen, onClose, toggleRef }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current && 
        !containerRef.current.contains(event.target as Node) &&
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, toggleRef]);

  return (
    <DropdownContainer isOpen={isOpen} ref={containerRef}>
      <Header>
        <CalendarClock size={16} />
        Recent Activity
      </Header>
      <List>
        {sessions.length === 0 ? (
             <EmptyState>No history yet</EmptyState>
        ) : (
            sessions.map((session) => (
            <Item
                key={session.id}
                isActive={session.id === activeSessionId}
                onClick={() => {
                onSelectSession(session.id);
                onClose();
                }}
            >
                <MessageSquare size={18} opacity={session.id === activeSessionId ? 1 : 0.6} />
                <Title>{session.title}</Title>
                <DateText>
                    {new Date(session.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </DateText>
                <DeleteButton
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent selecting the session
                        if (window.confirm("Are you sure you want to delete this chat?")) {
                            onDeleteSession(session.id);
                        }
                    }}
                    title="Delete Chat"
                >
                    <Trash2 size={16} />
                </DeleteButton>
            </Item>
            ))
        )}
      </List>
      {sessions.length > 0 && (
        <Footer>
          <ClearAllButton onClick={() => {
              if (window.confirm("Are you sure you want to delete ALL chat history? This cannot be undone.")) {
                  onDeleteAllSessions();
                  onClose();
              }
          }}>
            <Trash2 size={16} />
            Clear All History
          </ClearAllButton>
        </Footer>
      )}
    </DropdownContainer>
  );
};

export default ChatHistoryDropdown;
