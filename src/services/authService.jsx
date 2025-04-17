import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const request = async (method, url, data = null, headers = {}, params = {}) => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
      data,
      headers: {
        ...headers,
      },
      params,
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
  loginWithGoogle: (params) =>
    request("POST", `user/google-auth/login`, null, {}, params),

  verifyOTP: (params) => request("POST", "user/verify-email", null, {}, params),
  resendOTP: (params) => request("POST", "user/resend-email", null, {}, params),
  forgotPassword: (params) =>
    request("POST", "user/forgot-password", null, {}, params),

  changeForgotPassword: (data) =>
    request("POST", "user/change-forgot-password", data),
};

export default authService;
