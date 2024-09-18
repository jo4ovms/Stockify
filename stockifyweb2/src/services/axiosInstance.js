import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5173",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
