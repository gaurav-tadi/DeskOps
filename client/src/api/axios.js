import axios from "axios";

const apiBaseUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV
    ? `http://${window.location.hostname || "localhost"}:5000/api`
    : "");

if (!apiBaseUrl) {
  throw new Error("VITE_API_URL is required in production");
}

const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
});

export default api;
