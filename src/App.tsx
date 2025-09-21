import styled, { createGlobalStyle } from "styled-components";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import ChatWindow from "./components/ChatWindow";
import LoginPage from "./components/LoginPage";
import SignupPage from "./pages/SignUpPage";
import { useAuth } from "./hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";

const GlobalStyle = createGlobalStyle`
  body {
    background: #eaf6f6;
    font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
    margin: 0;
    padding: 0;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`;

const AppContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100vw;
  min-height: 100vh;
  background: #eaf6f6;
`;

function App() {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;

  return (
    <Router basename="/Meva-React-TS/">
      <GlobalStyle />
      <AppContainer>
        <Routes>
          {/* Login */}
          <Route
            path="/"
            element={user ? <Navigate to="/chat" /> : <LoginPage />}
          />

          {/* Signup */}
          <Route
            path="/signup"
            element={user ? <Navigate to="/chat" /> : <SignupPage />}
          />

          {/* Chat */}
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatWindow />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AppContainer>
    </Router>
  );
}

export default App;
