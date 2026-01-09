import axios from "axios";
import Constants from "expo-constants";

const baseURL = Constants.expoConfig?.extra?.API_URL;

export const http = axios.create({
  baseURL,
  timeout: 30000,
});

let authToken = null;

export function setHttpAuth(token) {
  authToken = token;
}

export function clearHttpAuth() {
  authToken = null;
}

http.interceptors.request.use((config) => {
  config.headers = config.headers || {};

  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }

  return config;
});
