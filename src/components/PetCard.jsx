import { motion } from "framer-motion";

export default function PetCard({ pet }) {
  return (
    <motion.div
      className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden"
      whileHover={{ scale: 1.03 }}
    >
      <img
        src={
          pet.image && pet.image.trim() !== ""
            ? pet.image
            : "https://placehold.co/400x300?text=No+Image"
        }
        alt={pet.name}
        className="w-full h-48 object-cover"
      />

      <div className="p-4 space-y-2">
        <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
        <p className="text-sm text-gray-600">{pet.breed}</p>
        <p className="text-sm text-gray-500">{pet.age}</p>
        <p className="text-sm text-gray-500 italic">{pet.gender}</p>

        <div className="flex gap-2 mt-2 flex-wrap">
          {pet.vaccinated && (
            <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs">
              Vaccinated
            </span>
          )}
          {pet.neutered && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs">
              Neutered
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}
