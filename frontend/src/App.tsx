import styled, { createGlobalStyle } from "styled-components";
import { BrowserRouter as Router } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import AppRoutes from "./routes";

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
        <AppRoutes user={user} />
      </AppContainer>
    </Router>
  );
}

export default App;
