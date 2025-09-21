import { useState } from "react";
import { auth } from "../config/Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  sendPasswordResetEmail,
} from "firebase/auth";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [rememberMe, setRememberMe] = useState(false);

  // Login / Signup handler
  const handleAuth = async () => {
    try {
      // Set persistence based on Remember me checkbox
      await setPersistence(
        auth,
        rememberMe ? browserLocalPersistence : browserSessionPersistence
      );

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        alert("Logged in ✅");
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Account created 🎉");
      }
    } catch (error: any) {
      alert(error.message);
    }
  };

  // Forgot password handler
  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first");
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      alert("Password reset email sent ✅");
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-64 mx-auto mt-10">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border p-2 rounded"
      />

      {/* Remember me checkbox */}
      <label className="flex items-center gap-2 mt-2">
        <input
          type="checkbox"
          checked={rememberMe}
          onChange={(e) => setRememberMe(e.target.checked)}
        />
        Remember me
      </label>

      {/* Login / Signup button */}
      <button
        onClick={handleAuth}
        className="bg-blue-500 text-white p-2 rounded mt-2"
      >
        {isLogin ? "Login" : "Sign Up"}
      </button>

      {/* Toggle login/signup */}
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="text-sm text-gray-600 mt-2"
      >
        {isLogin
          ? "Need an account? Sign up"
          : "Already have an account? Login"}
      </button>

      {/* Forgot password */}
      {isLogin && (
        <button
          onClick={handleForgotPassword}
          className="text-sm text-blue-500 mt-2 underline"
        >
          Forgot password?
        </button>
      )}
    </div>
  );
}
