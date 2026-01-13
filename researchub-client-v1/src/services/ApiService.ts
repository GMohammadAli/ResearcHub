import axios from "axios";
import { config } from "../config";

//TODO, use interceptors for efficient response handling and make integration easy
const ApiService = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${config.AUTH_TOKEN}`,
  },
});

export default ApiService;
