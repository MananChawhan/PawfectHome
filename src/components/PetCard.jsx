import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function PetCard({ pet }) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow hover:shadow-xl hover:scale-105 transition flex flex-col"
      variants={fadeUp}
    >
      <img
        src={pet.image || "https://placehold.co/600x400?text=No+Image"}
        alt={pet.name || "Pet"}
        className="w-full h-48 object-cover rounded-t-2xl"
      />
      <div className="p-4 flex flex-col flex-grow space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-extrabold">{pet.name}</h3>
          <span className="px-2 py-1 text-xs font-semibold bg-orange-100 text-orange-600 rounded-full">
            {pet.type}
          </span>
        </div>
        <p className="text-sm text-gray-600">{pet.breed}</p>
        <div className="flex items-center justify-between text-sm font-semibold text-gray-700">
          <span>Age: {pet.age}</span>
          <span>Gender: {pet.gender}</span>
        </div>
        <Link
          to={`/adopt/${pet._id}`}   // ✅ using MongoDB _id
          className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow hover:scale-105 transition text-center"
        >
          View & Adopt
        </Link>
      </div>
    </motion.div>
  );
}
