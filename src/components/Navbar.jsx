import { Link, NavLink } from "react-router-dom"
import { PawPrint } from "lucide-react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"

export default function Navbar() {
  const [isShrunk, setIsShrunk] = useState(false)
  const [showPopup, setShowPopup] = useState(false)

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsShrunk(true)
      } else {
        setIsShrunk(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // ✅ Close popup automatically when navbar expands back
  useEffect(() => {
    if (!isShrunk) {
      setShowPopup(false)
    }
  }, [isShrunk])

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center">
      <motion.nav
        role="navigation"
        aria-label="Main Navigation"
        initial={false} // ✅ no animation on first load
        animate={{
          width: isShrunk ? 64 : "90%",
          maxWidth: isShrunk ? "64px" : "720px",
          height: 64,
          borderRadius: 9999,
          padding: isShrunk ? "0px" : "0 20px",
          justifyContent: isShrunk ? "center" : "space-between",
          left: isShrunk ? "1rem" : "50%",
          x: isShrunk ? 0 : "-50%",
        }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 20,
        }}
        className="absolute bg-black/20 backdrop-blur-md 
                   border border-white/20 flex items-center 
                   shadow-lg"
      >
        {/* Left Section - Logo + Name */}
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

        {/* Center Links (only visible when expanded) */}
        {!isShrunk && (
          <nav className="flex items-center gap-6 text-white font-medium">
            <NavLink to="/" className="hover:text-yellow-400">Home</NavLink>
            <NavLink to="/Pets" className="hover:text-yellow-400">Pets</NavLink>
            <NavLink to="/about" className="hover:text-yellow-400">About</NavLink>
            <NavLink to="/contact" className="hover:text-yellow-400">Contact</NavLink>
          </nav>
        )}

        {/* Right Section - Login Button (only when expanded) */}
        {!isShrunk && (
          <Link
            to="/login"
            className="bg-yellow-400 text-black font-semibold px-4 py-2 rounded-full 
                       hover:bg-yellow-300 transition"
          >
            Login
          </Link>
        )}
      </motion.nav>

      {/* Popup Menu when Shrunk */}
      {isShrunk && showPopup && (
        <div
          className="absolute top-20 left-4 bg-black/20 text-white 
                     p-4 rounded-xl shadow-lg space-y-3 w-40 border border-white/20"
        >
          <NavLink to="/" className="block hover:text-yellow-400">Home</NavLink>
          <NavLink to="/Pets" className="block hover:text-yellow-400">Pets</NavLink>
          <NavLink to="/contact" className="block hover:text-yellow-400">Contact</NavLink>
          <NavLink to="/about" className="block hover:text-yellow-400">About</NavLink>
          <NavLink to="/login" className="block hover:text-yellow-400">Login</NavLink>
        </div>
      )}
    </header>
  )
}
