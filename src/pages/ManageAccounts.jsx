import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Shield, UserPlus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ManageAccounts() {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState(null);

  const token = localStorage.getItem("token");

  // ✅ Show toast
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  // ✅ Fetch admins
  const fetchAdmins = async () => {
    try {
      const res = await axios.get(
        "https://pawfecthome-4ein.onrender.com/api/auth/admins",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAdmins(res.data.admins || []);
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        "https://pawfecthome-4ein.onrender.com/api/auth/users",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAdmins();
    fetchUsers();
  }, []);

  // ✅ Remove admin
  const handleRemoveAdmin = async (id) => {
    try {
      await axios.delete(
        `https://pawfecthome-4ein.onrender.com/api/auth/remove-admin/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAdmins();
      fetchUsers();
      showToast("✅ Admin removed successfully", "success");
    } catch {
      showToast("❌ Failed to remove admin", "error");
    }
  };

  // ✅ Remove user
  const handleRemoveUser = async (id) => {
    try {
      await axios.delete(
        `https://pawfecthome-4ein.onrender.com/api/auth/remove-user/${id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUsers();
      showToast("✅ User removed successfully", "success");
    } catch {
      showToast("❌ Failed to remove user", "error");
    }
  };

  // ✅ Promote user → admin
  const handlePromoteUser = async (id) => {
    try {
      await axios.put(
        `https://pawfecthome-4ein.onrender.com/api/auth/promote-user/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchAdmins();
      fetchUsers();
      showToast("🎉 User promoted to admin", "success");
    } catch {
      showToast("❌ Failed to promote user", "error");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-20 py-12 px-4">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
        ⚡ Manage Accounts
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* ✅ Admins Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
            <Shield className="w-6 h-6 text-blue-600" /> Admins
          </h2>
          {admins.length > 0 ? (
            <div className="space-y-4">
              {admins.map((admin) => (
                <div
                  key={admin._id}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {admin.name || "Unnamed"}
                    </span>
                    <span className="text-sm text-gray-500">{admin.email}</span>
                    <span className="text-xs mt-1 px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 w-fit">
                      Admin
                    </span>
                  </div>
                  <button
                    onClick={() => handleRemoveAdmin(admin._id)}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-md"
                  >
                    <Trash2 className="w-4 h-4" /> Remove
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No admins found</p>
          )}
        </motion.div>

        {/* ✅ Users Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200"
        >
          <h2 className="text-2xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
            👥 Users
          </h2>
          {users.length > 0 ? (
            <div className="space-y-4">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="flex justify-between items-center p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex flex-col">
                    <span className="font-medium text-gray-800">
                      {user.name || "Unnamed"}
                    </span>
                    <span className="text-sm text-gray-500">{user.email}</span>
                    <span className="text-xs mt-1 px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 w-fit">
                      User
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handlePromoteUser(user._id)}
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition"
                    >
                      <UserPlus className="w-4 h-4" /> Promote
                    </button>
                    <button
                      onClick={() => handleRemoveUser(user._id)}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-md transition"
                    >
                      <Trash2 className="w-4 h-4" /> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No users found</p>
          )}
        </motion.div>
      </div>

      {/* ✅ Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-4 rounded-xl shadow-xl text-white text-lg font-medium ${
              toast.type === "error" ? "bg-red-600" : "bg-green-600"
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
