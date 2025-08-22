import { Link, NavLink, useNavigate } from "react-router-dom"
import { PawPrint, ShieldCheck, User as UserIcon, Settings, LogOut, UserPlus } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function Navbar() {
  const [isShrunk, setIsShrunk] = useState(false)
  const [showPopup, setShowPopup] = useState(false) // Pawprint popup
  const [showUserMenu, setShowUserMenu] = useState(false) // User avatar popup

  // 🚀 Auth state
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Load user from localStorage
  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem("token")
      const role = localStorage.getItem("role")
      const email = localStorage.getItem("email")
      const name = localStorage.getItem("name")
      const avatarUrl = localStorage.getItem("avatarUrl")

      if (token && role) {
        setUser({ role, email, name, avatarUrl })
      } else {
        setUser(null)
      }
    }

    loadUser()

    // 🔥 Custom event listener for login/logout changes
    window.addEventListener("userChanged", loadUser)

    return () => window.removeEventListener("userChanged", loadUser)
  }, [])

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto close pawprint popup when navbar expands
  useEffect(() => {
    if (!isShrunk) setShowPopup(false)
  }, [isShrunk])

  // Logout
  const handleLogout = () => {
    localStorage.clear()
    setUser(null)
    setShowUserMenu(false)
    window.dispatchEvent(new Event("userChanged")) // 🔥 Tell Navbar to update
    navigate("/login")
  }

  return (
    <>
      {/* ✅ Floating User Avatar (Top-Right Corner) */}
      {user && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="w-12 h-12 rounded-full overflow-hidden shadow-lg"
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-yellow-400 flex items-center justify-center 
                              text-black font-bold uppercase">
                {user.role ? user.role[0] : "?"}
              </div>
            )}
          </button>

          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white text-black rounded-xl shadow-lg p-4 space-y-3">
              {/* 👤 Profile Header */}
              <div className="flex items-center gap-3 border-b pb-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-yellow-400 flex items-center justify-center">
                  {user.avatarUrl ? (
                    <img
                      src={user.avatarUrl}
                      alt="User Avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-bold text-lg uppercase">{user.name ? user.name[0] : "?"}</span>
                  )}
                </div>
                <div>
                  <div className="font-semibold">{user.name || "User"}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="text-xs text-gray-400 capitalize">Role: {user.role}</div>
                </div>
              </div>

              {/* 🔗 Menu Links */}
              <div className="space-y-2">
                <NavLink
                  to="/profile"
                  className="flex items-center gap-2 text-sm hover:text-yellow-500"
                  onClick={() => setShowUserMenu(false)}
                >
                  <UserIcon className="w-4 h-4" /> Profile
                </NavLink>

                <NavLink
                  to="/settings"
                  className="flex items-center gap-2 text-sm hover:text-yellow-500"
                  onClick={() => setShowUserMenu(false)}
                >
                  <Settings className="w-4 h-4" /> Settings
                </NavLink>

                {/* ✅ Admin-only options */}
                {user.role === "admin" && (
                  <>
                    <NavLink
                      to="/admin"
                      className="flex items-center gap-2 text-sm hover:text-yellow-500"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <ShieldCheck className="w-4 h-4" /> Admin Dashboard
                    </NavLink>

                    <NavLink
                      to="/add-admin"
                      className="flex items-center gap-2 text-sm hover:text-yellow-500"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <UserPlus className="w-4 h-4" /> Add Admin
                    </NavLink>
                  </>
                )}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 w-full"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ✅ PawPrint Navbar */}
      <header className="fixed top-4 left-0 right-0 z-40 flex justify-center">
        <motion.nav
          role="navigation"
          aria-label="Main Navigation"
          initial={false}
          animate={{
            width: isShrunk ? 64 : "90%",
            maxWidth: isShrunk ? "64px" : "900px",
            height: 64,
            borderRadius: 9999,
            padding: isShrunk ? "0px" : "0 20px",
            justifyContent: isShrunk ? "center" : "space-between",
            left: isShrunk ? "1rem" : "50%",
            x: isShrunk ? 0 : "-50%",
          }}
          transition={{ type: "spring", stiffness: 80, damping: 20 }}
          className="absolute bg-black/20 backdrop-blur-md border border-white/20 
                     flex items-center shadow-lg"
        >
          {/* Left Section - Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => isShrunk && setShowPopup(!showPopup)}
          >
            <PawPrint className="w-7 h-7 text-yellow-400" />
            {!isShrunk && (
              <Link to="/" className="text-white font-bold text-lg hover:text-yellow-400">
                PawfectHome
              </Link>
            )}
          </div>

          {/* Center Links */}
          {!isShrunk && (
            <nav className="flex items-center gap-6 text-white font-medium">
              <NavLink to="/" className="hover:text-yellow-400">Home</NavLink>
              <NavLink to="/pets" className="hover:text-yellow-400">Pets</NavLink>
              <NavLink to="/adoptions" className="hover:text-yellow-400">Adoptions</NavLink>
              <NavLink to="/about" className="hover:text-yellow-400">About</NavLink>
              <NavLink to="/contact" className="hover:text-yellow-400">Contact</NavLink>
              {user?.role === "admin" && (
                <NavLink to="/admin" className="hover:text-yellow-400 flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" /> Admin
                </NavLink>
              )}
            </nav>
          )}

          {/* Right Section (only for guests) */}
          {!isShrunk && !user && (
            <div className="flex items-center gap-4">
              <Link
                to="/login"
                className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full 
                           hover:bg-yellow-300 transition"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="text-white font-semibold hover:text-yellow-400"
              >
                Sign Up
              </Link>
            </div>
          )}
        </motion.nav>

        {/* Popup Menu when Shrunk */}
        {isShrunk && showPopup && (
          <div
            className="absolute top-20 left-4 bg-black/20 text-white 
                       p-4 rounded-xl shadow-lg space-y-3 w-44 border border-white/20"
          >
            <NavLink to="/" className="block hover:text-yellow-400">Home</NavLink>
            <NavLink to="/pets" className="block hover:text-yellow-400">Pets</NavLink>
            <NavLink to="/adoptions" className="block hover:text-yellow-400">Adoptions</NavLink>
            <NavLink to="/about" className="block hover:text-yellow-400">About</NavLink>
            <NavLink to="/contact" className="block hover:text-yellow-400">Contact</NavLink>

            {!user ? (
              <>
                <NavLink to="/login" className="block hover:text-yellow-400">Login</NavLink>
                <NavLink to="/signup" className="block hover:text-yellow-400">Sign Up</NavLink>
              </>
            ) : (
              <>
                {user?.role === "admin" && (
                  <>
                    <NavLink to="/admin" className="block hover:text-yellow-400">Admin</NavLink>
                    <NavLink to="/add-admin" className="block hover:text-yellow-400">Add Admin</NavLink>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-left hover:text-red-400"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        )}
      </header>
    </>
  )
}
