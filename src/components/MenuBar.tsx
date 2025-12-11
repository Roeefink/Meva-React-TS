import { useRef, useState } from "react";
import styled from "styled-components";
import { authService } from "@/services/authService";
import { useNavigate } from "react-router-dom"; // ⬅️ import this

const Burger = styled.div`
  position: absolute;
  top: 16px;
  left: 16px;
  width: 1.5em;
  height: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  cursor: pointer;
  z-index: 1001;
`;

const Line = styled.div`
  width: 100%;
  height: 4px;
  background: rgb(244, 248, 249);
  border-radius: 2px;
  transition: all 0.3s;
`;

const Sidebar = styled.div<{ open: boolean }>`
  position: absolute;
  top: 0;
  left: ${({ open }) => (open ? "0" : "-220px")};
  width: 220px;
  height: 100%;
  background: #248fc9;
  color: #fff;
  transition: left 0.3s ease;
  padding: 60px 20px 20px 20px;
  z-index: 1000;
  box-shadow: ${({ open }) => (open ? "2px 0 8px rgba(0,0,0,0.1)" : "none")};
`;

const LogoutButton = styled.button`
  position: absolute;
  bottom: 2em;
  left: 2em;
  right: 2em;
  padding: 10px;
  background: #343639;
  border: none;
  color: white;
  cursor: pointer;
  border-radius: 3em;
`;

export default function MenuBar() {
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate(); // ⬅️ for redirect

  const handleLogout = async () => {
    try {
      await authService.signOut();
      setOpen(false); // close sidebar
      navigate("/"); // redirect to "/" → LoginPage will show (because user=null)
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out ❌");
    }
  };

  return (
    <>
      <Burger
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={(event) => {
          const nextTarget = event.relatedTarget as Node | null;
          if (!sidebarRef.current || !nextTarget) {
            setOpen(false);
            return;
          }
          if (!sidebarRef.current.contains(nextTarget)) {
            setOpen(false);
          }
        }}
      >
        <Line />
        <Line />
        <Line />
      </Burger>
      <Sidebar
        ref={sidebarRef}
        open={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/chat");
              setOpen(false);
            }}
          >
            Home
          </li>
          <br />
          <li
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/chat/about");
              setOpen(false);
            }}
          >
            About
          </li>
          <br />
          <li
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/chat/contact");
              setOpen(false);
            }}
          >
            Contact
          </li>
          <br />
          <li
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/chat/add-info");
              setOpen(false);
            }}
          >
            Add Info
          </li>
        </ul>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Sidebar>
    </>
  );
}
