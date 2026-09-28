// Vite exposes only environment variables prefixed with VITE_.
// Set VITE_API_BASE_URL during deployment to use a different backend.
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://expense-backend-c8nw.onrender.com";
