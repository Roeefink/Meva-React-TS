import { Routes, Route, Navigate } from "react-router-dom";
import ChatWindow from "../pages/ChatWindow";
import AboutWindow from "../pages/AboutWindow";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignUpPage";
import { SupabaseTest } from "../components/SupabaseTest";
import ProtectedRoute from "../components/ProtectedRoute";
import MainLayout from "../components/MainLayout";
import type { User } from "@supabase/supabase-js";
import AddPatientPage from "../pages/AddPatientPage";
import ContactUsPage from "../pages/ContactUsPage";
import PatientsPage from "../pages/PatientsPage";

interface AppRoutesProps {
  user: User | null;
}

export default function AppRoutes({ user }: AppRoutesProps) {
  return (
    <Routes>
      {/* Supabase Test Route */}
      <Route path="/test-supabase" element={<SupabaseTest />} />

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
        <Route path="contact-us" element={<ContactUsPage />} />
        <Route path="add-patient" element={<AddPatientPage />} />
        <Route path="patients" element={<PatientsPage />} />
      </Route>

      {/* Redirect old routes to new nested structure */}
      <Route path="/about" element={<Navigate to="/chat/about" replace />} />
      <Route path="/add-patient" element={<Navigate to="/chat/add-patient" replace />} />
      <Route path="/contact-us" element={<Navigate to="/chat/contact-us" replace />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
