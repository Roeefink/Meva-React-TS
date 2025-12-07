import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { auth } from "../config/Firebase.ts";
import {
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Link } from "react-router-dom";
import Icon from "../components/Icon.tsx";
import SignInBtn from "../components/SignInBtn.tsx";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const LoginScreen: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Set persistence based on "Remember me"
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      alert("Logged in successfully ✅");
      setFormData({ email: "", password: "" });
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        alert("No user found with this email. Try signing up.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else {
        alert(error.message);
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      alert("Please enter your email first");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, formData.email);
      alert("Password reset email sent ✅");
    } catch (error: any) {
      if (error.code === "auth/user-not-found") {
        alert("No account found with this email.");
      } else {
        alert(error.message);
      }
      console.error(error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSubmit();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Icon />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none ${
                    errors.email
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors outline-none ${
                    errors.password
                      ? "border-red-300 focus:ring-red-500 focus:border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center focus:outline-none"
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded focus:ring-2"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium focus:outline-none focus:underline"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <SignInBtn onClick={handleSubmit} isLoading={isLoading} />
          </div>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-500 hover:underline">
                Signup here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
