import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach JWT Token
API.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    console.log("Sending Token:", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;

  },
  (error) => Promise.reject(error)
);

export default API;