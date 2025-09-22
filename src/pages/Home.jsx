import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import PetCard from "../components/PetCard.jsx";

// Animation Variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Home() {
  const [firstVisit, setFirstVisit] = useState(() => {
    return sessionStorage.getItem("firstVisit") !== "false";
  });

  useEffect(() => {
    if (firstVisit) {
      sessionStorage.setItem("firstVisit", "false");
    }
  }, [firstVisit]);

  const [selectedService, setSelectedService] = useState(null);
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");

  // 🐾 Fetch pets from backend
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPets() {
      try {
        const res = await fetch("https://pawfecthome-4ein.onrender.com/api/pets");
        const data = await res.json();
        setPets(data);
      } catch (err) {
        console.error("Error fetching pets:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchPets();
  }, []);

  const featuredPets = pets.slice(0, 4);

  const services = [
    { title: "Pet Grooming", desc: "Book In-Home Cat and Dog Grooming Service", icon: "🛁" },
    { title: "Pet Boarding", desc: "Book Cat and Dog Boarding Service", icon: "🏠" },
    { title: "Dog Walking", desc: "Book Personalised Dog Walkers Near You", icon: "🚶‍♂️" },
    { title: "Dog Training", desc: "Book Dog Training Service At Home", icon: "🎓" },
    { title: "Vet on Call", desc: "Expert Veterinary Service At Your Home and Online", icon: "👩‍⚕️" },
  ];

  const testimonials = [
    {
      name: "Priya & Simba",
      feedback:
        "Adopting Simba from PawfectHome was the best decision of my life. The process was smooth and stress-free.",
      image:
        "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400&auto=format&fit=crop",
    },
    {
      name: "Rohit & Bella",
      feedback:
        "Thanks to PawfectHome, I found Bella! She’s the sweetest companion and I couldn’t be happier.",
      image:
        "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&auto=format&fit=crop",
    },
    {
      name: "Aditi & Max",
      feedback:
        "Max has filled my home with joy. The team guided me at every step of the adoption journey.",
      image:
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400&auto=format&fit=crop",
    },
  ];

  const bgImage =
    "https://images.unsplash.com/photo-1535722339661-7f22185bc7ca?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0";

  return (
    <div className="mt-16">
      {/* Hero Section */}
      <motion.section
        className="relative min-h-[80vh] lg:min-h-[90vh] flex items-center justify-center text-center w-full overflow-hidden rounded-3xl"
        initial={firstVisit ? "hidden" : "visible"}
        animate="visible"
        variants={stagger}
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bgImage})` }}
        >
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <motion.div
          className="relative z-10 text-white space-y-6 max-w-3xl px-4"
          variants={stagger}
        >
          <motion.h1
            className="text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight"
            variants={fadeUp}
          >
            Find your{" "}
            <span className="underline decoration-4 decoration-yellow-400">
              Pawfect
            </span>{" "}
            companion
          </motion.h1>
          <motion.p
            className="text-base sm:text-lg md:text-xl opacity-90"
            variants={fadeUp}
          >
            PawfectHome helps you discover loving pets from shelters and NGOs.
            Browse verified profiles and start a responsible adoption journey
            today.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Floating Services Card */}
      <motion.section
        className="relative -mt-20 md:-mt-28 lg:-mt-32 px-3 sm:px-6 md:px-10"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 max-w-6xl mx-auto">
          <motion.h2
            variants={fadeUp}
            className="text-3xl md:text-4xl font-extrabold text-center"
          >
            Your Trusted Pet Care Partner
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-gray-500 text-center mt-2"
          >
            Book Pet Care Service At Home with PawfectHome
          </motion.p>

          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {services.map((s) => {
              const isActive = selectedService === s.title;
              return (
                <motion.div
                  key={s.title}
                  variants={fadeUp}
                  onClick={() => setSelectedService(s.title)}
                  className={[
                    "cursor-pointer rounded-xl p-5 flex items-start gap-4 transition shadow",
                    isActive
                      ? "bg-orange-500 text-white shadow-lg"
                      : "bg-white border border-gray-200 hover:shadow-md",
                  ].join(" ")}
                >
                  <div
                    className={[
                      "text-4xl shrink-0 rounded-full w-12 h-12 flex items-center justify-center",
                      isActive ? "bg-white/20" : "bg-gray-100",
                    ].join(" ")}
                  >
                    <span className={isActive ? "drop-shadow-sm" : ""}>
                      {s.icon}
                    </span>
                  </div>
                  <div>
                    <h3
                      className={
                        "font-extrabold text-lg " +
                        (isActive ? "text-white" : "text-gray-900")
                      }
                    >
                      {s.title}
                    </h3>
                    <p
                      className={
                        (isActive ? "text-white/90" : "text-gray-600") +
                        " text-sm mt-1"
                      }
                    >
                      {s.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-8 grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Your City
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Select City Here...</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bengaluru">Bengaluru</option>
                <option value="Chennai">Chennai</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Kolkata">Kolkata</option>
                <option value="Pune">Pune</option>
                <option value="Indore">Indore</option>
                <option value="Ahmedabad">Ahmedabad</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Service Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="flex items-end">
              <button
                disabled={!selectedService || !city || !date}
                className={`w-full px-6 py-3 rounded-lg font-semibold shadow transition ${
                  selectedService && city && date
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {selectedService
                  ? `Book ${selectedService}`
                  : "Select a Service"}
              </button>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Featured Pets */}
      <motion.section
        className="px-6 max-w-7xl mx-auto space-y-12 mt-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center"
          variants={fadeUp}
        >
          Featured Pets
        </motion.h2>
        {loading ? (
          <p className="text-center">Loading pets...</p>
        ) : (
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
            variants={fadeUp}
          >
            {featuredPets.map((pet) => (
              <motion.div
                key={pet._id}
                className="bg-white rounded-2xl shadow hover:shadow-xl hover:scale-105 transition"
                variants={fadeUp}
              >
                <img
                  src={pet.image}
                  alt={pet.name}
                  className="w-full h-48 object-cover rounded-t-2xl"
                />
                <div className="p-4 text-center">
                  <h3 className="font-bold text-lg">{pet.name}</h3>
                  <p className="text-sm text-gray-500">{pet.breed}</p>
                  <Link
                    to={`/adopt/${pet._id}`}
                    className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg shadow hover:scale-105 transition"
                  >
                    Adopt Me
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="px-6 max-w-7xl mx-auto space-y-12 mt-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center"
          variants={fadeUp}
        >
          What Our Adopters Say
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <motion.div
              key={t.name}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-xl hover:scale-105 transition"
              variants={fadeUp}
            >
              <img
                src={t.image}
                alt={t.name}
                className="w-20 h-20 rounded-full object-cover mx-auto"
              />
              <p className="text-gray-600 text-sm mt-4">“{t.feedback}”</p>
              <h3 className="font-bold mt-3 text-center">{t.name}</h3>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* Extra Info Section */}
      <motion.section
        className="px-6 max-w-7xl mx-auto space-y-8 mt-16 mb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={stagger}
      >
        <motion.h2
          className="text-2xl md:text-3xl font-bold text-center text-gray-900"
          variants={fadeUp}
        >
          Your Ultimate Pet Care Partner
        </motion.h2>

        <motion.div
          className="text-gray-700 leading-relaxed space-y-6 text-center"
          variants={fadeUp}
        >
          <p>
            Welcome to <span className="font-bold">ThePetNest</span>, the
            ultimate destination for pet lovers seeking comprehensive and
            compassionate care for their furry family members. We are your go-to
            hub for pet grooming, cat and dog boarding, dog walking, online vet
            consultations, home vet visit, cat and dog insurance, dog training,
            pet relocation, pet products, and even adoption services.
          </p>

          <div>
            <h3 className="font-semibold text-lg">
              🐾 Pet Grooming Tailored to Your Needs
            </h3>
            <p>
              From <em>pet grooming near me</em> to <em>dog spa near me</em>,
              our skilled groomers provide exceptional care. We offer dog
              grooming service, pet grooming at home, and cat grooming service,
              ensuring pets leave happier and healthier.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              🏠 Comfortable Dog and Cat Boarding
            </h3>
            <p>
              Looking for <em>kennels near me</em> or <em>pet daycare near me</em>? Our safe and loving facilities ensure pets get the care they deserve while you’re away.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              🚶 Daily Dog Walking Services
            </h3>
            <p>
              Our passionate dog walkers tailor walks to your dog’s needs.
              Search for <em> dog walkers near me</em> and we’ll be there!
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              👩‍⚕️ At-Home and Online Vet Consultations
            </h3>
            <p>
              From emergencies to checkups, our at-home and online vet
              consultations keep your pet’s health a priority.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">🛡️ Pet Insurance</h3>
            <p>
              Secure your pets with our best pet insurance plans. Get quotes
              today and ensure their health and happiness for years to come.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">
              🎓 Online & Home Dog Training
            </h3>
            <p>
              From puppy socialization to retraining, our certified trainers use
              positive reinforcement to help your dog succeed.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">✈️ Stress-Free Pet Relocation</h3>
            <p>
              Domestic or international, our relocation services handle all
              logistics to make moving with pets seamless.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">🛒 Quality Pet Products Delivered</h3>
            <p>
              From nutritious food to toys and bedding, we deliver the best
              products for happy, healthy pets.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">❤️ Pet Adoption & Rehoming</h3>
            <p>
              Looking to adopt? Our adoption and rehoming services connect
              families with pets in need of loving homes.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-lg">🌟 Join Our Community</h3>
            <p>
              At ThePetNest, we’re more than a service provider — we’re a
              community of pet lovers committed to enhancing the lives of pets
              and owners.
            </p>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
