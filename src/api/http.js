import axios from "axios";
import Constants from "expo-constants";

const baseURL =
  Constants.expoConfig?.extra?.API_URL ||
  Constants.manifest?.extra?.API_URL ||
  "https://tech-challenge-2-d1kb.onrender.com";

console.log("API baseURL:", baseURL);

export const http = axios.create({
  baseURL,
  timeout: 60000,
});

let currentRole = null;

export function setHttpRole(role) {
  currentRole = role;
}

http.interceptors.request.use((config) => {
  const method = (config.method || "get").toUpperCase();
  console.log("REQ:", method, `${config.baseURL}${config.url}`);

  if (currentRole === "teacher") {
    config.headers = config.headers || {};
    config.headers["x-user-type"] = "teacher";
  }
  return config;
});
