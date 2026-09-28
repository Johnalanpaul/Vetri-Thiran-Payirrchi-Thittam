/* =========================================================
   AI FITTRACK
   API SERVICE
   ========================================================= */


/* =========================================================
   1. API CONFIGURATION
   ========================================================= */

const API_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:5000/api";


/* =========================================================
   2. MAIN API REQUEST FUNCTION
   ========================================================= */

export async function api(path, options = {}) {

  /* -------------------------------------------------------
     Get JWT token from browser storage
     ------------------------------------------------------- */

  const token = localStorage.getItem("fittrack_token");


  /* -------------------------------------------------------
     Prepare request headers
     ------------------------------------------------------- */

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };


  /* -------------------------------------------------------
     Add JWT Authorization header
     ------------------------------------------------------- */

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }


  /* -------------------------------------------------------
     Send request to backend
     ------------------------------------------------------- */

  const response = await fetch(
    `${API_URL}${path}`,
    {
      ...options,
      headers,
    }
  );


  /* -------------------------------------------------------
     Read JSON response
     ------------------------------------------------------- */

  const data = await response
    .json()
    .catch(() => ({
      error: "Invalid server response",
    }));


  /* -------------------------------------------------------
     Handle API errors
     ------------------------------------------------------- */

  if (!response.ok) {
    throw new Error(
      data.error || "Request failed"
    );
  }


  /* -------------------------------------------------------
     Return successful response
     ------------------------------------------------------- */

  return data;
}


/* =========================================================
   3. AUTHENTICATION STORAGE
   ========================================================= */

export const auth = {

  /* -------------------------------------------------------
     Get logged-in user
     ------------------------------------------------------- */

  get: () => {

    const user =
      localStorage.getItem("fittrack_user");

    return user
      ? JSON.parse(user)
      : null;
  },


  /* -------------------------------------------------------
     Save JWT token + user
     ------------------------------------------------------- */

  set: (token, user) => {

    localStorage.setItem(
      "fittrack_token",
      token
    );

    localStorage.setItem(
      "fittrack_user",
      JSON.stringify(user)
    );
  },


  /* -------------------------------------------------------
     Clear authentication data
     ------------------------------------------------------- */

  clear: () => {

    localStorage.removeItem(
      "fittrack_token"
    );

    localStorage.removeItem(
      "fittrack_user"
    );
  },
};