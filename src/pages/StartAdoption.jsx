import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PawPrint } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

// StepContent Component
function StepContent({ step, formData, handleChange, pet }) {
  const inputClass =
    "w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition";
  switch (step) {
    case 1:
      return (
        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-900">Your Details</h2>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className={inputClass}
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className={inputClass}
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className={inputClass}
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            className={inputClass}
          />
        </div>
      );
    case 2:
      return (
        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-900">Household Info</h2>
          <select
            name="residenceType"
            value={formData.residenceType}
            onChange={handleChange}
            className={inputClass}
          >
            <option value="">Select Residence Type</option>
            <option value="House">House</option>
            <option value="Apartment">Apartment</option>
          </select>
          <input
            type="text"
            name="otherPets"
            value={formData.otherPets}
            onChange={handleChange}
            placeholder="Other pets in household"
            className={inputClass}
          />
          <input
            type="text"
            name="familyMembers"
            value={formData.familyMembers}
            onChange={handleChange}
            placeholder="Family members / children"
            className={inputClass}
          />
          <input
            type="text"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            placeholder="Experience with pets"
            className={inputClass}
          />
        </div>
      );
    case 3:
      return (
        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-900">Pet Preferences & Motivation</h2>
          <textarea
            name="motivation"
            value={formData.motivation}
            onChange={handleChange}
            placeholder="Why do you want this pet?"
            className={inputClass}
            rows={5}
          />
        </div>
      );
    case 4:
      return (
        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-900">Review & Consent</h2>
          <div className="bg-gray-50 p-5 rounded-xl shadow-inner space-y-2 text-gray-800">
            {Object.entries(formData).map(([key, val]) =>
              key !== "termsAccepted" ? (
                <p key={key} className="text-gray-700">
                  <strong>{key.replace(/([A-Z])/g, " $1")}:</strong> {val || "N/A"}
                </p>
              ) : null
            )}
          </div>
          <label className="flex items-center gap-3 text-gray-800">
            <input
              type="checkbox"
              name="termsAccepted"
              checked={formData.termsAccepted}
              onChange={handleChange}
              className="accent-yellow-400 w-5 h-5"
            />
            I agree to the adoption terms and policies
          </label>
        </div>
      );
    case 5:
      return (
        <div className="space-y-4 text-center">
          <h2 className="text-3xl font-bold text-green-600">All set!</h2>
          <p className="text-gray-700 text-lg">
            Click submit to complete your adoption request for <strong>{pet.name}</strong>.
          </p>
        </div>
      );
    default:
      return null;
  }
}

export default function StartAdoption() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    residenceType: "",
    otherPets: "",
    familyMembers: "",
    experience: "",
    motivation: "",
    termsAccepted: false,
  });

  useEffect(() => {
    async function fetchPet() {
      try {
        const res = await fetch(`https://pawfecthome-4ein.onrender.com/api/pets/${petId}`);
        const data = await res.json();
        setPet(data);
      } catch (err) {
        console.error("Failed to fetch pet:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPet();
  }, [petId]);

  const handleNext = () => setStep((prev) => Math.min(prev + 1, 5));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/adoption/confirmation/${petId}`);
  };

  if (loading) {
    return (
      <motion.section
        className="px-6 max-w-4xl mx-auto mt-32 mb-20 text-center text-gray-800"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <p className="text-lg font-semibold">Loading adoption form...</p>
      </motion.section>
    );
  }

  if (!pet) {
    return (
      <motion.section
        className="px-6 max-w-4xl mx-auto mt-32 mb-20"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        <motion.div
          className="bg-white rounded-3xl shadow-2xl p-8 text-center"
          variants={fadeUp}
        >
          <p className="font-bold text-2xl mb-4">Pet not found</p>
          <Link
            to="/pets"
            className="inline-block px-6 py-3 bg-yellow-400 text-black font-semibold rounded-full shadow hover:bg-yellow-500 transition"
          >
            Back to Pets
          </Link>
        </motion.div>
      </motion.section>
    );
  }

  return (
    <motion.section
      className="px-6 max-w-6xl mx-auto mt-28 mb-20 space-y-12"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Pet Card */}
        <div className="lg:w-1/3 bg-gradient-to-b from-yellow-50 to-yellow-100 rounded-3xl shadow-2xl overflow-hidden border border-yellow-200">
          <img
            src={pet.image || "https://placehold.co/400x400?text=No+Image"}
            alt={pet.name}
            className="w-full h-72 object-cover rounded-t-3xl"
          />
          <div className="p-6 space-y-3">
            <h2 className="text-3xl font-bold text-gray-900">{pet.name}</h2>
            <p className="text-gray-700 text-lg">
              {pet.type} • {pet.gender} • Age {pet.age}
            </p>
            <p className="text-gray-600 text-sm mt-2 line-clamp-4">{pet.description}</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="lg:w-2/3 bg-white rounded-3xl shadow-2xl p-10 space-y-8 border border-gray-100">
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-6">
            {[1, 2, 3, 4, 5].map((s) => (
              <div
                key={s}
                className={`flex-1 h-3 mx-1 rounded-full transition-all ${
                  step >= s ? "bg-yellow-400" : "bg-gray-300"
                }`}
              ></div>
            ))}
          </div>

          <form onSubmit={handleSubmit}>
            <StepContent step={step} formData={formData} handleChange={handleChange} pet={pet} />

            <div className="flex justify-between mt-8">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-8 py-3 bg-gray-200 text-gray-800 font-semibold rounded-full hover:bg-gray-300 transition"
                >
                  Back
                </button>
              ) : (
                <div></div>
              )}

              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-8 py-3 bg-yellow-400 text-white font-semibold rounded-full hover:bg-yellow-500 transition"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!formData.termsAccepted}
                  className={`px-8 py-3 font-semibold rounded-full transition ${
                    formData.termsAccepted
                      ? "bg-yellow-400 text-white hover:bg-yellow-500"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  Submit Request
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* CTA Banner */}
      <motion.div
        className="bg-gradient-to-r from-yellow-100 to-yellow-300 rounded-3xl shadow-lg p-8 flex flex-col lg:flex-row justify-between items-center gap-6"
        variants={fadeUp}
      >
        <div className="flex items-center gap-4">
          <div className="p-4 rounded-2xl bg-white/70 backdrop-blur">
            <PawPrint className="w-12 h-12 text-yellow-600" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Still unsure?</h3>
            <p className="text-gray-800 mt-1">
              Contact our adoption team for guidance or schedule a visit.
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Link
            to="/contact"
            className="px-6 py-3 bg-white text-yellow-600 font-semibold rounded-full shadow hover:brightness-95 transition"
          >
            Contact Us
          </Link>
        </div>
      </motion.div>
    </motion.section>
  );
}
