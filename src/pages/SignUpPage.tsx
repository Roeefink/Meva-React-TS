import React, { useState } from "react";
import { Eye, EyeOff, Mail, Lock, UserPlus } from "lucide-react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/Firebase.ts"; // adjust if path is different

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  email?: string;
  password?: string;
}

const SignupPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const validate = (): boolean => {
    const errors: FormErrors = {};
    if (!formData.email) errors.email = "Email is required";
    if (!formData.password) errors.password = "Password is required";
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    if (!validate()) return;
    setLoading(true);
    setMessage("");
    try {
      await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      setMessage("✅ Account created successfully!");
    } catch (error: any) {
      setMessage(`❌ Signup failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Signup</h2>

        <div className="mb-4">
          <div className="flex items-center border rounded-lg px-3">
            <Mail className="text-gray-400 mr-2" size={18} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full py-2 outline-none"
            />
          </div>
          {formErrors.email && (
            <p className="text-red-500 text-sm">{formErrors.email}</p>
          )}
        </div>

        <div className="mb-4">
          <div className="flex items-center border rounded-lg px-3">
            <Lock className="text-gray-400 mr-2" size={18} />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full py-2 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="text-gray-400" size={18} />
              ) : (
                <Eye className="text-gray-400" size={18} />
              )}
            </button>
          </div>
          {formErrors.password && (
            <p className="text-red-500 text-sm">{formErrors.password}</p>
          )}
        </div>

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded-lg flex items-center justify-center"
        >
          <UserPlus className="mr-2" size={18} />
          {loading ? "Creating..." : "Signup"}
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <a href="/" className="text-blue-500 hover:underline">
            Login here
          </a>
        </p>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
  );
};

export default SignupPage;
