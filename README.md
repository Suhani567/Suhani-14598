# 🚀 Dynamic No-Code Forms App (MERN Stack)

## 📋 Overview
Complete **no-code dynamic forms platform** built with **MERN stack**. Create, customize, manage forms without coding. Users fill forms, admins view analytics/export data.

## ✨ Features
```
✅ Admin Dashboard (login/register)
✅ Drag & Drop Form Builder (text, dropdown, checkbox, radio, textarea)
✅ Live Preview & Customization (colors, fonts, layout)
✅ Form Management (CRUD, duplicate)
✅ Public Form Filling (responsive)
✅ Submissions Storage (MongoDB)
✅ Data Viewer (table, charts, CSV export)
✅ Analytics Dashboard (trends, stats)
✅ Theme Customizer (CSS/logo)
✅ JWT Auth
✅ Responsive UI (Tailwind)
```

## 🛠 Tech Stack
```
Frontend: React 18 + Vite + TailwindCSS + React DnD + Recharts
Backend: Node.js + Express + Mongoose
Database: MongoDB Atlas
Auth: JWT + bcrypt
Deployment: Vercel (FE) + Render (BE)
```

## 🎯 Quick Start (Local)

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (URI in backend/.env)

### Backend
```bash
cd backend
npm install
npm start
# http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# http://localhost:3001/admin/login
```

**Test Login:** `admin@test.com` / `password`

## 📁 Project Structure
```
dynamic-forms-app/
├── backend/           # Node/Express API
│   ├── models/        # Form, Submission, Admin
│   ├── routes/api/    # auth, forms, submissions
│   ├── server.js
│   └── .env           # MONGO_URI, JWT_SECRET
├── frontend/          # React Vite App
│   ├── src/components/ # All UI
│   ├── src/contexts/  # AuthContext
│   ├── vite.config.js # API proxy
│   └── tailwind.config.js
└── README.md
```

## 🔧 Environment Variables
**backend/.env:**
```
MONGO_URI=mongodb+srv://admin:pass@cluster0.pbw9aab.mongodb.net/?appName=Cluster0
JWT_SECRET=your_super_secret_key_here_min32chars
PORT=5000
```

**frontend/.env (optional):**
```
VITE_API_URL=http://localhost:5000/api
```

## 🌐 Deployment

### Backend (Render.com)
1. render.com → New Web Service → GitHub repo
2. **Build Command:** `npm install`
3. **Start Command:** `npm start`
4. **Env Vars:**
   ```
   MONGO_URI=your_atlas_uri
   JWT_SECRET=supersecret123
   ```

### Frontend (Vercel)
1. vercel.com → Import GitHub repo
2. **Build:** `npm run build`
3. **Output:** `dist`
4. **Env:** `VITE_API_URL=https://your-backend.onrender.com/api`

### MongoDB Atlas
1. atlas.mongodb.com → Network Access → 0.0.0.0/0
2. Copy connection string to backend/.env

## 🚀 API Endpoints
```
POST /api/auth/login     # {email, password}
GET /api/forms           # Admin forms (auth)
POST /api/forms          # Create form
PUT /api/forms/:id       # Update
DELETE /api/forms/:id
GET /api/forms/:id       # Public form
POST /api/submissions    # Submit response
GET /api/submissions/:formId # Admin data
```

## 📱 Screenshots
```
<img width="1698" height="883" alt="image" src="https://github.com/user-attachments/assets/5bf396c4-4532-4bc0-be6c-1b773bcdddca" />

<img width="786" height="648" alt="image" src="https://github.com/user-attachments/assets/8b1c8e01-4282-4f83-80e7-1341116cb8f2" />

<img width="1159" height="911" alt="image" src="https://github.com/user-attachments/assets/f27f0605-5021-47d7-8945-009985a51367" />

```

## 🤝 Contributing
```
git clone repo
npm install (both dirs)
npm run dev
```

## 📄 License
MIT - Use freely!

## 👨‍💻 Author
Suhani 🤍

⭐ Star if helpful!

