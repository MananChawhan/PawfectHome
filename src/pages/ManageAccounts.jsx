import React, { useEffect, useState } from "react"
import axios from "axios"
import { Trash2, Shield } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function ManageAccounts() {
  const [admins, setAdmins] = useState([])
  const [users, setUsers] = useState([])
  const [toast, setToast] = useState(null)

  const token = localStorage.getItem("token")

  // ✅ Show toast
  const showToast = (message, type = "success") => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ✅ Fetch admins
  const fetchAdmins = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/admins", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setAdmins(res.data.admins || [])
    } catch (err) {
      console.error(err)
    }
  }

  // ✅ Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      })
      setUsers(res.data.users || [])
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    fetchAdmins()
    fetchUsers()
  }, [])

  // ✅ Remove admin (demote to user)
  const handleRemoveAdmin = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/remove-admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchAdmins()
      fetchUsers()
      showToast("Admin removed successfully", "success")
    } catch (err) {
      showToast("Failed to remove admin", "error")
    }
  }

  // ✅ Remove user
  const handleRemoveUser = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/auth/remove-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchUsers()
      showToast("User removed successfully", "success")
    } catch (err) {
      showToast("Failed to remove user", "error")
    }
  }

  // ✅ Promote user to admin
  const handlePromoteUser = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/auth/promote-user/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      })
      fetchAdmins()
      fetchUsers()
      showToast("User promoted to admin", "success")
    } catch (err) {
      showToast("Failed to promote user", "error")
    }
  }

  return (
    <div className="max-w-5xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-10">Manage Accounts</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Admins */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Admins</h2>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            {admins.length > 0 ? (
              admins.map((admin) => (
                <div
                  key={admin._id}
                  className="flex justify-between items-center py-3 border-b last:border-0"
                >
                  <span className="font-medium text-gray-800 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" /> {admin.name} ({admin.email})
                  </span>
                  <button
                    onClick={() => handleRemoveAdmin(admin._id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg flex items-center gap-1 transition-all shadow-md"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No admins found</p>
            )}
          </div>
        </div>

        {/* Users */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Users</h2>
          <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
            {users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  className="flex justify-between items-center py-3 border-b last:border-0"
                >
                  <span className="font-medium text-gray-800">{user.name} ({user.email})</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePromoteUser(user._id)}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg shadow-md"
                    >
                      Promote
                    </button>
                    <button
                      onClick={() => handleRemoveUser(user._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg shadow-md"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No users found</p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`fixed bottom-24 left-1/2 transform -translate-x-1/2 px-6 py-4 rounded-xl shadow-xl text-white text-lg font-medium ${
              toast.type === "error" ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
