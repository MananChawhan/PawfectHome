import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import PetCard from "../components/PetCard.jsx";
import FilterBar from "../components/FilterBar.jsx";
import { Link } from "react-router-dom";
import { PawPrint, Heart, Users, Dog } from "lucide-react";

// Swiper v10+ imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Pets() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [type, setType] = useState("");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("name"); // sort by name/age

  // Fetch pets from backend
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const res = await fetch("https://pawfecthome-4ein.onrender.com/api/pets");
        const data = await res.json();
        setPets(data);
      } catch (err) {
        console.error("Error fetching pets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPets();
  }, []);

  // Filter + Sort pets
  const filtered = useMemo(() => {
    let results = pets.filter((p) => {
      const matchesType = type
        ? p.type?.toLowerCase() === type.toLowerCase()
        : true;
      const q = query.trim().toLowerCase();
      const matchesQuery = q
        ? p.name?.toLowerCase().includes(q) || p.breed?.toLowerCase().includes(q)
        : true;
      return matchesType && matchesQuery;
    });

    if (sort === "name") {
      results = results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "age") {
      results = results.sort((a, b) => (a.age || 0) - (b.age || 0));
    }

    return results;
  }, [type, query, pets, sort]);

  // Stats
  const totalPets = pets.length;
  const filteredPets = filtered.length;
  const featuredPets = pets.slice(0, 5);
  const adopters = 124;
  const volunteers = 32;

  return (
    <motion.section
      className="px-6 max-w-7xl mx-auto space-y-20 mt-20 mb-20"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {/* Hero Carousel */}
      <motion.div variants={fadeUp}>
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          loop
          autoplay={{ delay: 4000 }}
          className="rounded-3xl overflow-hidden shadow-xl"
        >
          {featuredPets.map((p) => (
            <SwiperSlide key={p._id}>
              <div className="relative">
                <img
                  src={p.image || "https://placehold.co/600x400?text=No+Image"}
                  alt={p.name}
                  className="w-full h-[420px] object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center text-center text-white p-6">
                  <h2 className="text-4xl font-bold drop-shadow-lg">{p.name}</h2>
                  <p className="text-lg">{p.breed}</p>
                  <Link
                    to={`/adopt/${p._id}`}
                    className="mt-4 px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg shadow-lg font-semibold"
                  >
                    Adopt {p.name}
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center"
        variants={fadeUp}
      >
        <div className="bg-yellow-100 px-6 py-6 rounded-xl shadow flex flex-col items-center">
          <PawPrint className="w-8 h-8 text-yellow-600 mb-2" />
          <p className="text-2xl font-bold">{totalPets}</p>
          <p className="font-medium">Total Pets</p>
        </div>
        <div className="bg-green-100 px-6 py-6 rounded-xl shadow flex flex-col items-center">
          <Dog className="w-8 h-8 text-green-600 mb-2" />
          <p className="text-2xl font-bold">{filteredPets}</p>
          <p className="font-medium">Matching Filters</p>
        </div>
        <div className="bg-blue-100 px-6 py-6 rounded-xl shadow flex flex-col items-center">
          <Heart className="w-8 h-8 text-blue-600 mb-2" />
          <p className="text-2xl font-bold">{adopters}</p>
          <p className="font-medium">Happy Adopters</p>
        </div>
        <div className="bg-pink-100 px-6 py-6 rounded-xl shadow flex flex-col items-center">
          <Users className="w-8 h-8 text-pink-600 mb-2" />
          <p className="text-2xl font-bold">{volunteers}</p>
          <p className="font-medium">Volunteers</p>
        </div>
      </motion.div>

      {/* Filter + Sort Bar */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-xl shadow"
        variants={fadeUp}
      >
        <FilterBar
          type={type}
          setType={setType}
          query={query}
          setQuery={setQuery}
        />
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-lg px-4 py-2 shadow focus:ring focus:ring-yellow-300"
        >
          <option value="name">Sort by Name</option>
          <option value="age">Sort by Age</option>
        </select>
      </motion.div>

      {/* Pets Grid */}
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8"
        variants={stagger}
      >
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 animate-pulse h-64 rounded-2xl"
            />
          ))
        ) : filtered.length > 0 ? (
          filtered.map((p) => (
            <motion.div
              key={p._id}
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow-lg transition relative group"
            >
              <PetCard pet={p} />
              {/* Adopt Button */}
              <Link
                to={`/adopt/${p._id}`}
                className="absolute bottom-3 right-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow opacity-0 group-hover:opacity-100 transition"
              >
                Adopt Me
              </Link>
            </motion.div>
          ))
        ) : (
          <motion.div
            className="bg-white rounded-2xl shadow p-6 col-span-full text-center font-semibold"
            variants={fadeUp}
          >
            No pets found. Try different filters.
          </motion.div>
        )}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        className="bg-yellow-100 p-10 rounded-3xl shadow-lg text-center space-y-4"
        variants={fadeUp}
      >
        <h2 className="text-3xl font-bold ">Ready to give a pet a forever home?</h2>
        <p className="text-lg text-gray-700 p-4">
          Browse our lovely pets and make a difference today.
        </p>
        <Link
          to="/contact"
          className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 rounded-lg font-semibold shadow "
        >
          Become a Volunteer
        </Link>
      </motion.div>
    </motion.section>
  );
}
