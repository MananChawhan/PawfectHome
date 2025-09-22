import { motion } from "framer-motion";

export default function FilterBar({ type, setType, query, setQuery }) {
  const types = ["Dog", "Cat"];
  const otherTypes = ["Rabbit", "Bird", "Hamster", "Turtle", "Fish"];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      {/* Search Box */}
      <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
        <input
          type="text"
          placeholder="🔎 Search pets by name or breed..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-white/70 backdrop-blur-lg shadow-md 
                     focus:outline-none focus:ring-2 focus:ring-orange-400 
                     transition-all duration-300"
        />
      </motion.div>

      {/* Type Filter Buttons */}
      <div className="flex gap-3 items-center">
        {types.map((t) => {
          const isActive = type === t;
          return (
            <motion.button
              key={t}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setType(isActive ? "" : t)}
              className={`px-5 py-2.5 rounded-full font-semibold shadow transition-all duration-300 ${
                isActive
                  ? "bg-orange-500 text-white shadow-lg"
                  : "bg-white/70 backdrop-blur-lg text-gray-700 hover:bg-orange-100"
              }`}
            >
              {t}
            </motion.button>
          );
        })}

        {/* Dropdown for Others */}
        <motion.select
          value={type}
          onChange={(e) => setType(e.target.value)}
          whileHover={{ scale: 1.05 }}
          className="px-1 py-2.5 rounded-full font-semibold shadow bg-white/70 backdrop-blur-lg 
                     text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 
                     focus:ring-orange-400 transition-all duration-300"
        >
          <option value="">Other</option>
          {otherTypes.map((ot) => (
            <option key={ot} value={ot}>
              {ot}
            </option>
          ))}
        </motion.select>
      </div>
    </motion.div>
  );
}
