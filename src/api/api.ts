import axios from "axios";

export const API_BASE_URL = process.env.REACT_APP_API_URL;

if (!API_BASE_URL) {
  throw new Error("REACT_APP_API_URL is not defined");
}

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false,
  timeout: 10000,
});

export default api;
