import axios from "axios";
import { jwtDecode } from "jwt-decode";

const API_URL = "http://localhost:3005/api/auth";

// Register a new user
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data; // returns token
  } catch (error) {
    throw error.response
      ? error.response.data
      : new Error("Registration failed");
  }
};

// Login an existing user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error("Login failed");
  }
};