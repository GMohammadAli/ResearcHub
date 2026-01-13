export const config = {
  API_BASE_URL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  AUTH_TOKEN: import.meta.env.VITE_APP_SECRET_AUTH_TOKEN || "mysecret123",
};
