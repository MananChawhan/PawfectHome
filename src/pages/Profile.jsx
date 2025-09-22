import { useState, useEffect } from "react"

export default function Profile() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [role, setRole] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")

  useEffect(() => {
    // Load user from localStorage
    const storedName = localStorage.getItem("name") || ""
    const storedEmail = localStorage.getItem("email") || ""
    const storedRole = localStorage.getItem("role") || ""
    const storedAvatar = localStorage.getItem("avatarUrl") || ""

    setName(storedName)
    setEmail(storedEmail)
    setRole(storedRole)
    setAvatarUrl(storedAvatar)
  }, [])

  const handleSave = () => {
    localStorage.setItem("name", name)
    localStorage.setItem("email", email)
    localStorage.setItem("role", role)
    if (avatarUrl) {
      localStorage.setItem("avatarUrl", avatarUrl)
    }

    // 🚀 Tell floating avatar to refresh immediately
    window.dispatchEvent(new Event("userChanged"))

    alert("✅ Profile updated!")
  }

  return (
    <div className="max-w-lg mx-auto mt-20 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-yellow-400 mb-3">
          {avatarUrl ? (
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-yellow-400 flex items-center justify-center text-3xl font-bold">
              {name ? name[0] : "?"}
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder="Paste Image URL"
          value={avatarUrl}
          onChange={(e) => setAvatarUrl(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full"
        />
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border px-3 py-2 rounded-lg w-full"
        />
      </div>

      {/* Email */}
      <div className="mb-4">
        <label className="block font-medium mb-1">Email</label>
        <input
          type="email"
          value={email}
          readOnly
          className="border px-3 py-2 rounded-lg w-full bg-gray-100 cursor-not-allowed"
        />
      </div>

      {/* Role */}
      <div className="mb-6">
        <label className="block font-medium mb-1">Role</label>
        <input
          type="text"
          value={role}
          readOnly
          className="border px-3 py-2 rounded-lg w-full bg-gray-100 cursor-not-allowed capitalize"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-yellow-400 text-black font-semibold py-2 rounded-lg hover:bg-yellow-300"
      >
        Save Changes
      </button>
    </div>
  )
}
