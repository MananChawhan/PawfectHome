import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RemoveAdmin() {
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState(null);
  const token = localStorage.getItem("token");

  // Fetch admins + users
  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch("https://pawfecthome-4ein.onrender.com/api/auth/admins", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data.admins)) setAdmins(data.admins);
      } catch (err) {
        console.error("Failed to load admins", err);
      }
    };

    const fetchUsers = async () => {
      try {
        const res = await fetch("https://pawfecthome-4ein.onrender.com/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (Array.isArray(data.users)) setUsers(data.users);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };

    if (token) {
      fetchAdmins();
      fetchUsers();
    }
  }, [token]);

  // Remove admin
  const handleRemoveAdmin = async (id) => {
    try {
      const res = await fetch(
        `https://pawfecthome-4ein.onrender.com/api/auth/remove-admin/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setAdmins(admins.filter((a) => a._id !== id));
        showToast("✅ Admin removed successfully", "success");
      } else {
        showToast(data.message || "❌ Failed to remove admin", "error");
      }
    } catch (err) {
      showToast("❌ Server error", "error");
    }
  };

  // Remove user
  const handleRemoveUser = async (id) => {
    try {
      const res = await fetch(
        `https://pawfecthome-4ein.onrender.com/api/auth/remove-user/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (res.ok) {
        setUsers(users.filter((u) => u._id !== id));
        showToast("✅ User removed successfully", "success");
      } else {
        showToast(data.message || "❌ Failed to remove user", "error");
      }
    } catch (err) {
      showToast("❌ Server error", "error");
    }
  };

  // Toast
  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="space-y-16">
      {/* Admin Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          🛠 Manage Admins
        </h2>
        {admins.length === 0 ? (
          <p className="text-center text-gray-500">No admins found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {admins.map((admin) => (
              <div
                key={admin._id}
                className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition p-4 flex flex-col justify-between"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-medium">{admin.email}</span>
                </div>
                <span className="text-sm text-gray-500 uppercase">
                  {admin.role}
                </span>
                <button
                  onClick={() => handleRemoveAdmin(admin._id)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Remove Admin
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* User Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">
          👥 Manage Users
        </h2>
        {users.length === 0 ? (
          <p className="text-center text-gray-500">No users found</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="border border-gray-200 rounded-2xl shadow-sm hover:shadow-lg transition p-4 flex flex-col justify-between"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-medium">{user.email}</span>
                </div>
                <span className="text-sm text-gray-500 uppercase">
                  {user.role}
                </span>
                <button
                  onClick={() => handleRemoveUser(user._id)}
                  className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  Remove User
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Toast */}
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
