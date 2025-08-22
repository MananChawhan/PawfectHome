# 🐾 PawfectHome - Pet Adoption Platform

A full-stack **MERN** (MongoDB, Express, React, Node.js) project where users can browse pets, sign up/login, and admins can manage pet listings.

---

## 🚀 Project Setup

### 1️⃣ Clone the Repository
```bash
git clone <your-repo-url>
cd PawfectHome
```
📌 This command copies the repository to your local system and navigates into the project folder.

---

## ⚙️ Backend Setup (Express + MongoDB)

1. Navigate to backend folder:
```bash
cd backend
```
📌 This moves into the backend directory where server code is located.

2. Install dependencies:
```bash
npm install
```
📌 Installs all required npm packages listed in `package.json` for backend.

3. Create a `.env` file inside `backend/`:
```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pawfecthome   # or your MongoDB Atlas URI
JWT_SECRET=your_secret_key
ADMIN_EMAIL=mananchawhan@pawfect.com
ADMIN_PASSWORD=yourpassword
```
📌 Configuration for MongoDB connection, JWT auth, and admin credentials.

4. Run the backend:
```bash
npm run dev
```
📌 Starts backend server at `http://localhost:5000`.

---

## 🎨 Frontend Setup (React + Vite + Tailwind)

1. Go back to project root:
```bash
cd ..
```
📌 Returns to project root folder.

2. Install frontend dependencies:
```bash
npm install
```
📌 Installs all required npm packages for frontend (React + Vite).

3. Run frontend:
```bash
npm run dev
```
📌 Starts frontend server at `http://localhost:5173`.

---

## 📂 Project Structure

```
PawfectHome/
│── backend/         # Express backend
│   ├── config/      # Database config
│   ├── controllers/ # Pet & auth logic
│   ├── middleware/  # Auth middlewares
│   ├── models/      # Mongoose models
│   ├── routes/      # API routes
│   ├── uploads/     # Uploaded images
│   └── server.js    # Entry point
│
│── src/             # React frontend
│   ├── assets/      # Images
│   ├── components/  # Reusable UI
│   ├── pages/       # Pages (Home, Pets, Login, Admin, etc.)
│   ├── styles/      # Tailwind styles
│   ├── App.jsx
│   └── main.jsx
│
├── package.json     # Frontend config
├── vite.config.js   # Vite config
└── README.md
```

---

## 🔑 Default Admin User
After starting the backend, visit:

👉 `http://localhost:5000/api/auth/seed-admin`

This will create a default admin with:
- **Email**: `mananchawhan@pawfect.com`
- **Password**: value from `.env` → `ADMIN_PASSWORD`

---

## 🛠 Available Scripts

### Backend
- `npm run dev` → start backend in dev mode (with nodemon)
- `npm start` → start backend normally

### Frontend
- `npm run dev` → run React app
- `npm run build` → build for production
- `npm run preview` → preview production build

---

## 🌍 Deployment
- **Database**: Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free)
- **Backend**: Deploy to [Render](https://render.com)
- **Frontend**: Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com)
