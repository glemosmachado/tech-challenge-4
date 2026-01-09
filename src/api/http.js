import axios from "axios";
import Constants from "expo-constants";

const baseURL = Constants.expoConfig?.extra?.API_URL;

export const http = axios.create({ baseURL });

let currentToken = null;

export function setHttpAuth(token) {
  currentToken = token;
}

export function clearHttpAuth() {
  currentToken = null;
}

http.interceptors.request.use((config) => {
  if (currentToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${currentToken}`;
  }
  return config;
});
