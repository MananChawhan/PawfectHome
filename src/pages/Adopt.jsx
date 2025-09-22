import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { PawPrint, Heart, Dog, Users } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Adopt() {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPet() {
      try {
        const res = await fetch(`https://pawfecthome-4ein.onrender.com/api/pets/${id}`);
        const data = await res.json();
        setPet(data);
      } catch (error) {
        console.error("Failed to fetch pet:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPet();
  }, [id]);

  if (loading) {
    return (
      <motion.section
        className="px-6 max-w-4xl mx-auto mt-28 mb-20 text-center text-gray-800"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <p className="text-lg font-medium">Loading pet details...</p>
      </motion.section>
    );
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
          className="bg-white rounded-3xl shadow-xl p-8 text-center"
          variants={fadeUp}
        >
          <p className="font-bold text-2xl mb-4">Pet not found</p>
          <Link
            to="/pets"
            className="inline-block px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg shadow hover:bg-gray-800 transition"
          >
            Back to Pets
          </Link>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="px-6 max-w-7xl mx-auto mt-28 mb-20 space-y-12"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {/* Pet Overview Grid */}
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left: Pet Image */}
        <motion.div
          className="relative rounded-3xl overflow-hidden shadow-lg"
          variants={fadeUp}
          whileHover={{ scale: 1.02 }}
        >
          <img
            src={pet.image || "https://placehold.co/600x400?text=No+Image"}
            alt={pet.name}
            className="w-full h-[450px] object-cover"
          />
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="bg-gray-800/70 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1">
              <PawPrint className="w-4 h-4" /> {pet.type}
            </span>
            <span className="bg-gray-800/70 text-white px-3 py-1 rounded-md text-sm font-medium flex items-center gap-1">
              <Dog className="w-4 h-4" /> {pet.gender}
            </span>
          </div>
        </motion.div>

        {/* Right: Pet Details */}
        <motion.div className="space-y-6 text-gray-900" variants={fadeUp}>
          <h1 className="text-4xl font-extrabold">{pet.name}</h1>
          <p className="text-gray-700 text-lg">{pet.description || "No description available."}</p>

          <div className="flex flex-wrap gap-3">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold shadow-sm">
              Age: {pet.age || "Unknown"}
            </span>
            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold shadow-sm">
              Breed: {pet.breed || "Unknown"}
            </span>
            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold shadow-sm">
              Vaccinated: {pet.vaccinated ? "Yes" : "No"}
            </span>
            <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold shadow-sm">
              Neutered: {pet.neutered ? "Yes" : "No"}
            </span>
            <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-semibold shadow-sm">
              Good With: {pet.goodWith?.length ? pet.goodWith.join(", ") : "N/A"}
            </span>
          </div>

          {/* Adoption Stats Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow border border-gray-100">
              <Heart className="w-6 h-6 text-red-500" />
              <div>
                <p className="font-semibold">{Math.floor(Math.random() * 50 + 50)}</p>
                <p className="text-xs text-gray-600">Happy Adopters</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow border border-gray-100">
              <Users className="w-6 h-6 text-pink-500" />
              <div>
                <p className="font-semibold">{Math.floor(Math.random() * 20 + 10)}</p>
                <p className="text-xs text-gray-600">Volunteers</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Link
              to={`/adopt/${pet._id}/start`}
              className="px-6 py-3 bg-gray-900 text-white font-semibold rounded-lg shadow hover:bg-gray-800 transition"
            >
              Start Adoption Request
            </Link>
            <Link
              to="/pets"
              className="px-6 py-3 bg-gray-100 text-gray-900 font-semibold rounded-lg shadow hover:bg-gray-200 transition"
            >
              Back to Pets
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
