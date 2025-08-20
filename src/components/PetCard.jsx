import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function PetCard({ pet }) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow-md hover:shadow-xl hover:scale-105 transition flex flex-col overflow-hidden"
      variants={fadeUp}
    >
      {/* Pet Image */}
      <img
        src={pet.image || "https://placehold.co/600x400?text=No+Image"}
        alt={pet.name || "Pet"}
        className="w-full h-56 object-cover"
      />

      {/* Pet Info */}
      <div className="p-5 flex flex-col flex-grow space-y-3 text-gray-800">
        {/* Name + Type */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold text-gray-900">{pet.name}</h3>
          <span className="px-3 py-1 text-xs font-bold bg-orange-600 text-white rounded-full">
            {pet.type}
          </span>
        </div>

        {/* Breed */}
        <p className="text-sm text-gray-600">{pet.breed}</p>

        {/* Age + Gender */}
        <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
          <span className="px-2 py-0.5 rounded bg-green-100 text-green-700">
            Age: {pet.age}
          </span>
          <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700">
            {pet.gender}
          </span>
        </div>

        {/* Button */}
        <Link
          to={`/adopt/${pet._id}`}
          className="mt-4 px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg shadow hover:bg-orange-700 hover:scale-105 transition text-center"
        >
          View & Adopt
        </Link>
      </div>
    </motion.div>
  )
}
