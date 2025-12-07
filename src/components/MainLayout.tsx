import { Outlet } from "react-router-dom";
import styled from "styled-components";
import MenuBar from "./MenuBar";

const ChatContainer = styled.div`
  position: relative;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0, 64, 128, 0.08);
  width: 90%;
  max-width: 95vw;
  min-height: 37.5em;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Header = styled.div`
  background: rgb(36, 143, 201);
  color: #fff;
  padding: 12px 20px;
  font-size: 1.3rem;
  font-weight: 600;
  letter-spacing: 1px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
`;

const Body = styled.div`
  flex: 1;
  padding: 20px 16px 0 16px;
  background: rgb(158, 216, 232);
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: hidden;
`;

export default function MainLayout() {
  return (
    <ChatContainer>
      <MenuBar />
      <Header>
        <span style={{ margin: "0 auto" }}>🩺 Meva Medical Assistant 🩺</span>
      </Header>
      <Body>
        <Outlet />
      </Body>
    </ChatContainer>
  );
}

