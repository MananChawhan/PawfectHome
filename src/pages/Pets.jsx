import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
<<<<<<< HEAD
=======
import PetCard from "../components/PetCard.jsx";
import FilterBar from "../components/FilterBar.jsx";
>>>>>>> f6480e8865b6ac02513109a2920f9d3c409bd9f9
import { Link } from "react-router-dom";
import { PawPrint, Heart, Users, Dog } from "lucide-react";

// Swiper v10+ imports
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

<<<<<<< HEAD
// Motion variants
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
};
const zoomSlow = { scale: 1, transition: { duration: 6, ease: "linear" } };

// Redesigned PetCard
function PetCard({ pet }) {
  return (
    <motion.div
      className="bg-white rounded-3xl shadow-lg overflow-hidden cursor-pointer transform transition-all hover:scale-105 hover:shadow-2xl"
      whileHover={{ scale: 1.05 }}
    >
      {/* Image */}
      <div className="relative h-64 w-full">
        <img
          src={pet.image || "https://placehold.co/400x300?text=No+Image"}
          alt={pet.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2 bg-white/80 rounded-full p-2 flex items-center gap-1 shadow">
          <PawPrint className="w-5 h-5 text-yellow-500" />
          <span className="text-xs font-semibold text-gray-800">{pet.type || "Unknown"}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-2">
        <h3 className="text-xl font-bold text-gray-900">{pet.name}</h3>
        <p className="text-sm text-gray-600">{pet.breed}</p>
        <p className="text-sm text-gray-600">Age: {pet.age || "Unknown"} yrs</p>
        <p className="text-sm text-gray-700 line-clamp-3">{pet.description || "No description available."}</p>

        {/* Footer with adopt button */}
        <div className="mt-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Heart className="w-5 h-5 text-red-500" />
            <span>Friendly & loving</span>
          </div>
          <Link
            to={`/adopt/${pet._id}`}
            className="px-4 py-2 bg-green-500 text-white rounded-full font-semibold shadow hover:bg-green-600 transition"
          >
            Adopt
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
=======
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
};
>>>>>>> f6480e8865b6ac02513109a2920f9d3c409bd9f9

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
<<<<<<< HEAD
        setPets(data || []);
      } catch (err) {
        console.error("Error fetching pets:", err);
        setPets([]);
=======
        setPets(data);
      } catch (err) {
        console.error("Error fetching pets:", err);
>>>>>>> f6480e8865b6ac02513109a2920f9d3c409bd9f9
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
<<<<<<< HEAD
        ? (p.name?.toLowerCase().includes(q) ||
            p.breed?.toLowerCase().includes(q) ||
            p.description?.toLowerCase().includes(q))
=======
        ? p.name?.toLowerCase().includes(q) || p.breed?.toLowerCase().includes(q)
>>>>>>> f6480e8865b6ac02513109a2920f9d3c409bd9f9
        : true;
      return matchesType && matchesQuery;
    });

<<<<<<< HEAD
    results = results.slice(); // avoid mutating original array

    if (sort === "name") {
      results.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else if (sort === "age") {
      results.sort((a, b) => (a.age || 0) - (b.age || 0));
=======
    if (sort === "name") {
      results = results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "age") {
      results = results.sort((a, b) => (a.age || 0) - (b.age || 0));
>>>>>>> f6480e8865b6ac02513109a2920f9d3c409bd9f9
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
<<<<<<< HEAD
      className="px-6 lg:px-12 max-w-7xl mx-auto space-y-14 mt-28 mb-28"
      initial="hidden"
      animate="visible"
      variants={stagger}
      aria-label="Pets listing"
    >
      {/* HERO */}
      <motion.header className="relative rounded-3xl overflow-hidden shadow-2xl" variants={fadeUp}>
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-white to-yellow-50/40 pointer-events-none" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
          {/* Left: headline & controls */}
          <div className="p-8 lg:p-12 flex flex-col justify-center gap-6">
            <motion.h1
              className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              Find a furry friend to love
            </motion.h1>
            <motion.p
              className="text-gray-700 max-w-xl"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.05 }}
            >
              Browse adoptable pets, filter by type, and connect with loving homes.
              Each pet profile includes breed, age, personality, and adoption steps.
            </motion.p>

            <div className="flex items-center gap-3 mt-2">
              <Link
                to="/adoptions"
                className="inline-flex items-center gap-3 bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-5 py-3 rounded-full shadow-lg"
              >
                <PawPrint className="w-5 h-5" /> View Adoptions
              </Link>

              <Link
                to="/contact"
                className="inline-flex items-center gap-2 text-gray-800 font-medium px-4 py-3 rounded-full hover:text-yellow-600 transition"
              >
                Become a Volunteer
              </Link>
            </div>

            {/* quick filters as tags */}
            <div className="flex gap-3 mt-4 flex-wrap">
              {["Dog", "Cat", "Other"].map((t) => (
                <button
                  key={t}
                  onClick={() => setType((cur) => (cur.toLowerCase() === t.toLowerCase() ? "" : t))}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-shadow ${
                    type.toLowerCase() === t.toLowerCase()
                      ? "bg-yellow-100 text-yellow-700 shadow"
                      : "bg-white/80 text-gray-700 border border-white/60"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Right: small autoplay carousel highlight */}
          <motion.div
            className="hidden lg:block"
            initial={{ opacity: 0, x: 8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="h-full">
              <Swiper
                modules={[Navigation, Autoplay]}
                navigation
                loop
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                className="h-full rounded-l-3xl"
                style={{ height: "100%" }}
              >
                {featuredPets.length > 0 ? (
                  featuredPets.map((p) => (
                    <SwiperSlide key={p._id}>
                      <motion.div
                        className="relative h-[420px] lg:h-[460px] overflow-hidden rounded-2xl"
                        whileHover={{ scale: 1.02 }}
                        style={{ transformOrigin: "center" }}
                      >
                        <motion.img
                          src={p.image || "https://placehold.co/800x500?text=No+Image"}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          variants={{ animate: zoomSlow }}
                          animate="animate"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent flex items-end p-6">
                          <div className="text-white">
                            <h3 className="text-2xl font-bold leading-snug drop-shadow">{p.name}</h3>
                            <p className="text-sm opacity-90">{p.breed}</p>
                            <Link
                              to={`/adopt/${p._id}`}
                              className="mt-4 inline-block bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg font-semibold shadow"
                            >
                              Adopt {p.name}
                            </Link>
                          </div>
                        </div>
                      </motion.div>
                    </SwiperSlide>
                  ))
                ) : (
                  <SwiperSlide>
                    <div className="relative h-[420px] rounded-2xl bg-gray-100 flex items-center justify-center">
                      <div className="text-gray-600">No featured pets yet</div>
                    </div>
                  </SwiperSlide>
                )}
              </Swiper>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* STATS */}
      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={fadeUp}>
        {[{ icon: PawPrint, value: totalPets, label: "Total pets in shelter" },
          { icon: Dog, value: filteredPets, label: "Matching filters" },
          { icon: Heart, value: adopters, label: "Happy adopters" },
          { icon: Users, value: volunteers, label: "Volunteers" }
        ].map((s, i) => (
          <div key={i} className="bg-white/60 backdrop-blur-md border border-white/40 rounded-2xl p-6 flex flex-col items-center gap-2 shadow">
            <div className="p-3 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-50"><s.icon className="w-7 h-7 text-yellow-600" /></div>
            <div className="text-2xl font-bold text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-600">{s.label}</div>
          </div>
        ))}
      </motion.div>

      {/* FILTER DOCK */}
      <motion.div className="relative -mt-6 z-20" variants={fadeUp}>
        <div className="mx-auto max-w-5xl">
          <div className="bg-white rounded-full shadow-xl p-4 flex flex-col sm:flex-row items-center gap-3 border">
            <div className="flex-1 min-w-0">
              {/* Simple inline filters */}
              <div className="flex flex-wrap gap-2">
                {["Dog", "Cat", "Other"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setType((cur) => (cur === t ? "" : t))}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-shadow ${
                      type === t
                        ? "bg-yellow-100 text-yellow-700 shadow"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
                <input
                  type="text"
                  placeholder="Search pets..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border rounded-full px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-yellow-200"
                aria-label="Sort pets"
              >
                <option value="name">Sort by Name</option>
                <option value="age">Sort by Age</option>
              </select>

              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-500">
                <span className="px-3 py-1 rounded-full bg-gray-100 border text-gray-700">{filteredPets}</span>
                <span className="text-xs uppercase tracking-wide">results</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* PETS GRID */}
      <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8" variants={stagger}>
        {loading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="bg-gray-100 animate-pulse h-72 rounded-3xl" />
            ))
          : filtered.length > 0
          ? filtered.map((p) => <PetCard key={p._id} pet={p} />)
          : (
            <div className="bg-white rounded-2xl shadow p-8 col-span-full text-center font-semibold text-gray-700">
              No pets found. Try different filters or broaden your search.
            </div>
          )}
      </motion.div>

      {/* CTA */}
      <motion.div className="rounded-3xl overflow-hidden relative" variants={fadeUp}>
        <div className="bg-gradient-to-br from-yellow-200 to-yellow-400 p-10 rounded-3xl shadow-lg flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="p-4 rounded-2xl bg-white/60 backdrop-blur">
              <PawPrint className="w-10 h-10 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Ready to give a pet a forever home?</h3>
              <p className="text-gray-800 mt-1">Browse our pets, learn the adoption steps, and bring home a new family member.</p>
            </div>
          </div>

          <div className="flex gap-4 items-center">
            <Link
              to="/adoptions"
              className="px-6 py-3 bg-white text-yellow-600 font-semibold rounded-full shadow hover:brightness-95 transition"
            >
              See Adoption Steps
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 bg-transparent border border-white/60 text-white font-semibold rounded-full hover:bg-white/10 transition"
            >
              Become a Volunteer
            </Link>
          </div>
        </div>
=======
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
>>>>>>> f6480e8865b6ac02513109a2920f9d3c409bd9f9
      </motion.div>
    </motion.section>
  );
}
