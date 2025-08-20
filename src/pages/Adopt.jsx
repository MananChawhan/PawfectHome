import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import pets from '../data/pets.json'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

export default function Adopt() {
  const { id } = useParams()
  const pet = pets.find(p => String(p.id) === String(id))

  if (!pet) {
    return (
      <motion.section
        className="px-6 max-w-4xl mx-auto mt-28 mb-20"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div className="bg-white rounded-2xl shadow p-6 text-center" variants={fadeUp}>
          <p className="font-semibold text-lg">Pet not found.</p>
          <Link
            to="/pets"
            className="mt-4 inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl shadow hover:bg-orange-600 transition"
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
      <motion.div className="bg-white rounded-2xl shadow overflow-hidden" variants={fadeUp}>
        <img src={pet.image} alt={pet.name} className="w-full h-full object-cover rounded-2xl" />
      </motion.div>

      {/* Pet Details */}
      <motion.div className="space-y-4" variants={fadeUp}>
        <h2 className="text-3xl font-extrabold">{pet.name}</h2>
        <div className="flex gap-2 flex-wrap">
          <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-600 rounded-full">{pet.type}</span>
          <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-600 rounded-full">{pet.gender}</span>
          <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-600 rounded-full">Age: {pet.age}</span>
        </div>
        <p className="text-gray-700">{pet.description}</p>
        <ul className="list-disc pl-6 space-y-1 text-gray-700">
          <li><strong>Breed:</strong> {pet.breed}</li>
          <li><strong>Vaccinated:</strong> {pet.vaccinated ? 'Yes' : 'No'}</li>
          <li><strong>Neutered:</strong> {pet.neutered ? 'Yes' : 'No'}</li>
          <li><strong>Good with:</strong> {pet.goodWith.join(', ')}</li>
        </ul>
        <div className="flex gap-3 pt-4 flex-wrap">
          <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl shadow hover:bg-orange-600 transition">
            Start Adoption Request
          </button>
          <Link
            to="/pets"
            className="px-6 py-3 bg-gray-200 text-gray-700 font-semibold rounded-xl shadow hover:bg-gray-300 transition"
          >
            Back to Pets
          </Link>
        </div>
        <p className="text-xs text-gray-500 mt-2">* Demo only. Adoption flow will connect to backend later.</p>
      </motion.div>
    </motion.section>
  )
}
