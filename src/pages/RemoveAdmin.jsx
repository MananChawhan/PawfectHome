import { useEffect, useState } from "react"

export default function RemoveAdmin() {
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch("https://pawfecthome-4ein.onrender.com/api/auth/admins", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await res.json()

        // ✅ Ensure admins is always an array
        if (Array.isArray(data)) {
          setAdmins(data)
        } else if (Array.isArray(data.admins)) {
          setAdmins(data.admins)
        } else {
          setAdmins([])
        }
      } catch (err) {
        setError("Failed to load admins")
      } finally {
        setLoading(false)
      }
    }

    if (token) {
      fetchAdmins()
    } else {
      setError("No token found. Please login as admin.")
      setLoading(false)
    }
  }, [token])

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this admin?")) return

    try {
      const res = await fetch(
        `https://pawfecthome-4ein.onrender.com/api/auth/remove-admin/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await res.json()
      if (res.ok) {
        alert("✅ Admin removed successfully")
        setAdmins((prev) => prev.filter((admin) => admin._id !== id))
      } else {
        alert(data.message || "❌ Failed to remove admin")
      }
    } catch (err) {
      alert("❌ Error removing admin")
    }
  }

  if (loading) return <p className="text-center mt-10">Loading admins...</p>
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>

  return (
    <div className="max-w-2xl mx-auto mt-16 bg-white shadow-lg rounded-xl p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">Remove Admin</h2>
      {admins.length === 0 ? (
        <p className="text-center text-gray-500">No admins found</p>
      ) : (
        <ul className="space-y-3">
          {admins.map((admin) => (
            <li
              key={admin._id}
              className="flex justify-between items-center p-3 border rounded-lg"
            >
              <div>
                <p className="font-semibold">{admin.email}</p>
                <p className="text-xs text-gray-500">{admin.role}</p>
              </div>
              <button
                onClick={() => handleRemove(admin._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
