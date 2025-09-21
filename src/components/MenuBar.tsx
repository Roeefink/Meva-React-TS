import { useState } from "react";
import styled from "styled-components";
import { signOut } from "firebase/auth";
import { auth } from "../config/Firebase";
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
  const navigate = useNavigate(); // ⬅️ for redirect

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setOpen(false); // close sidebar
      navigate("/"); // redirect to "/" → LoginPage will show (because user=null)
    } catch (error) {
      console.error("Logout error:", error);
      alert("Failed to log out ❌");
    }
  };

  return (
    <>
      <Burger onClick={() => setOpen((o) => !o)}>
        <Line />
        <Line />
        <Line />
      </Burger>
      <Sidebar open={open}>
        <h3>Menu</h3>
        <ul style={{ listStyle: "none", padding: 0 }}>
          <li>Home</li>
          <li>About</li>
          <li>Contact</li>
        </ul>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </Sidebar>
    </>
  );
}
