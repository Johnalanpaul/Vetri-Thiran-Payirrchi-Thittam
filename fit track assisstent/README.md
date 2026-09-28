# AI FitTrack 3.0 — React + Express + MongoDB + Gemini

This version keeps the original FitTrack AI MVC backend.

## Added backend features
- Dashboard analytics endpoint: totals, 7-day activity, category breakdown and current streak.
- Profile management: age, height, weight, fitness goal and experience level.
- BMI calculation in the React profile screen using saved metrics.
- Workout pagination, category/date filters and safer user-scoped update/delete queries.
- Helmet security headers and configurable CORS.
- Existing JWT authentication, workout CRUD/search, Gemini recommendation and AI insight APIs remain available.

## Project structure
```
AI-FitTrack-React/
├── server/                  # Express/MongoDB/Gemini API
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── .env.example
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── lib/api.js
│   │   ├── main.jsx
│   │   └── styles.css
│   └── package.json
└── README.md
```

## Run backend
```cmd
cd server
npm install
copy .env.example .env
npm run dev
```
Set `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, `GEMINI_MODEL` and optionally `CLIENT_URL=http://localhost:5173`.

## Run React frontend
Open another terminal:
```cmd
cd client
npm install
npm run dev
```
Open the Vite URL shown in the terminal, normally `http://localhost:5173`.

The backend normally runs on `http://localhost:5000`.
To use another backend URL, create `client/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

## Notes
Do not commit `.env` or API keys. Postman is not required for this application; the React client is the primary API consumer.
