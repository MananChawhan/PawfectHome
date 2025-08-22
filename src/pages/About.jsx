import { motion } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.15 } },
}

export default function About() {
  return (
    <motion.section
      className="px-6 max-w-7xl mx-auto space-y-10 mt-28 mb-20"
      initial="hidden"
      animate="visible"
      variants={stagger}
    >
      {/* Page Header */}
      <motion.div className="text-center space-y-2" variants={fadeUp}>
        <h2 className="text-3xl md:text-4xl font-extrabold">
          About PawfectHome
        </h2>
        <p className="text-gray-600 text-lg">
          Your trusted platform for responsible pet adoption and care.
        </p>
      </motion.div>

      {/* Who We Are */}
      <motion.div className="bg-white rounded-2xl shadow p-6 md:p-10 space-y-4" variants={fadeUp}>
        <h3 className="text-2xl font-bold">Who We Are</h3>
        <p className="text-gray-700 leading-relaxed">
          PawfectHome is a dedicated pet adoption platform designed to connect loving families with pets in need of a home.
          Our mission is to simplify the adoption process, ensure transparency, and promote responsible pet ownership.
          Built with modern technologies like React, Vite, and Tailwind CSS, our platform is fast, responsive, and user-friendly.
        </p>
      </motion.div>

      {/* What We Offer */}
      <motion.div className="bg-white rounded-2xl shadow p-6 md:p-10 space-y-4" variants={fadeUp}>
        <h3 className="text-2xl font-bold">What We Offer</h3>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>Browse verified pet profiles with detailed information</li>
          <li>Filter by type, breed, age, and quick-search by name</li>
          <li>Submit adoption requests and track their status online</li>
          <li>Expert tips on pet care and responsible ownership</li>
        </ul>
      </motion.div>

      {/* Planned Backend Features */}
      <motion.div className="bg-white rounded-2xl shadow p-6 md:p-10 space-y-4" variants={fadeUp}>
        <h3 className="text-2xl font-bold">Planned Backend Features</h3>
        <ul className="list-disc pl-6 text-gray-700 space-y-2">
          <li>MongoDB collections for pets, users, and adoptions</li>
          <li>Secure authentication with JWT for users and admins</li>
          <li>Admin dashboard for managing pets, adoption requests, and approvals</li>
          <li>Scalable REST API with Node.js and Express for future enhancements</li>
        </ul>
      </motion.div>

      {/* Join Our Mission */}
      <motion.div className="bg-white rounded-2xl shadow p-6 md:p-10 text-center" variants={fadeUp}>
        <h3 className="text-2xl font-bold">Join Our Mission</h3>
        <p className="text-gray-700 mt-2">
          At PawfectHome, we believe every pet deserves a loving home. Join our community of pet lovers and help us
          make a difference—one adoption at a time.
        </p>
      </motion.div>
    </motion.section>
  )
}
