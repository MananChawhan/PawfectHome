import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar.jsx"
import Footer from "./components/Footer.jsx"
import Home from "./pages/Home.jsx"
import Pets from "./pages/Pets.jsx"
import About from "./pages/About.jsx"
import Contact from "./pages/Contact.jsx"
import Adopt from "./pages/Adopt.jsx"
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup.jsx"
import Admin from "./pages/Admin.jsx"
import ProtectedRoute from "./components/ProtectedRoute.jsx"
import Profile from "./pages/Profile.jsx"
import AddAdmin from "./pages/AddAdmin.jsx"
import RemoveAdmin from "./pages/RemoveAdmin.jsx"

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Main content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-6xl mx-auto w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pets" element={<Pets />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route
            path="/add-admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AddAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/remove-admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <RemoveAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route path="/adopt/:id" element={<Adopt />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>

      <Footer />
    </div>
  )
}
