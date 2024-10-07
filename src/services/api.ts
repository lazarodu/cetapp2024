import axios from "axios";

export const api = axios.create({
  baseURL: "https://cet2024.onrender.com/api",
  headers: {
    Accept: 'application/json',
  }
})
