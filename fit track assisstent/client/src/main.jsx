/* =========================================================
   AI FITTRACK
   MAIN REACT APPLICATION
   ========================================================= */


/* =========================================================
   1. IMPORTS
   ========================================================= */

import React, {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  createRoot
} from "react-dom/client";

import {
  Activity,
  BarChart3,
  Brain,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  UserRound,
  Watch,
  Flame,
  Clock3
} from "lucide-react";

import {
  api,
  auth
} from "./lib/api";

import "./styles.css";


/* =========================================================
   2. APPLICATION CONSTANTS
   ========================================================= */

const nav = [
  ["dashboard", "Dashboard", BarChart3],
  ["workouts", "Workouts", Activity],
  ["coach", "AI Coach", Sparkles],
  ["insights", "Insights", Brain],
  ["profile", "Profile", UserRound]
];


const categories = [
  "Cardio",
  "Strength Training",
  "Yoga",
  "Running",
  "Cycling",
  "Walking"
];


/* =========================================================
   3. MAIN APP COMPONENT
   ========================================================= */

function App() {

  const [user, setUser] =
    useState(auth.get());

  const [view, setView] =
    useState("dashboard");

  const [dash, setDash] =
    useState(null);

  const [workouts, setWorkouts] =
    useState([]);

  const [profile, setProfile] =
    useState(user);

  const [toast, setToast] =
    useState("");

  const [openAddWorkout, setOpenAddWorkout] =
    useState(false);


  /* -------------------------------------------------------
     Notification
     ------------------------------------------------------- */

  const notify = (message) => {

    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };


  /* -------------------------------------------------------
     Refresh application data
     ------------------------------------------------------- */

  const refresh = async () => {

    if (!auth.get()) {
      return;
    }

    try {

      const [dashboardResponse, profileResponse] =
        await Promise.all([
          api("/dashboard"),
          api("/auth/profile")
        ]);


      setDash(
        dashboardResponse.data
      );


      setProfile(
        profileResponse.user
      );


      setUser(
        profileResponse.user
      );


      auth.set(
        localStorage.getItem("fittrack_token"),
        profileResponse.user
      );


      const workoutResponse =
        await api("/workouts?limit=50");


      setWorkouts(
        workoutResponse.data
      );

    } catch (error) {

      notify(error.message);
    }
  };


  /* -------------------------------------------------------
     Load application data
     ------------------------------------------------------- */

  useEffect(() => {
    refresh();
  }, []);


  /* -------------------------------------------------------
     Authentication screen
     ------------------------------------------------------- */

  if (!user) {

    return (
      <Auth
        onLogin={(loggedInUser, token) => {

          auth.set(
            token,
            loggedInUser
          );

          setUser(loggedInUser);
          setProfile(loggedInUser);
        }}
      />
    );
  }


  /* -------------------------------------------------------
     Logout
     ------------------------------------------------------- */

  const logout = () => {

    auth.clear();

    setUser(null);
  };


  /* -------------------------------------------------------
     Main application
     ------------------------------------------------------- */

  return (
    <div className="shell">

      {/* =================================================
          SIDEBAR
          ================================================= */}

      <aside>

        <div className="logo">

          <div className="logoMark">
            ✦
          </div>

          <div>
            AI<span>FitTrack</span>
          </div>

        </div>


        {/* User information */}

        <div className="userMini">

          <div className="avatar">
            {(profile?.name || "U")[0]}
          </div>

          <div>

            <b>
              {profile?.name || "Athlete"}
            </b>

            <small>
              {profile?.email}
            </small>

          </div>

        </div>


        {/* Navigation */}

        <nav>

          {nav.map(
            ([id, label, Icon]) => (

              <button
                className={
                  view === id
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setView(id)
                }
                key={id}
              >

                <Icon size={18} />

                {label}

              </button>

            )
          )}

        </nav>


        {/* Sidebar bottom */}

        <div className="sideBottom">

          <div className="secure">

            <ShieldCheck size={16} />

            <span>
              JWT Protected
            </span>

          </div>


          <button onClick={logout}>

            <LogOut size={17} />

            Sign out

          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN CONTENT
          ================================================= */}

      <main>

        {/* Header */}

        <header>

          <div>

            <span className="eyebrow">
              FITNESS COMMAND CENTER
            </span>

            <h1>
              {
                nav.find(
                  item => item[0] === view
                )?.[1]
              }
            </h1>

          </div>


          <button
            className="primary"
            onClick={() => {

              setView("workouts");

              setOpenAddWorkout(true);

            }}
          >

            <Plus size={18} />

            Add Workout

          </button>

        </header>


        {/* =================================================
            DASHBOARD
            ================================================= */}

        {view === "dashboard" && (

          <Dashboard
            dash={dash}
            workouts={workouts}
            setView={setView}
          />

        )}


        {/* =================================================
            WORKOUTS
            ================================================= */}

        {view === "workouts" && (

          <Workouts
            workouts={workouts}
            reload={refresh}
            notify={notify}
            openAdd={openAddWorkout}
            onAddOpened={() =>
              setOpenAddWorkout(false)
            }
          />

        )}


        {/* =================================================
            AI COACH
            ================================================= */}

        {view === "coach" && (

          <Coach
            profile={profile}
          />

        )}


        {/* =================================================
            INSIGHTS
            ================================================= */}

        {view === "insights" && (

          <Insights
            dash={dash}
          />

        )}


        {/* =================================================
            PROFILE
            ================================================= */}

        {view === "profile" && (

          <Profile
            profile={profile}

            setProfile={(updatedProfile) => {

              setProfile(updatedProfile);
              setUser(updatedProfile);

              auth.set(
                localStorage.getItem(
                  "fittrack_token"
                ),
                updatedProfile
              );
            }}

            notify={notify}
          />

        )}

      </main>


      {/* =================================================
          TOAST
          ================================================= */}

      {toast && (

        <div className="toast">
          {toast}
        </div>

      )}

    </div>
  );
}


/* =========================================================
   4. AUTHENTICATION
   ========================================================= */

/*
   Keep your existing Auth component here.
*/


/* =========================================================
   5. DASHBOARD
   ========================================================= */

/*
   Keep your existing Dashboard component here.
*/


/* =========================================================
   6. WORKOUT MANAGEMENT
   ========================================================= */

/*
   Keep your existing Workouts component here.
*/


/* =========================================================
   7. WORKOUT MODAL
   ========================================================= */

/*
   Keep your existing WorkoutModal component here.
*/


/* =========================================================
   8. AI COACH
   ========================================================= */

/*
   Keep your existing Coach component here.
*/


/* =========================================================
   9. AI FITNESS INSIGHTS
   ========================================================= */

/*
   Keep your existing Insights component here.
*/


/* =========================================================
   10. USER PROFILE
   ========================================================= */

/*
   Keep your existing Profile component here.
*/


/* =========================================================
   11. COMMON COMPONENTS
   ========================================================= */

function Loading() {

  return (
    <div className="loading">
      Loading your fitness data…
    </div>
  );
}


function Empty({ text }) {

  return (
    <div className="empty">
      {text}
    </div>
  );
}


/* =========================================================
   12. REACT APPLICATION START
   ========================================================= */

createRoot(
  document.getElementById("root")
).render(
  <App />
);