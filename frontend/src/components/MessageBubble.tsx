import React from "react";
import styled, { css, keyframes } from "styled-components";
import type { Message } from "../pages/ChatWindow";

interface Props {
  message: Message;
}

const popIn = keyframes`
  0% {
    opacity: 0;
    transform: translateY(20px) scale(0.9);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const Bubble = styled.div<{ sender: "user" | "bot" }>`
  max-width: 75%;
  padding: 14px 18px;
  border-radius: 18px;
  font-size: 0.95rem;
  line-height: 1.6;
  position: relative;
  letter-spacing: 0.3px;
  
  /* Animation */
  animation: ${popIn} 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;

  /* Sender Specific Styles */
  ${({ sender }) =>
    sender === "user"
      ? css`
          /* User: Left Side, Blue Background */
          align-self: flex-start;
          background: linear-gradient(135deg, rgb(36, 143, 201), rgb(25, 110, 160));
          color: #fff;
          border-bottom-left-radius: 4px;
          box-shadow: 0 4px 15px rgba(36, 143, 201, 0.3);
        `
      : css`
          /* Bot: Right Side, White Background */
          align-self: flex-end;
          background: #ffffff;
          color: #2d3748;
          border-bottom-right-radius: 4px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        `}
    
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const Timestamp = styled.span<{ sender: "user" | "bot" }>`
  display: block;
  font-size: 0.7rem;
  margin-top: 6px;
  text-align: right;
  opacity: 0.8;
  font-weight: 500;
  color: ${({ sender }) => (sender === "user" ? "rgba(255, 255, 255, 0.85)" : "#94a3b8")};
`;

const MessageBubble: React.FC<Props> = ({ message }) => (
  <Bubble sender={message.sender}>
    {message.text}
    <Timestamp sender={message.sender}>{message.timestamp}</Timestamp>
  </Bubble>
);

export default MessageBubble;
