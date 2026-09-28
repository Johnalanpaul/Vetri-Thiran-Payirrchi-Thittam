# AI FitTrack — Active Full-Stack Version

AI FitTrack is a fitness tracking application based on the supplied project document.

## Implemented from the project document

- JWT registration, login and protected profile
- Secure bcrypt password hashing
- Workout CRUD: add, view, update and delete
- Workout search by name/category/date
- Workout statistics: total workouts, total duration, calories, average duration
- Google Gemini workout recommendations using age, fitness goal and experience
- Gemini fitness insights using workout statistics
- MVC-style backend separation: models, controllers, routes, middleware and services
- Centralized JSON error handling
- MongoDB persistence
- Responsive dashboard frontend

## Project structure

```text
AI-FitTrack-API/
├── public/
│   ├── index.html
│   ├── css/style.css
│   └── js/app.js
├── src/
│   ├── config/db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/geminiService.js
│   ├── app.js
│   └── server.js
├── .env
├── .env.example
├── package.json
└── FitTrack.postman_collection.json
```

## Run

1. Install Node.js and MongoDB.
2. Open a terminal in `code`.
3. Run `npm install`.
4. Create `.env` from `.env.example` and set your MongoDB URI, JWT secret and Gemini API key.
5. Run `npm run dev` or `npm start`.
6. Open `http://localhost:5000`.

The browser UI is served by Express, so no separate frontend server is required.

## Important

The AI features require a valid Gemini API key. The app stores only the JWT token in browser localStorage for the demo frontend. For production deployment, add stronger security controls, HTTPS, rate limiting, refresh-token/session strategy, and a production-grade secret-management approach.
