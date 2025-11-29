import { Routes, Route, Navigate } from "react-router-dom";
import ChatWindow from "../pages/ChatWindow";
import AboutWindow from "../pages/AboutWindow";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignUpPage";
import { FirebaseTest } from "../components/FirebaseTest";
import ProtectedRoute from "../components/ProtectedRoute";
import type { User } from "firebase/auth";

interface AppRoutesProps {
  user: User | null;
}

export default function AppRoutes({ user }: AppRoutesProps) {
  return (
    <Routes>
      {/* Firebase Test Route */}
      <Route path="/test-firebase" element={<FirebaseTest />} />

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

      {/* About */}
      <Route
        path="/about"
        element={
          <ProtectedRoute>
            <AboutWindow />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
