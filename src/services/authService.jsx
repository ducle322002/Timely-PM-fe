import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const request = async (method, url, data = null, headers = {}) => {
  try {
    const response = await axios({
      method,
      url: `${url}`,
      data,
      headers: {
        ...headers,
      },
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const authService = {
  login: (loginData) => request("POST", "/api/user/auth", loginData),
  register: (registerData) => request("POST", `user/register`, registerData),
};

export default authService;
