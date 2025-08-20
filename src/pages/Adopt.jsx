import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useEffect, useState } from "react"

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 10, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
}
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

export default function Adopt() {
  const { id } = useParams()
  const [pet, setPet] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPet() {
      try {
        const res = await fetch(`http://localhost:5000/api/pets/${id}`)
        const data = await res.json()
        setPet(data)
      } catch (error) {
        console.error("Failed to fetch pet:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchPet()
  }, [id])

  if (loading) {
    return (
      <motion.section
        className="px-6 max-w-4xl mx-auto mt-28 mb-20 text-center text-black"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <p className="text-lg font-semibold">Loading pet details...</p>
      </motion.section>
    )
  }

  if (!pet) {
    return (
      <motion.section
        className="px-6 max-w-4xl mx-auto mt-28 mb-20"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-lg p-6 text-center text-black"
          variants={fadeUp}
        >
          <p className="font-bold text-xl">Pet not found.</p>
          <Link
            to="/pets"
            className="mt-4 inline-block px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl shadow hover:bg-orange-700 transition"
          >
            Back to Pets
          </Link>
        </motion.div>
      </motion.section>
    )
  }

  return (
    <motion.section
      className="px-6 max-w-7xl mx-auto mt-28 mb-20 grid lg:grid-cols-2 gap-8"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
        {/* Pet Image */}
        <motion.div
          className="bg-white rounded-2xl shadow-lg overflow-hidden"
          variants={fadeUp}
        >
          <img
            src={pet.image || "https://placehold.co/600x400?text=No+Image"}
            alt={pet.name}
            className="w-full h-96 object-cover"
          />
        </motion.div>

        {/* Pet Details */}
        <motion.div className="space-y-4 text-gray-900" variants={fadeUp}>
          <h2 className="text-3xl font-extrabold text-black">{pet.name}</h2>
          <div className="flex gap-2 flex-wrap">
            <span className="px-3 py-1 text-sm font-semibold bg-orange-700 text-white rounded-full">
              {pet.type}
            </span>
            <span className="px-3 py-1 text-sm font-semibold bg-black text-white rounded-full">
              {pet.gender}
            </span>
            <span className="px-3 py-1 text-sm font-semibold bg-black text-white rounded-full">
              Age: {pet.age}
            </span>
          </div>
          <p className="text-base text-black">{pet.description}</p>
          <ul className="list-disc pl-6 space-y-1 text-black">
            <li>
              <strong className="text-black">Breed:</strong> {pet.breed}
            </li>
            <li>
              <strong className="text-black">Vaccinated:</strong> {pet.vaccinated ? "Yes" : "No"}
            </li>
            <li>
              <strong className="text-black">Neutered:</strong> {pet.neutered ? "Yes" : "No"}
            </li>
            <li>
              <strong className="text-black">Good with:</strong>{" "}
              {Array.isArray(pet.goodWith) && pet.goodWith.length > 0
                ? pet.goodWith.join(", ")
                : "N/A"}
            </li>
          </ul>
          <div className="flex gap-3 pt-4 flex-wrap">
            <button className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl shadow hover:bg-orange-700 transition">
              Start Adoption Request
            </button>
            <Link
              to="/pets"
              className="px-6 py-3 bg-gray-800 text-white font-semibold rounded-xl shadow hover:bg-gray-900 transition"
            >
              Back to Pets
            </Link>
          </div>
          <p className="text-xs text-gray-900 mt-2">
            * Demo only. Adoption flow will connect to backend later.
          </p>
        </motion.div>
      </motion.section>
  )
}