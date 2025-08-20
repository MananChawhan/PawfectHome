import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import pets from '../data/pets.json'
import PetCard from '../components/PetCard.jsx'
import FilterBar from '../components/FilterBar.jsx'

// Swiper v10+ imports (Vite-compatible)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';


const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

export default function Pets() {
  const [type, setType] = useState('')
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return pets.filter(p => {
      const matchesType = type ? p.type === type : true
      const q = query.trim().toLowerCase()
      const matchesQuery = q
        ? p.name.toLowerCase().includes(q) || p.breed.toLowerCase().includes(q)
        : true
      return matchesType && matchesQuery
    })
  }, [type, query])

  const totalPets = pets.length
  const filteredPets = filtered.length
  const featuredPets = pets.slice(0, 5)
  const adopters = 124
  const volunteers = 32

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
          modules={[Navigation]}
          navigation
          loop
          autoplay={{ delay: 4000 }}
          className="rounded-3xl overflow-hidden shadow-lg"
        >
          {featuredPets.map(p => (
            <SwiperSlide key={p.id}>
              <div className="relative">
                <img src={p.image} alt={p.name} className="w-full h-72 object-cover" />
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
      <motion.div className="flex justify-center gap-6 text-center" variants={fadeUp}>
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

      {/* Filter Bar */}
      <motion.div variants={fadeUp}>
        <FilterBar type={type} setType={setType} query={query} setQuery={setQuery} />
      </motion.div>

      {/* Featured Pet Spotlight */}
      {featuredPets.length > 0 && (
        <motion.div
          className="bg-gradient-to-r from-yellow-200 to-green-200 rounded-3xl p-6 shadow-lg flex flex-col md:flex-row items-center gap-6"
          variants={fadeUp}
        >
          <img
            src={featuredPets[0].image}
            alt={featuredPets[0].name}
            className="w-64 h-64 object-cover rounded-2xl shadow-lg"
          />
          <div className="flex-1 space-y-4">
            <h3 className="text-3xl font-bold">{featuredPets[0].name}</h3>
            <p className="text-gray-700">{featuredPets[0].description}</p>
            <button className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
              Adopt {featuredPets[0].name}
            </button>
          </div>
        </motion.div>
      )}

      {/* Pets Grid */}
      <motion.div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6" variants={stagger}>
        {filtered.length > 0 ? (
          filtered.map(p => (
            <motion.div
              key={p.id}
              variants={fadeUp}
              className="bg-white rounded-2xl shadow hover:shadow-xl hover:scale-105 transition"
            >
              <PetCard pet={p} />
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

      {/* Testimonials */}
      <motion.div variants={fadeUp} className="space-y-6">
        <h3 className="text-3xl font-bold text-center">Happy Adopters</h3>
        <Swiper
          modules={[Navigation]}
          navigation
          loop
          autoplay={{ delay: 5000 }}
          slidesPerView={1}
          className="space-x-4"
        >
          <SwiperSlide>
            <div className="bg-white shadow-lg p-6 rounded-2xl text-center">
              <p>"Adopting Max was the best decision ever! Such a loving companion."</p>
              <p className="mt-4 font-semibold">- Sarah K.</p>
            </div>
          </SwiperSlide>
          <SwiperSlide>
            <div className="bg-white shadow-lg p-6 rounded-2xl text-center">
              <p>"I can't believe how happy our family is after adopting Bella."</p>
              <p className="mt-4 font-semibold">- Rohan P.</p>
            </div>
          </SwiperSlide>
        </Swiper>
      </motion.div>

      {/* Call-to-Action */}
      <motion.div
        className="text-center bg-gradient-to-r from-yellow-200 to-green-200 py-12 rounded-3xl shadow-lg"
        variants={fadeUp}
      >
        <h3 className="text-2xl md:text-3xl font-bold mb-4">Want to help more pets?</h3>
        <p className="mb-6 text-gray-700 max-w-xl mx-auto">
          Consider volunteering or donating to support pet shelters. Every little help counts!
        </p>
        <button className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:scale-105 transition">
          Get Involved
        </button>
      </motion.div>
    </motion.section>
  )
}
