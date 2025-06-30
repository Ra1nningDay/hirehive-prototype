import axios from "axios";

const serverURL = process.env.NEXT_PUBLIC_SERVER_API_URL;
// console.log("Server URL:", serverURL);

const api = axios.create({
  baseURL: serverURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
