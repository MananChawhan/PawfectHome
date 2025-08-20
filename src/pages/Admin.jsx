import { useEffect, useState } from "react"

export default function Admin() {
  const [pets, setPets] = useState([])
  const [form, setForm] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    gender: "",
    vaccinated: false,
    neutered: false,
    description: "",
    image: ""
  })
  const [editingId, setEditingId] = useState(null)

  // ✅ Fetch pets
  async function fetchPets() {
    const res = await fetch("http://localhost:5000/api/pets")
    const data = await res.json()
    setPets(data)
  }

  useEffect(() => {
    fetchPets()
  }, [])

  // ✅ Handle form input
  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }))
  }

  // ✅ Submit new or updated pet
  async function handleSubmit(e) {
    e.preventDefault()

    if (editingId) {
      // Update pet
      await fetch(`http://localhost:5000/api/pets/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
      setEditingId(null)
    } else {
      // Add new pet
      await fetch("http://localhost:5000/api/pets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
    }

    setForm({
      name: "",
      type: "",
      breed: "",
      age: "",
      gender: "",
      vaccinated: false,
      neutered: false,
      description: "",
      image: ""
    })
    fetchPets()
  }

  // ✅ Delete pet
  async function deletePet(id) {
    if (!window.confirm("Delete this pet?")) return
    await fetch(`http://localhost:5000/api/pets/${id}`, { method: "DELETE" })
    fetchPets()
  }

  // ✅ Edit pet (load into form)
  function editPet(pet) {
    setEditingId(pet._id)
    setForm({
      name: pet.name || "",
      type: pet.type || "",
      breed: pet.breed || "",
      age: pet.age || "",
      gender: pet.gender || "",
      vaccinated: pet.vaccinated || false,
      neutered: pet.neutered || false,
      description: pet.description || "",
      image: pet.image || ""
    })
    window.scrollTo({ top: 0, behavior: "smooth" }) // jump to form
  }

  return (
    <div className="px-6 py-10 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Add / Edit Pet Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow p-6 rounded-xl mb-10 space-y-4"
      >
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Pet" : "Add New Pet"}
        </h2>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="type"
          placeholder="Type (Dog, Cat, etc)"
          value={form.type}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          name="breed"
          placeholder="Breed"
          value={form.breed}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <select
          name="gender"
          value={form.gender}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <div className="flex gap-4">
          <label>
            <input
              type="checkbox"
              name="vaccinated"
              checked={form.vaccinated}
              onChange={handleChange}
            />{" "}
            Vaccinated
          </label>
          <label>
            <input
              type="checkbox"
              name="neutered"
              checked={form.neutered}
              onChange={handleChange}
            />{" "}
            Neutered
          </label>
        </div>

        <div className="flex gap-3">
          <button className="px-6 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700">
            {editingId ? "Save Changes" : "Add Pet"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null)
                setForm({
                  name: "",
                  type: "",
                  breed: "",
                  age: "",
                  gender: "",
                  vaccinated: false,
                  neutered: false,
                  description: "",
                  image: ""
                })
              }}
              className="px-6 py-2 bg-gray-500 text-white rounded shadow hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Pets List */}
      <h2 className="text-2xl font-semibold mb-4">All Pets</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pets.map(pet => (
          <div
            key={pet._id}
            className="bg-white shadow rounded-xl p-4 flex flex-col"
          >
            <img
              src={pet.image || "https://placehold.co/400"}
              alt={pet.name}
              className="w-full h-40 object-cover rounded-lg"
            />
            <h3 className="mt-2 text-lg font-bold">{pet.name}</h3>
            <p className="text-gray-600 text-sm">{pet.type}</p>
            <p className="text-gray-600 text-sm">{pet.breed}</p>
            <div className="mt-3 flex justify-between">
              <button
                onClick={() => editPet(pet)}
                className="px-4 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
              >
                Edit
              </button>
              <button
                onClick={() => deletePet(pet._id)}
                className="px-4 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
