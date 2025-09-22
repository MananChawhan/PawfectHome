import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function AdoptionConfirmation() {
  const { petId } = useParams();

  return (
    <motion.section
      className="px-6 max-w-4xl mx-auto mt-28 mb-20 text-center"
      initial="hidden"
      animate="visible"
      variants={fadeUp}
    >
      <div className="bg-white rounded-3xl shadow-2xl p-12 space-y-6">
        <div className="flex justify-center">
          <PawPrint className="w-16 h-16 text-yellow-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Adoption Request Submitted!</h1>
        <p className="text-gray-700">
          Thank you for your interest in adopting. Your request for pet ID <strong>{petId}</strong> has been submitted.
        </p>
        <p className="text-gray-700">
          Our adoption team will review your request and get back to you shortly.
        </p>
        <Link
          to="/pets"
          className="inline-block px-6 py-3 bg-green-500 text-white font-semibold rounded-full shadow hover:bg-green-600 transition"
        >
          Browse More Pets
        </Link>
      </div>
    </motion.section>
  );
}
