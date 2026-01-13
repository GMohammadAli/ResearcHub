import axios from "axios";
import { config } from "../config";
import { store } from "@/store/store";
import { logoutSuccess } from "@/store/slices/authSlice";

//TODO, use interceptors for efficient response handling and make integration easy
const ApiService = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, //Send cookies
});

// Response interceptor - handle 401 errors
ApiService.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Session expired
      store.dispatch(logoutSuccess());

      // Only redirect if not already on login page
      if (!window.location.pathname.includes("/chat/home")) {
        window.location.href = "/chat/home";
      }
    }
    return Promise.reject(error);
  }
);

export default ApiService;
