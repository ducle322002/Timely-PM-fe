import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = "";
const request = async (method, url, data = null, headers = {}) => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
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
  login: (loginData) => request("POST", "user/auth", loginData),
  register: (registerData) => request("POST", `user/register`, registerData),
};

export default authService;
