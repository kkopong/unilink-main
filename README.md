🧠 UniLink
UniLink is a student-centered mobile platform that helps university students discover internships, events, maps, and profile services within their academic ecosystem.
It consists of:

📱 A React Native (Expo) frontend

🧠 A Node.js/Express backend with Supabase as the primary database/auth provider

📁 Project Structure
bash
Copy
Edit
unilink/
├── unilink-frontend/          # React Native (Expo) mobile app
│   ├── app/                   # Screens (Login, Home, Internships, etc.)
│   ├── assets/                # Logos, images, icons
│   └── App.jsx                # Navigation and route config
│
└── unilink-backend/           # Node.js backend
    ├── controllers/           # Logic for routes
    ├── routes/                # API routes (e.g., /auth, /internships)
    ├── services/              # Supabase client config
    ├── .env                   # Supabase credentials
    └── server.js              # Express server setup
🚀 Getting Started
🔧 Prerequisites
Node.js (v18+)

npm

Expo CLI (npm install -g expo-cli)

Supabase account + project

🖥️ Backend Setup (Node.js + Supabase)
1. Go to the backend folder
bash
Copy
Edit
cd unilink/unilink-backend
2. Install dependencies
bash
Copy
Edit
npm install
3. Create .env file
Create a .env file in the root of unilink-backend and add:

ini
Copy
Edit
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
PORT=5000
❗ Replace values with those from your Supabase project.

4. Start the server
bash
Copy
Edit
npm start
The server will run on http://localhost:5000

📱 Frontend Setup (React Native with Expo)
1. Go to the frontend folder
bash
Copy
Edit
cd unilink/unilink-frontend
2. Install dependencies
bash
Copy
Edit
npm install
3. Start Expo
bash
Copy
Edit
npx expo start
You can now open the app in:

Android/iOS simulator

Expo Go on a physical device (scan QR)

🧠 Features
✅ Frontend (Expo)
Onboarding screen

Login/Signup using Supabase Auth

Explore internships

Interactive map (for in-person campus events)

Notifications page

User settings & profile page

Sticky bottom navigation

⚙️ Backend (Node.js)
Auth endpoints (/login, /register)

Internship CRUD (/api/internships)

Supabase client abstraction

CORS and Express middleware setup

🔒 Security
DO NOT commit .env or sensitive keys to GitHub

.gitignore should include:

bash
Copy
Edit
.env
node_modules/
If you accidentally pushed it:

bash
Copy
Edit
git rm --cached .env
echo ".env" >> .gitignore
git add .gitignore
git commit -m "Remove .env from repo"
git push
📡 API Example
http
Copy
Edit
GET /api/internships
Content-Type: application/json

[
  {
    "title": "Software Engineering Intern",
    "company": "TechNova",
    "location": "Remote",
    "duration": "3 Months",
    ...
  }
]
👥 Contributors
Backend: Amofa Bright

Frontend: Allan Osei

📜 License
This project is licensed under the MIT License.