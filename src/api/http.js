import axios from "axios";
import Constants from "expo-constants";

const baseURL =
  Constants.expoConfig?.extra?.API_URL ||
  "http://localhost:3000";

console.log("API baseURL:", baseURL);

export const http = axios.create({
  baseURL,
  timeout: 30000,
});

let currentToken = null;
let currentRole = null;

export function setHttpAuth({ token, role }) {
  currentToken = token || null;
  currentRole = role || null;
}

http.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  if (currentToken) {
    config.headers.Authorization = `Bearer ${currentToken}`;
    return config;
  }

  if (currentRole === "teacher") {
    config.headers["x-user-type"] = "teacher";
  }
  if (currentRole === "student") {
    config.headers["x-user-type"] = "student";
  }

  return config;
});