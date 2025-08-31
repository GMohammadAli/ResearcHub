import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

//TODO, use interceptors for efficient response handling and make integration easy

//api service connection to ai engine
const ApiService = axios.create({
  baseURL: process.env.AI_ENGINE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default ApiService;
