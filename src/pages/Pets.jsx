import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import PetCard from "../components/PetCard.jsx";
import FilterBar from "../components/FilterBar.jsx";
import { Link } from "react-router-dom";


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
      className="px-6 max-w-7xl mx-auto space-y-16 mt-20 mb-20"
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
          className="rounded-3xl overflow-hidden shadow-lg"
        >
          {featuredPets.map((p) => (
            <SwiperSlide key={p._id}>
              <div className="relative">
                <img
                  src={p.image || "https://placehold.co/600x400?text=No+Image"}
                  alt={p.name}
                  className="w-full h-72 object-cover"
                />
                <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <p className="text-sm">{p.breed}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="flex justify-center gap-6 text-center flex-wrap"
        variants={fadeUp}
      >
        <div className="bg-yellow-100 px-6 py-4 rounded-xl font-semibold shadow">
          <p className="text-2xl">{totalPets}</p>
          <p>Total Pets</p>
        </div>
        <div className="bg-green-100 px-6 py-4 rounded-xl font-semibold shadow">
          <p className="text-2xl">{filteredPets}</p>
          <p>Matching Filters</p>
        </div>
        <div className="bg-blue-100 px-6 py-4 rounded-xl font-semibold shadow">
          <p className="text-2xl">{adopters}</p>
          <p>Happy Adopters</p>
        </div>
        <div className="bg-pink-100 px-6 py-4 rounded-xl font-semibold shadow">
          <p className="text-2xl">{volunteers}</p>
          <p>Active Volunteers</p>
        </div>
      </motion.div>

      {/* Filter + Sort Bar */}
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-center gap-4"
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
          className="border rounded-lg px-3 py-2 shadow"
        >
          <option value="name">Sort by Name</option>
          <option value="age">Sort by Age</option>
        </select>
      </motion.div>

      {/* Pets Grid */}
      <motion.div
        className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={stagger}
      >
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-200 animate-pulse h-60 rounded-2xl"
            />
          ))
        ) : filtered.length > 0 ? (
          filtered.map((p) => (
            <motion.div
              key={p._id}
              variants={fadeUp}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-2xl shadow transition relative"
            >
              <PetCard pet={p} />
              {/* Adopt Button */}
              <button
  className="absolute bottom-3 right-3 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg shadow"
>
  <Link to={`/adopt/${p._id}`} className="block">
    Adopt Me
  </Link>
</button>
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
    </motion.section>
  );
}
