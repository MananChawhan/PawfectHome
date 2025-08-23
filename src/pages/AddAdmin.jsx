import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { UserPlus, CheckCircle2, XCircle } from "lucide-react"

export default function AddAdmin() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const role = localStorage.getItem("role")
    const token = localStorage.getItem("token")
    if (!token || role !== "admin") {
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
        "https://pawfecthome-4ein.onrender.com/api/auth/add-admin",
        { name, email, password },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      if (res.data) {
        setSuccess("New admin added successfully!")
        setName("")
        setEmail("")
        setPassword("")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add admin.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Card with gradient background */}
      <div className="w-full max-w-md rounded-2xl shadow-xl p-8 bg-gradient-to-br from-orange-50 to-yellow-100">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-full bg-white shadow-md text-orange-600">
            <UserPlus className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Add New Admin</h2>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-4 text-sm p-3 rounded-lg bg-red-50 text-red-600 flex items-center gap-2">
            <XCircle className="w-5 h-5" /> {error}
          </div>
        )}
        {success && (
          <div className="mb-4 text-sm p-3 rounded-lg bg-green-50 text-green-600 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" /> {success}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleAddAdmin} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="Enter full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-lg shadow-md transition disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-5 h-5" />
            {loading ? "Adding..." : "Add Admin"}
          </button>
        </form>
      </div>
    </div>
  )
}
