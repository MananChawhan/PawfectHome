import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export default function AddAdmin() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  // 🚨 Only admins can access this page
  useEffect(() => {
    const role = localStorage.getItem("role")
    const token = localStorage.getItem("token")

    if (!token || role !== "admin") {
      // clear storage if non-admin sneaks in
      localStorage.removeItem("token")
      localStorage.removeItem("role")
      navigate("/login") 
    }
  }, [navigate])

  const handleAddAdmin = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const token = localStorage.getItem("token")

      const res = await axios.post(
        "https://pawfecthome-4ein.onrender.com/api/auth/add-admin", // ✅ use proper endpoint
        { name, email, password }, // role not needed, backend enforces "admin"
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (res.data) {
        setSuccess("✅ New admin added successfully!")
        setName("")
        setEmail("")
        setPassword("")
      }
    } catch (err) {
      setError(err.response?.data?.message || "❌ Failed to add admin.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Add New Admin</h2>

      {error && <div className="mb-4 text-red-500">{error}</div>}
      {success && <div className="mb-4 text-green-500">{success}</div>}

      <form onSubmit={handleAddAdmin} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="border px-3 py-2 rounded-lg w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border px-3 py-2 rounded-lg w-full"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border px-3 py-2 rounded-lg w-full"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-300 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Admin"}
        </button>
      </form>
    </div>
  )
}
