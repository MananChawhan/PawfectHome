import { Link, NavLink, useNavigate } from "react-router-dom"
import {
  Home,
  HeartHandshake,
  Info,
  Mail,
  LogIn,
  PawPrint,
  ShieldCheck,
  User as UserIcon,
  Settings,
  LogOut,
  UserPlus,
  UserMinus,
} from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isShrunk, setIsShrunk] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  // Load user
  useEffect(() => {
    const loadUser = () => {
      const token = localStorage.getItem("token")
      const role = localStorage.getItem("role")
      const email = localStorage.getItem("email")
      const name = localStorage.getItem("name")
      const avatarUrl = localStorage.getItem("avatarUrl")

      if (token && role) {
        setUser({
          role,
          email,
          name: name || email?.split("@")[0] || "User",
          avatarUrl,
        })
      } else setUser(null)
    }
    loadUser()
    window.addEventListener("userChanged", loadUser)
    return () => window.removeEventListener("userChanged", loadUser)
  }, [])

  // Scroll shrink
  useEffect(() => {
    const handleScroll = () => setIsShrunk(window.scrollY > 50)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (!isShrunk) setShowPopup(false)
  }, [isShrunk])

  const handleLogout = () => {
    localStorage.clear()
    setUser(null)
    setShowUserMenu(false)
    window.dispatchEvent(new Event("userChanged"))
    navigate("/login")
  }

  const getAvatarLetter = () =>
    user?.name?.[0]?.toUpperCase() ||
    user?.email?.[0]?.toUpperCase() ||
    user?.role?.[0]?.toUpperCase() ||
    "?"

  return (
    <>
      {/* Floating Avatar Menu */}
      {user && (
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            aria-label="Open user menu"
            className="w-12 h-12 rounded-full overflow-hidden shadow-md border-2 border-yellow-400 hover:scale-105 transition"
          >
            {user.avatarUrl ? (
              <img src={user.avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-yellow-400 flex items-center justify-center text-black font-bold uppercase">
                {getAvatarLetter()}
              </div>
            )}
          </button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-3 w-72 max-w-[85vw] bg-white/90 backdrop-blur-md text-black rounded-2xl shadow-xl p-4 space-y-3 border border-gray-200"
              >
                {/* Profile Header */}
                <div className="flex items-center gap-3 border-b pb-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-400 flex items-center justify-center overflow-hidden">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt="User Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-bold text-lg">{getAvatarLetter()}</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold truncate">{user.name}</div>
                    <div className="text-sm text-gray-500 truncate">{user.email}</div>
                    <div className="text-xs text-gray-400 capitalize">Role: {user.role}</div>
                  </div>
                </div>

                {/* Links */}
                <div className="space-y-2">
                  <NavLink
                    to="/profile"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-yellow-50 hover:text-yellow-600 transition"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <UserIcon className="w-4 h-4" /> Profile
                  </NavLink>

                  <NavLink
                    to="/settings"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-yellow-50 hover:text-yellow-600 transition"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Settings className="w-4 h-4" /> Settings
                  </NavLink>

                  {user.role === "admin" && (
                    <>
                      <NavLink
                        to="/admin"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-yellow-50 hover:text-yellow-600 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <ShieldCheck className="w-4 h-4 text-yellow-600" /> Admin Dashboard
                      </NavLink>
                      <NavLink
                        to="/add-admin"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-50 hover:text-green-600 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserPlus className="w-4 h-4 text-green-600" /> Add Admin
                      </NavLink>
                      <NavLink
                        to="/manage-accounts"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <UserMinus className="w-4 h-4 text-red-600" /> Manage Accounts
                      </NavLink>
                    </>
                  )}

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-600 w-full transition"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Main Navbar */}
      <header className="fixed top-4 left-0 right-0 z-40 flex justify-center">
        <motion.nav
          role="navigation"
          aria-label="Main Navigation"
          initial={false}
          animate={{
            width: isShrunk ? 64 : "90%",
            maxWidth: isShrunk ? "64px" : "950px",
            height: 64,
            borderRadius: 9999,
            padding: isShrunk ? "0px" : "0 24px",
            justifyContent: isShrunk ? "center" : "space-between",
            left: isShrunk ? "1rem" : "50%",
            x: isShrunk ? 0 : "-50%",
          }}
          transition={{ type: "spring", stiffness: 90, damping: 18 }}
          className="absolute bg-white/90 backdrop-blur-lg border border-white/30 flex items-center shadow-xl w-[90%] max-w-[950px]"
        >
          {/* Left - Logo */}
          <button
            type="button"
            aria-label={isShrunk ? "Open quick menu" : "Go to home"}
            className="flex items-center gap-2 cursor-pointer px-3"
            onClick={() => isShrunk && setShowPopup(!showPopup)}
          >
            <PawPrint className="w-7 h-7 text-yellow-400 flex-shrink-0" />
            {!isShrunk && (
              <Link to="/" className="text-gray-800 font-bold text-base sm:text-lg hover:text-yellow-500 truncate">
                PawfectHome
              </Link>
            )}
          </button>

          {/* Center + Right (single scrollable row, only when not shrunk) */}
          {!isShrunk && (
            <div className="flex items-center gap-4 sm:gap-6 flex-1 min-w-0 overflow-x-auto whitespace-nowrap pr-3">
              {/* Center Links */}
              <nav className="flex items-center gap-4 sm:gap-6 text-gray-800 font-medium">
                {[
                  { to: "/", label: "Home", icon: Home },
                  { to: "/pets", label: "Pets", icon: PawPrint },
                  { to: "/adoptions", label: "Adoptions", icon: HeartHandshake },
                  { to: "/about", label: "About", icon: Info },
                  { to: "/contact", label: "Contact", icon: Mail },
                ].map(({ to, label, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    className={({ isActive }) =>
                      `flex items-center gap-1 text-sm sm:text-base hover:text-yellow-500 transition ${
                        isActive ? "text-yellow-500 font-semibold" : ""
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" /> {label}
                  </NavLink>
                ))}

                {user?.role === "admin" && (
                  <NavLink
                    to="/admin"
                    className="flex items-center gap-1 text-sm sm:text-base hover:text-yellow-500 transition"
                  >
                    <ShieldCheck className="w-4 h-4" /> Admin
                  </NavLink>
                )}
              </nav>

              {/* Right - Auth Buttons (kept as-is, just tighter on small screens) */}
              {!user && (
                <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0 ml-auto">
                  <Link
                    to="/login"
                    className="bg-yellow-400 text-black font-semibold px-4 sm:px-5 py-2 rounded-full shadow hover:bg-yellow-300 transition text-sm sm:text-base"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="text-gray-800 font-semibold hover:text-yellow-500 transition text-sm sm:text-base"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          )}
        </motion.nav>

        {/* Popup when Shrunk (unchanged behavior) */}
        {isShrunk && showPopup && (
          <div className="absolute top-20 left-4 bg-white/95 backdrop-blur-md shadow-xl rounded-2xl p-3 w-[85vw] max-w-[320px] border border-gray-200 space-y-2">
            {[
              { to: "/", label: "Home", icon: Home, color: "text-yellow-600" },
              { to: "/pets", label: "Pets", icon: PawPrint, color: "text-yellow-600" },
              { to: "/adoptions", label: "Adoptions", icon: HeartHandshake, color: "text-yellow-600" },
              { to: "/about", label: "About", icon: Info, color: "text-yellow-600" },
              { to: "/contact", label: "Contact", icon: Mail, color: "text-yellow-600" },
            ].map(({ to, label, icon: Icon, color }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setShowPopup(false)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-yellow-50 hover:text-yellow-600 transition"
              >
                <Icon className={`w-4 h-4 ${color}`} /> {label}
              </NavLink>
            ))}

            {!user ? (
              <>
                <NavLink
                  to="/login"
                  onClick={() => setShowPopup(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-50 hover:text-green-600 transition"
                >
                  <LogIn className="w-4 h-4 text-green-600" /> Login
                </NavLink>
                <NavLink
                  to="/signup"
                  onClick={() => setShowPopup(false)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-blue-50 hover:text-blue-600 transition"
                >
                  <UserPlus className="w-4 h-4 text-blue-600" /> Sign Up
                </NavLink>
              </>
            ) : (
              <>
                {user?.role === "admin" && (
                  <>
                    <NavLink
                      to="/admin"
                      onClick={() => setShowPopup(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-yellow-50 hover:text-yellow-600 transition"
                    >
                      <ShieldCheck className="w-4 h-4 text-yellow-600" /> Admin Dashboard
                    </NavLink>
                    <NavLink
                      to="/add-admin"
                      onClick={() => setShowPopup(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-green-50 hover:text-green-600 transition"
                    >
                      <UserPlus className="w-4 h-4 text-green-600" /> Add Admin
                    </NavLink>
                    <NavLink
                      to="/manage-accounts"
                      onClick={() => setShowPopup(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 hover:text-red-600 transition"
                    >
                      <UserMinus className="w-4 h-4 text-red-600" /> Manage Accounts
                    </NavLink>
                  </>
                )}
                <button
                  onClick={() => {
                    handleLogout()
                    setShowPopup(false)
                  }}
                  className="flex items-center gap-2 px-3 py-2 w-full rounded-xl hover:bg-red-50 text-red-500 hover:text-red-600 transition"
                >
                  <LogOut className="w-4 h-4 text-red-600" /> Logout
                </button>
              </>
            )}
          </div>
        )}
      </header>
    </>
  )
}
