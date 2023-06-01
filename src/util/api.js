import apiEndPoints from "@/constants/apiEndpoints";
import axios from "axios";

const api = axios.create({
  baseURL: apiEndPoints.BASE_URL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
