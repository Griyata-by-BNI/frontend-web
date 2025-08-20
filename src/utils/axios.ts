import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_URL ||
    "https://bf64d6793881.ngrok-free.app/api/v1",
    headers: {
      "ngrok-skip-browser-warning": "true", 
    }
});

export default axiosInstance;
