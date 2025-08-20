import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export default function AdminPage() {
  const [pets, setPets] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "",
    image: "", // will store URL if needed
    description: "",
    vaccinated: false,
    neutered: false,
    goodWith: [],
  });
  const [imageFile, setImageFile] = useState(null); // ✅ new: selected file
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "admin") navigate("/login");
  }, [token, role, navigate]);

  const fetchPets = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/pets");
      const data = await res.json();
      setPets(data);
    } catch (err) {
      console.error("Failed to fetch pets:", err);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "goodWith") {
      setForm({ ...form, goodWith: value.split(",").map((item) => item.trim()) });
    } else {
      setForm({ ...form, [name]: type === "checkbox" ? checked : value });
    }
  };

  // Handle image file
  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setPreview(null);
    }
  };

  const toDisplayImage = (img) => {
    if (!img) return "https://placehold.co/600x400?text=No+Image";
    if (img.startsWith("http")) return img;
    return `http://localhost:5000/${img}`; // ✅ serve backend upload
  };

  // Submit (Create/Update) with FormData
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const url = editId
        ? `http://localhost:5000/api/pets/${editId}`
        : "http://localhost:5000/api/pets";
      const method = editId ? "PUT" : "POST";

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("type", form.type);
      formData.append("breed", form.breed);
      formData.append("age", form.age);
      formData.append("gender", form.gender);
      formData.append("description", form.description);
      formData.append("vaccinated", form.vaccinated);
      formData.append("neutered", form.neutered);
      formData.append("goodWith", form.goodWith.join(","));

      // only append image if a new file is selected
      if (imageFile) {
        formData.append("image", imageFile);
      } else if (!editId && form.image) {
        // In case adding with remote URL instead of file (optional)
        formData.append("image", form.image);
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`, // optional for secured routes
          // ❌ don't set Content-Type manually when sending FormData
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to save pet");

      // Reset
      setForm({
        name: "",
        type: "",
        breed: "",
        age: "",
        gender: "",
        image: "",
        description: "",
        vaccinated: false,
        neutered: false,
        goodWith: [],
      });
      setImageFile(null);
      setPreview(null);
      setEditId(null);
      fetchPets();
    } catch (err) {
      console.error(err);
      alert("Failed to save pet");
    }
  };

  // Edit pet
  const handleEdit = (pet) => {
    setForm({
      name: pet.name,
      type: pet.type,
      breed: pet.breed,
      age: pet.age,
      gender: pet.gender,
      image: pet.image,
      description: pet.description,
      vaccinated: pet.vaccinated,
      neutered: pet.neutered,
      goodWith: pet.goodWith || [],
    });
    setEditId(pet._id);
    setImageFile(null);
    setPreview(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete pet
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;
    try {
      await fetch(`http://localhost:5000/api/pets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPets();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <motion.section
      className="px-6 max-w-6xl mx-auto mt-24 mb-20 space-y-12"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
    >
      <motion.div className="text-center" variants={fadeUp}>
        <h1 className="text-4xl font-extrabold text-gray-900">🐾 Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Add, edit, and manage pets listed for adoption.</p>
      </motion.div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        className="bg-white border-2 border-gray-200 rounded-2xl shadow p-8 space-y-6"
        variants={fadeUp}
        encType="multipart/form-data"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {editId ? "✏️ Edit Pet" : "➕ Add New Pet"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <input
            type="text"
            name="type"
            placeholder="Type (Dog, Cat... )"
            value={form.type}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <input
            type="text"
            name="breed"
            placeholder="Breed"
            value={form.breed}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <input
            type="text"
            name="age"
            placeholder="Age"
            value={form.age}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          <input
            type="text"
            name="gender"
            placeholder="Gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
        </div>

        {/* Image input */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <label className="block font-semibold text-gray-700 mb-2">Image Upload</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full px-4 py-3 border rounded-xl focus:outline-none"
            />
            <p className="text-sm text-gray-600 mt-1">
              {editId ? "Choose a new file to replace current image (optional)." : "Select an image to upload."}
            </p>
          </div>

          <div className="flex flex-col items-center">
            <p className="text-sm font-medium text-gray-700">Preview:</p>
            <img
              src={
                preview
                  ? preview
                  : editId && form.image
                    ? toDisplayImage(form.image)
                    : "https://placehold.co/120x120?text=No+Image"
              }
              alt="preview"
              className="w-28 h-28 object-cover rounded-lg shadow mt-2"
            />
          </div>
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 font-semibold text-gray-700">
            <input type="checkbox" name="vaccinated" checked={form.vaccinated} onChange={handleChange} />
            Vaccinated
          </label>
          <label className="flex items-center gap-2 font-semibold text-gray-700">
            <input type="checkbox" name="neutered" checked={form.neutered} onChange={handleChange} />
            Neutered
          </label>
        </div>

        <input
          type="text"
          name="goodWith"
          placeholder="Good with (comma separated, e.g. Kids, Dogs, Cats)"
          value={form.goodWith.join(", ")}
          onChange={handleChange}
          className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
        />

        <button
          type="submit"
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl shadow transition"
        >
          {editId ? "💾 Save Changes" : "➕ Add Pet"}
        </button>
      </motion.form>

      {/* Table */}
      <motion.div className="bg-white rounded-2xl shadow border-2 border-gray-200 p-6" variants={fadeUp}>
        <h2 className="text-2xl font-bold mb-4">📋 Current Pets</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="p-3">Image</th>
                <th className="p-3">Name</th>
                <th className="p-3">Type</th>
                <th className="p-3">Breed</th>
                <th className="p-3">Age</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet) => (
                <tr key={pet._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <img
                      src={toDisplayImage(pet.image)}
                      alt={pet.name}
                      className="w-16 h-16 object-cover rounded-lg shadow"
                    />
                  </td>
                  <td className="p-3 font-semibold">{pet.name}</td>
                  <td className="p-3">{pet.type}</td>
                  <td className="p-3">{pet.breed}</td>
                  <td className="p-3">{pet.age}</td>
                  <td className="p-3 flex gap-2 justify-center">
                    <button
                      onClick={() => handleEdit(pet)}
                      className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pet._id)}
                      className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>  
      </motion.div>
    </motion.section>
  );
}
