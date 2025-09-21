import { useState } from "react";
import { auth } from "../config/Firebase.ts";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = async () => {
    try {
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
      <button
        onClick={handleAuth}
        className="bg-blue-500 text-white p-2 rounded"
      >
        {isLogin ? "Login" : "Sign Up"}
      </button>
      <button
        onClick={() => setIsLogin(!isLogin)}
        className="text-sm text-gray-600"
      >
        {isLogin
          ? "Need an account? Sign up"
          : "Already have an account? Login"}
      </button>
    </div>
  );
}
