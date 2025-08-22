import { Link, NavLink } from "react-router-dom"
import { PawPrint, User, ShieldCheck } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function Navbar() {
  const [isShrunk, setIsShrunk] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  // 🚀 Mock auth state (replace with context / redux later)
  const [user, setUser] = useState(null) // null = guest, { role: "user" }, { role: "admin" }

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsShrunk(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Auto close popup when navbar expands
  useEffect(() => {
    if (!isShrunk) setShowPopup(false)
  }, [isShrunk])

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center">
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

        {/* Right Section - User/Auth */}
        {!isShrunk && (
          <div className="flex items-center gap-4">
            {!user ? (
              <>
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
              </>
            ) : (
              <div className="flex items-center gap-3">
                <User className="w-6 h-6 text-yellow-400" />
                <button
                  onClick={() => setUser(null)}
                  className="bg-red-500 text-white font-semibold px-3 py-1 rounded-full hover:bg-red-600 transition"
                >
                  Logout
                </button>
              </div>
            )}
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
                <NavLink to="/admin" className="block hover:text-yellow-400">Admin</NavLink>
              )}
              <button
                onClick={() => setUser(null)}
                className="block w-full text-left hover:text-red-400"
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}
    </header>
  )
}
