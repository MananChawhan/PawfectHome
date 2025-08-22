import { useState } from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}

export default function Signup() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      setLoading(true)
      setError("")
      setSuccess(false)

      const res = await fetch("https://pawfecthome-4ein.onrender.com/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json().catch(() => ({}))

      if (!res.ok) {
        throw new Error(data.message || `Request failed: ${res.status} ${res.statusText}`)
      }

      // ✅ Save token & role
      localStorage.setItem("token", data.token)
      localStorage.setItem("role", data.role)

      setSuccess(true)

      // reset fields
      setName("")
      setEmail("")
      setPassword("")

      // redirect after short delay
      setTimeout(() => {
        navigate(data.role === "admin" ? "/admin" : "/")
      }, 1500)
    } catch (err) {
      console.error("Signup error:", err)
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
        <h2 className="text-3xl md:text-4xl font-extrabold">Sign Up</h2>
        <p className="text-gray-600 mt-2">
          Create a new account to start your pet adoption journey.
        </p>
      </motion.div>

      <motion.div
        className="bg-white rounded-2xl shadow p-6 md:p-10 space-y-4 border-2 border-black"
        variants={fadeUp}
      >
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-orange-400"
          />
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
          {success && (
            <p className="text-green-600 font-semibold text-center flex items-center justify-center gap-2">
              <span>✔</span> Account created successfully!
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition disabled:opacity-50"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-700 mt-4">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-orange-500 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </motion.section>
  )
}
