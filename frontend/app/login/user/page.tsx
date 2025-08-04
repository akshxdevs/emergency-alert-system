"use client";
import { getSession, signIn, useSession } from "next-auth/react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSignup, setIsSignup] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedRole, setSelectedRole] = useState("CIVILIAN");
  const router = useRouter();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      await signIn("google", { 
        callbackUrl: "/home",
        redirect: false 
      });
    } catch (error) {
      console.error("Google sign in error:", error);
      setError("Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/v1/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          role: selectedRole,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      // Auto login after successful signup
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Signup successful but login failed. Please try logging in.");
        setIsSignup(false);
        return;
      }

      if (result?.ok) {
        setTimeout(async () => {
          const session = await getSession();
          const userId = session?.user?.id;
          const userRole = session?.user?.role;
          
          console.log("Session:", session);
          
          if (userId) {
            if (userRole === "CIVILIAN") {
              router.push(`/home/${userId}`);
            } else {
              router.push(`/dashboard/${userId}`);
            }
          } else {
            setError("User ID not found in session");
          }
        }, 100);
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      console.log("Attempting login with:", { email, password: "***" });
      
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
        callbackUrl: "/home",
      });

      console.log("SignIn result:", result);

      if (result?.error) {
        console.error("SignIn error:", result.error);
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password. Please check your credentials.");
        } else {
          setError(`Login failed: ${result.error}`);
        }
        return;
      }

      if (result?.ok) {
        console.log("SignIn successful, getting session...");
        setTimeout(async () => {
          try {
            const session = await getSession();
            const userId = session?.user?.id;
            const userRole = session?.user?.role;
            
            console.log("Session:", session);
            
            if (userId) {
              if (userRole === "CIVILIAN") {
                router.push(`/home/${userId}`);
              } else {
                router.push(`/dashboard/${userId}`);
              }
            } else {
              setError("User ID not found in session");
            }
          } catch (sessionError) {
            console.error("Session error:", sessionError);
            setError("Failed to get user session");
          }
        }, 100);
      } else {
        setError("Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#151922] p-8 rounded-3xl shadow-md w-full max-w-sm text-white">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">
            {isSignup ? "Create Account" : "Welcome Back"}
          </h1>
          <p className="text-gray-400 text-sm">
            {isSignup ? "Sign up for a new account" : "Sign in to your account"}
          </p>
        </div>

        {/* Google Sign In Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading}
          onClick={handleGoogleSignIn}
          className="w-full flex items-center justify-center gap-2 bg-white text-black font-medium p-4 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed mb-6"
        >
          <img
            src="https://img.icons8.com/color/16/google-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          {isLoading ? "Signing in..." : "Sign in with Google"}
        </motion.button>

        <div className="my-6 flex items-center justify-between text-gray-500 text-sm">
          <hr className="border-gray-600 w-full" />
          <span className="px-2">or</span>
          <hr className="border-gray-600 w-full" />
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-center text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={isSignup ? handleSignup : handleSubmit} className="space-y-4">
          {/* Role Selection for Signup */}
          {isSignup && (
            <div>
              <label className="text-sm text-gray-400 block mb-1">
                Select Role
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3 py-2 rounded-md bg-transparent border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                <option value="CIVILIAN">Civilian</option>
                <option value="POLICE">Police Officer</option>
                <option value="FIRE">Firefighter</option>
                <option value="MEDICAL">Medical Staff</option>
              </select>
            </div>
          )}

          <div>
            <label htmlFor="email" className="text-sm text-gray-400 block mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 rounded-md bg-transparent border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label htmlFor="password" className="text-sm text-gray-400 block mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-3 py-2 rounded-md bg-transparent border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Confirm Password for Signup */}
          {isSignup && (
            <div>
              <label htmlFor="confirmPassword" className="text-sm text-gray-400 block mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full px-3 py-2 rounded-md bg-transparent border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-[#1e222b] border border-gray-700 text-white py-2 rounded-md hover:bg-[#2a2f3b] transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading 
              ? (isSignup ? "Creating Account..." : "Signing in...") 
              : (isSignup ? "Create Account" : "Sign in with Credentials")
            }
          </motion.button>
        </form>

        {/* Toggle between Login and Signup */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignup(!isSignup);
                setError(null);
                setEmail("");
                setPassword("");
                setConfirmPassword("");
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              {isSignup ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>

        {/* Admin Login Link */}
        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            Are you an admin?{" "}
            <button
              onClick={() => router.push("/login/admin")}
              className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
            >
              Sign in here
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
