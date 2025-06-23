import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8080/api/v1", // Ensure this is correct
});

export default instance;
