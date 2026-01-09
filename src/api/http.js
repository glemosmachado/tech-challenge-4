import axios from "axios";
import Constants from "expo-constants";

const baseURL =
  Constants.expoConfig?.extra?.API_URL ||
  Constants.manifest?.extra?.API_URL ||
  process.env.EXPO_PUBLIC_API_URL;

if (!baseURL) {
  console.log(
    "[API] baseURL indefinida. Configure API_URL em app.json (extra) ou EXPO_PUBLIC_API_URL."
  );
} else {
  console.log("[API] baseURL =", baseURL);
}

export const http = axios.create({
  baseURL,
  timeout: 30000,
});

let authToken = null;

export function setHttpAuth(token) {
  authToken = token || null;
}

export function clearHttpAuth() {
  authToken = null;
}

http.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  if (!config.headers["Content-Type"] && !config.headers["content-type"]) {
    config.headers["Content-Type"] = "application/json";
  }

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const data = err?.response?.data;
    if (status) {
      console.log("[API] ERROR", status, data);
    } else {
      console.log("[API] ERROR", err?.message);
    }
    return Promise.reject(err);
  }
);
