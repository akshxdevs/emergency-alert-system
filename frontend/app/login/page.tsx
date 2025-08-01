"use client";
import { getSession, signIn, useSession } from "next-auth/react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    }).then(()=>{
        setTimeout(async() => {
        const session = await getSession();
        const userId = session?.user?.id
        console.log(session);
        if (userId) {
            router.push(`/home/${userId}`)
        }else{
            console.error("User Id not found in session.");
        }
        }, 100);
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-[#151922] p-8 rounded-3xl shadow-md w-full max-w-sm text-white">
        <button
          onClick={() => signIn("google", { callbackUrl: "/home" })}
          className="w-full flex items-center justify-center gap-2 bg-white text-black font-medium p-4 rounded-lg hover:bg-gray-100 transition"
        >
          <img
            src="https://img.icons8.com/color/16/google-logo.png"
            alt="Google"
            className="w-5 h-5"
          />
          Sign in with Google
        </button>

        <div className="my-6 flex items-center justify-between text-gray-500 text-sm">
          <hr className="border-gray-600 w-full" />
          <span className="px-2">or</span>
          <hr className="border-gray-600 w-full" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 bg-[#1e222b] border border-gray-700 text-white py-2 rounded-md hover:bg-[#2a2f3b] transition"
          >
            Sign in with Credentials
          </button>
        </form>
      </motion.div>
    </div>
  )
}
