import { Routes, Route, Navigate } from "react-router-dom";
import ChatWindow from "../pages/ChatWindow";
import AboutWindow from "../pages/AboutWindow";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignUpPage";
import { FirebaseTest } from "../components/FirebaseTest";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../components/MainLayout";
import type { User } from "firebase/auth";
import AddInfoPage from "../pages/AddInfoPage";

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

      {/* Main Layout with nested routes */}
      <Route
        path="/chat"
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ChatWindow />} />
        <Route path="about" element={<AboutWindow />} />
        <Route path="add-info" element={<AddInfoPage />} />
      </Route>

      {/* Redirect old routes to new nested structure */}
      <Route path="/about" element={<Navigate to="/chat/about" replace />} />
      <Route path="/add-info" element={<Navigate to="/chat/add-info" replace />} />

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
