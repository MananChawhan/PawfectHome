import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return; // Required fields
    setSubmitted(true);
    setFormData({ name: '', email: '', message: '' });

    setTimeout(() => setSubmitted(false), 3000);
  };

  const isFormValid = formData.name && formData.email && formData.message;

  return (
    <motion.section
      className="px-6 max-w-3xl mx-auto mt-28 mb-20 space-y-8"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
    >
      {/* Header */}
      <motion.div className="text-center" variants={fadeUp}>
        <h2 className="text-3xl md:text-4xl font-extrabold">Get in Touch</h2>
        <p className="text-gray-600 mt-2">
          Have questions or need assistance? Our team is here to help you with adoption, pet services, or general inquiries.
        </p>
      </motion.div>

      {/* Contact Form */}
      <motion.div className="bg-white rounded-2xl shadow p-6 md:p-10 space-y-4" variants={fadeUp}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            type="text"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition"
            required
          />
          <textarea
            name="message"
            rows="5"
            placeholder="Message"
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 transition resize-none"
            required
          ></textarea>
          <button
            type="submit"
            disabled={!isFormValid || submitted}
            className={`w-full px-6 py-3 font-semibold rounded-xl shadow transition flex items-center justify-center gap-2 ${
              isFormValid && !submitted
                ? 'bg-orange-500 hover:bg-orange-600 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <AnimatePresence>
              {submitted && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.5 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 8 }}
                  className="text-xl"
                >
                  ✅
                </motion.span>
              )}
            </AnimatePresence>
            {submitted ? 'Message Sent' : 'Send Message'}
          </button>
        </form>
        <AnimatePresence>
          {submitted && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-green-600 text-sm mt-2 text-center"
            >
              Thanks for contacting us!
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Optional Contact Info */}
      <motion.div className="bg-white rounded-2xl shadow p-6 md:p-10 space-y-2 text-center" variants={fadeUp}>
        <h3 className="text-xl font-bold">Our Contact Info</h3>
        <p className="text-gray-700">📍 123 Paw Street, Pet City, India</p>
        <p className="text-gray-700">📞 +91 98765 43210</p>
        <p className="text-gray-700">✉️ support@pawfecthome.com</p>
      </motion.div>
    </motion.section>
  );
}
