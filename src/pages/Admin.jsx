import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  PawPrint,
  ClipboardList,
  PlusCircle,
  Dog,
  ShieldCheck,
  LogOut,
  Edit3,
  Trash2,
  CheckCircle2,
  Loader2,
  XCircle,
  UserCog,
  Shield,     // section header icon for Manage Accounts
  ShieldX,    // ❌ Remove Admin
  UserX,      // ❌ Remove User
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function AdminPage() {
  // ───────────────────────────────── state
  const [activeTab, setActiveTab] = useState("dashboard"); // 'dashboard' | 'add' | 'manage' | 'accounts'
  const [pets, setPets] = useState([]);
  const [loadingPets, setLoadingPets] = useState(true);

  const [user, setUser] = useState(null);
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
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
    status: "Available",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Filters (Manage tab)
  const [filterType, setFilterType] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterVaccinated, setFilterVaccinated] = useState("Any"); // Any | Yes | No
  const [filterNeutered, setFilterNeutered] = useState("Any"); // Any | Yes | No
  const [sortBy, setSortBy] = useState("newest"); // newest | name-asc | name-desc | status

  // Accounts tab state
  const [admins, setAdmins] = useState([]);
  const [users, setUsers] = useState([]);
  const [toast, setToast] = useState(null);

  const navigate = useNavigate();

  // ───────────────────────────────── auth
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");
    const avatarUrl = localStorage.getItem("avatarUrl");
    setUser({ name, email, role, avatarUrl });
  }, [token, role, navigate]);

  // ───────────────────────────────── data load
  const fetchPets = async () => {
    try {
      setLoadingPets(true);
      const res = await fetch("https://pawfecthome-4ein.onrender.com/api/pets");
      const data = await res.json();
      setPets(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch pets:", err);
    } finally {
      setLoadingPets(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  // ───────────────────────────────── helpers
  const toDisplayImage = (img) => {
    if (!img) return "https://placehold.co/600x400?text=No+Image";
    if (typeof img === "string" && img.startsWith("http")) return img;
    return `https://pawfecthome-4ein.onrender.com/${img}`;
  };

  const resetForm = () => {
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
      status: "Available",
    });
    setImageFile(null);
    setPreview(null);
    setEditId(null);
  };

  // ───────────────────────────────── form handlers
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "goodWith") {
      setForm((prev) => ({
        ...prev,
        goodWith: value.split(",").map((t) => t.trim()).filter(Boolean),
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    }
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = editId
        ? `https://pawfecthome-4ein.onrender.com/api/pets/${editId}`
        : "https://pawfecthome-4ein.onrender.com/api/pets";
      const method = editId ? "PUT" : "POST";

      const formData = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === "goodWith") {
          formData.append("goodWith", (val || []).join(","));
        } else {
          formData.append(key, val);
        }
      });
      if (imageFile) formData.append("image", imageFile);

      const res = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error("Failed to save pet");

      resetForm();
      await fetchPets();
      setActiveTab("manage");
    } catch (err) {
      console.error(err);
      alert("Failed to save pet");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (pet) => {
    setForm({
      name: pet.name || "",
      type: pet.type || "",
      breed: pet.breed || "",
      age: pet.age || "",
      gender: pet.gender || "",
      image: pet.image || "",
      description: pet.description || "",
      vaccinated: !!pet.vaccinated,
      neutered: !!pet.neutered,
      goodWith: pet.goodWith || [],
      status: pet.status || "Available",
    });
    setEditId(pet._id);
    setImageFile(null);
    setPreview(null);
    setActiveTab("add");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;
    try {
      await fetch(`https://pawfecthome-4ein.onrender.com/api/pets/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPets();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
    window.dispatchEvent(new Event("userChanged"));
    navigate("/login");
  };

  // Unique types from data (for filter dropdown)
  const typeOptions = useMemo(() => {
    const set = new Set(
      pets
        .map((p) => (p.type || "").trim())
        .filter(Boolean)
        .map((t) => t[0].toUpperCase() + t.slice(1))
    );
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [pets]);

  // Filter + sort + search
  const filteredPets = useMemo(() => {
    const q = search.trim().toLowerCase();
    let arr = [...pets];

    // search
    if (q) {
      arr = arr.filter((p) => {
        const hay = `${p.name} ${p.type} ${p.breed} ${p.age} ${p.gender}`.toLowerCase();
        return hay.includes(q);
      });
    }

    // filters
    if (filterType !== "All") {
      arr = arr.filter((p) => (p.type || "").toLowerCase() === filterType.toLowerCase());
    }
    if (filterStatus !== "All") {
      arr = arr.filter((p) => (p.status || "") === filterStatus);
    }
    if (filterVaccinated !== "Any") {
      arr = arr.filter((p) => (!!p.vaccinated) === (filterVaccinated === "Yes"));
    }
    if (filterNeutered !== "Any") {
      arr = arr.filter((p) => (!!p.neutered) === (filterNeutered === "Yes"));
    }

    // sort
    arr.sort((a, b) => {
      if (sortBy === "name-asc") return (a.name || "").localeCompare(b.name || "");
      if (sortBy === "name-desc") return (b.name || "").localeCompare(a.name || "");
      if (sortBy === "status") return (a.status || "").localeCompare(b.status || "");
      // newest (default): by createdAt if available, else leave order
      const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return tb - ta;
    });

    return arr;
  }, [pets, search, filterType, filterStatus, filterVaccinated, filterNeutered, sortBy]);

  const stats = useMemo(() => {
    const total = pets.length;
    const available = pets.filter((p) => p.status === "Available").length;
    const adopted = pets.filter((p) => p.status === "Adopted").length;
    const pending = pets.filter((p) => p.status === "Pending").length;
    return { total, available, adopted, pending };
  }, [pets]);

  // ───────────────────────────────── Accounts tab logic
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  };

  const fetchAdmins = async () => {
    try {
      const res = await axios.get("https://pawfecthome-4ein.onrender.com/api/auth/admins", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAdmins(res.data.admins || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://pawfecthome-4ein.onrender.com/api/auth/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data.users || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveAdmin = async (id) => {
    try {
      await axios.delete(`https://pawfecthome-4ein.onrender.com/api/auth/remove-admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await Promise.all([fetchAdmins(), fetchUsers()]);
      showToast("✅ Admin removed successfully", "success");
    } catch {
      showToast("❌ Failed to remove admin", "error");
    }
  };

  const handleRemoveUser = async (id) => {
    try {
      await axios.delete(`https://pawfecthome-4ein.onrender.com/api/auth/remove-user/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchUsers();
      showToast("✅ User removed successfully", "success");
    } catch {
      showToast("❌ Failed to remove user", "error");
    }
  };

  const handlePromoteUser = async (id) => {
    try {
      await axios.put(
        `https://pawfecthome-4ein.onrender.com/api/auth/promote-user/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await Promise.all([fetchAdmins(), fetchUsers()]);
      showToast("🎉 User promoted to admin", "success");
    } catch {
      showToast("❌ Failed to promote user", "error");
    }
  };

  // Fetch accounts data when the Accounts tab is opened
  useEffect(() => {
    if (activeTab === "accounts") {
      fetchAdmins();
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  // ───────────────────────────────── ui helpers
  const NavBtn = ({ id, icon: Icon, label }) => {
    const active =
      (id === "dashboard" && activeTab === "dashboard") ||
      (id === "add" && activeTab === "add") ||
      (id === "manage" && activeTab === "manage") ||
      (id === "accounts" && activeTab === "accounts");

    return (
      <button
        onClick={() => setActiveTab(id)}
        className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition font-medium ${
          active ? "bg-orange-100 text-orange-600" : "text-gray-700 hover:bg-orange-50"
        }`}
      >
        <Icon className="w-5 h-5" />
        {label}
      </button>
    );
  };

  const clearFilters = () => {
    setFilterType("All");
    setFilterStatus("All");
    setFilterVaccinated("Any");
    setFilterNeutered("Any");
    setSortBy("newest");
  };

  // ───────────────────────────────── render
  return (
    <motion.section className="flex min-h-screen bg-gray-50 mt-20">
      {/* Sidebar (curvy) */}
      <aside
        className="bg-white border-r shadow-lg flex flex-col justify-between rounded-r-2xl overflow-hidden"
        style={{ width: 320 }}
      >
        {/* Top */}
        <div>
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-pink-500 p-6 text-white flex items-center gap-2">
            <PawPrint className="w-7 h-7" />
            <h1 className="text-2xl font-bold">Admin Panel</h1>
          </div>

          {/* Profile */}
          {user && (
            <div className="p-6 flex items-center gap-3 border-b">
              {user.avatarUrl ? (
                <img src={user.avatarUrl} alt="avatar" className="w-12 h-12 rounded-full border shadow" />
              ) : (
                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-orange-400 text-white font-bold">
                  {(user.name?.[0] || user.email?.[0] || "U").toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold text-gray-800">{user.name || "Admin User"}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <p className="text-xs text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          )}

          {/* Nav (internal tabs) */}
          <nav className="p-6 space-y-3">
            <NavBtn id="dashboard" icon={ClipboardList} label="Dashboard" />
            <NavBtn id="add" icon={PlusCircle} label="Add Pet" />
            <NavBtn id="manage" icon={Dog} label="Manage Pets" />
            {user?.role === "admin" && <NavBtn id="accounts" icon={ShieldCheck} label="Manage Accounts" />}
          </nav>
        </div>

        {/* Bottom */}
        <div className="p-6 border-t">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 font-medium"
          >
            <LogOut className="w-5 h-5" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 space-y-10">
        {/* ───────────────────────── Dashboard */}
        {activeTab === "dashboard" && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">📊 Dashboard</h2>
              <button
                onClick={fetchPets}
                className="px-4 py-2 rounded-lg border hover:bg-orange-50 text-gray-700 flex items-center gap-2"
              >
                {loadingPets ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                Refresh
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Pets" value={stats.total} />
              <StatCard title="Available" value={stats.available} badgeClass="bg-green-100 text-green-700" />
              <StatCard title="Adopted" value={stats.adopted} badgeClass="bg-gray-100 text-gray-700" />
              <StatCard title="Pending" value={stats.pending} badgeClass="bg-yellow-100 text-yellow-700" />
            </div>

            <div className="bg-white rounded-2xl shadow border p-6">
              <h3 className="text-lg font-semibold mb-2">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab("add")}
                  className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Add New Pet
                </button>
                <button
                  onClick={() => setActiveTab("manage")}
                  className="px-4 py-2 rounded-lg border hover:bg-orange-50 text-gray-700 flex items-center gap-2"
                >
                  <Dog className="w-4 h-4" /> Manage Pets
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ───────────────────────── Add / Edit Pet (in-page form) */}
        {activeTab === "add" && (
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="bg-white p-8 rounded-2xl shadow-xl border"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{editId ? "✏️ Edit Pet" : "➕ Add New Pet"}</h2>
              {editId && (
                <button
                  onClick={resetForm}
                  className="text-sm px-3 py-1 rounded-lg border hover:bg-gray-50 text-gray-600 flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" /> Cancel Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
              {/* Basic info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextInput name="name" value={form.name} onChange={handleChange} placeholder="Name" required />
                <TextInput name="type" value={form.type} onChange={handleChange} placeholder="Type (Dog, Cat...)" required />
                <TextInput name="breed" value={form.breed} onChange={handleChange} placeholder="Breed" required />
                <TextInput name="age" value={form.age} onChange={handleChange} placeholder="Age" required />
                <TextInput name="gender" value={form.gender} onChange={handleChange} placeholder="Gender" required />
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                >
                  <option value="Available">Available</option>
                  <option value="Adopted">Adopted</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>

              {/* Image */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block font-semibold text-gray-700 mb-2">Image Upload</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-4 py-3 border rounded-xl focus:outline-none"
                  />
                  <p className="text-sm text-gray-500 mt-1">
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

              <TextInput name="image" value={form.image} onChange={handleChange} placeholder="Image URL (optional)" />

              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
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

              <TextInput
                name="goodWith"
                value={(form.goodWith || []).join(", ")}
                onChange={handleChange}
                placeholder="Good with (comma separated, e.g., Kids, Dogs, Cats)"
              />

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 disabled:opacity-60 text-white font-bold py-3 rounded-xl shadow transition flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" /> Saving...
                  </>
                ) : editId ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" /> Save Changes
                  </>
                ) : (
                  <>
                    <PlusCircle className="w-5 h-5" /> Add Pet
                  </>
                )}
              </button>
            </form>
          </motion.div>
        )}

        {/* ───────────────────────── Manage Pets */}
        {activeTab === "manage" && (
          <motion.div variants={fadeUp} initial="hidden" animate="visible" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <h2 className="text-2xl font-bold">📋 Pets</h2>
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="🔍 Search pets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:outline-none"
                />
                <button
                  onClick={() => setActiveTab("add")}
                  className="px-4 py-2 rounded-lg bg-orange-500 text-white hover:bg-orange-600 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Add Pet
                </button>
              </div>
            </div>

            {/* Filter & Sort Bar */}
            <div className="bg-white rounded-2xl shadow border p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
              <div className="col-span-1">
                <label className="text-xs text-gray-500">Type</label>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none"
                >
                  {typeOptions.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label className="text-xs text-gray-500">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none"
                >
                  {["All", "Available", "Adopted", "Pending"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label className="text-xs text-gray-500">Vaccinated</label>
                <select
                  value={filterVaccinated}
                  onChange={(e) => setFilterVaccinated(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none"
                >
                  {["Any", "Yes", "No"].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label className="text-xs text-gray-500">Neutered</label>
                <select
                  value={filterNeutered}
                  onChange={(e) => setFilterNeutered(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none"
                >
                  {["Any", "Yes", "No"].map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-1">
                <label className="text-xs text-gray-500">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border rounded-xl focus:outline-none"
                >
                  <option value="newest">Newest</option>
                  <option value="name-asc">Name (A → Z)</option>
                  <option value="name-desc">Name (Z → A)</option>
                  <option value="status">Status</option>
                </select>
              </div>

              <div className="col-span-1 flex items-end">
                <button
                  onClick={clearFilters}
                  className="w-full px-3 py-2 rounded-xl border hover:bg-gray-50 text-gray-700"
                >
                  Clear
                </button>
              </div>
            </div>

            {loadingPets ? (
              <div className="flex items-center gap-2 text-gray-600">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading pets...
              </div>
            ) : filteredPets.length === 0 ? (
              <div className="bg-white rounded-2xl shadow border p-8 text-center text-gray-600">
                No pets found. Try adjusting your search/filters.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPets.map((pet) => (
                  <motion.div
                    key={pet._id}
                    whileHover={{ scale: 1.02 }}
                    className="bg-white rounded-2xl shadow-md overflow-hidden border"
                  >
                    <img src={toDisplayImage(pet.image)} alt={pet.name} className="w-full h-48 object-cover" />
                    <div className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-bold">{pet.name}</h3>
                        <span
                          className={`px-2 py-1 rounded-lg text-xs shrink-0 ${
                            pet.status === "Available"
                              ? "bg-green-100 text-green-700"
                              : pet.status === "Adopted"
                              ? "bg-gray-200 text-gray-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {pet.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {pet.type} • {pet.breed} • {pet.age}
                      </p>
                      <div className="flex gap-2 flex-wrap">
                        {pet.vaccinated && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-lg text-xs">Vaccinated</span>
                        )}
                        {pet.neutered && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs">Neutered</span>
                        )}
                        {(pet.goodWith || []).slice(0, 3).map((g, i) => (
                          <span key={i} className="bg-orange-50 text-orange-600 px-2 py-1 rounded-lg text-xs">
                            {g}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between mt-3">
                        <button
                          onClick={() => handleEdit(pet)}
                          className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                        >
                          <Edit3 className="w-4 h-4" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(pet._id)}
                          className="inline-flex items-center gap-1 text-red-600 hover:underline"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* ───────────────────────── Manage Accounts */}
        {activeTab === "accounts" && (
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center gap-3">
              <Shield className="w-7 h-7 text-orange-500" /> Manage Accounts
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Admins */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl shadow-md p-6 border"
              >
                <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-blue-600" /> Admins
                </h2>
                {admins.length > 0 ? (
                  <div className="space-y-3">
                    {admins.map((admin) => (
                      <div
                        key={admin._id}
                        className="flex flex-col p-4 rounded-lg border hover:bg-gray-50 transition"
                      >
                        <span className="font-medium text-gray-800">{admin.name}</span>
                        <span className="text-sm text-gray-500">{admin.email}</span>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                            Admin
                          </span>
                          {/* 🔄 ICON UPDATED: Remove Admin → ShieldX */}
                          <button
                            onClick={() => handleRemoveAdmin(admin._id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg shadow-md"
                            title="Remove Admin"
                          >
                            <ShieldX className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No admins found</p>
                )}
              </motion.div>

              {/* Users */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="bg-white rounded-2xl shadow-md p-6 border"
              >
                <h2 className="text-xl font-semibold text-gray-700 mb-6 flex items-center gap-2">
                  👥 Users
                </h2>
                {users.length > 0 ? (
                  <div className="space-y-3">
                    {users.map((u) => (
                      <div
                        key={u._id}
                        className="flex flex-col p-4 rounded-lg border hover:bg-gray-50 transition"
                      >
                        <span className="font-medium text-gray-800">{u.name}</span>
                        <span className="text-sm text-gray-500">{u.email}</span>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200 text-gray-700">
                            User
                          </span>
                          {/* 🔄 ICON UPDATED: Promote → ShieldCheck (to match Accounts theme) */}
                          <button
                            onClick={() => handlePromoteUser(u._id)}
                            className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-lg shadow-md"
                            title="Promote to Admin"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                          {/* 🔄 ICON UPDATED: Remove User → UserX */}
                          <button
                            onClick={() => handleRemoveUser(u._id)}
                            className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-lg shadow-md"
                            title="Remove User"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No users found</p>
                )}
              </motion.div>
            </div>

            {/* Optional toast (kept logic intact; render if you want) */}
            <AnimatePresence>
              {toast && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 50, scale: 0.9 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-xl text-white text-sm font-medium ${
                    toast.type === "error" ? "bg-red-600" : "bg-green-600"
                  }`}
                >
                  {toast.message}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </main>
    </motion.section>
  );
}

/** ───────────────────────────────── Reusable bits */
function StatCard({ title, value, badgeClass = "bg-orange-100 text-orange-700" }) {
  return (
    <div className="bg-white rounded-2xl shadow border p-5">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="mt-2 flex items-end justify-between">
        <div className="text-3xl font-extrabold">{value}</div>
        <span className={`text-xs px-2 py-1 rounded-lg ${badgeClass}`}>Live</span>
      </div>
    </div>
  );
}

function TextInput({ name, value, onChange, placeholder, required = false }) {
  return (
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
    />
  );
}
