import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

export default function Login() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      setLoading(true)
      setError("")

      const res = await fetch("https://pawfecthome-4ein.onrender.com/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || `Request failed: ${res.status} ${res.statusText}`)
      }

      // ✅ Save all details
      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.role)
      localStorage.setItem("email", data.email)
      if (data.name) localStorage.setItem("name", data.name) // backend should send this

      // 🚀 Tell Navbar avatar to refresh immediately
      window.dispatchEvent(new Event("userChanged"))

      // ✅ Redirect based on role
      if (data.role === "admin") {
        navigate("/admin")
      } else {
        navigate("/")
      }
    } catch (err) {
      console.error("Login error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.section
      className="px-6 max-w-md mx-auto mt-28 mb-20 space-y-8"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
    >
      <motion.div className="text-center" variants={fadeUp}>
        <h2 className="text-3xl md:text-4xl font-extrabold">Login</h2>
        <p className="text-gray-600 mt-2">Enter your credentials to access your account.</p>
      </motion.div>

      <motion.div
        className="bg-white rounded-2xl shadow p-6 md:p-10 space-y-4 border-2 border-black"
        variants={fadeUp}
      >
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-400"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-400"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-700 mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="font-bold text-orange-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </motion.div>
    </motion.section>
  )
}
