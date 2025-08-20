import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

export default function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = (e) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('Please fill in all fields')
      return
    }
    setError('')
    setSuccess(true)

    setName('')
    setEmail('')
    setPassword('')

    setTimeout(() => setSuccess(false), 3000)
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

      <motion.div className="bg-white rounded-2xl shadow p-6 md:p-10 space-y-4 border-2 border-black" variants={fadeUp}>
        <form onSubmit={handleSignup} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && (
            <p className="text-green-600 font-semibold text-center flex items-center justify-center gap-2">
              <span>✔</span> Account created successfully!
            </p>
          )}

          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-gray-700 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-orange-500 hover:underline">
            Login
          </Link>
        </p>
      </motion.div>
    </motion.section>
  )
}
