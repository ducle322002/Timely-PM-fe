import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const request = async (method, url, data = null, headers = {}, params = {}) => {
  try {
    const accessToken = Cookies.get("token")?.replaceAll('"', "");

    const authHeaders = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

    const response = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
      data,
      params,
      headers: {
        ...authHeaders,
        ...headers,
      },
    });

    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

const userService = {
  getUserProfile: () => request("GET", "user"),
  updateProfile: (data) => request("POST", "user/update-profile", data),
  sendFeedback: (data) => request("POST", "feedback/create", data),
  uploadAvatar: (data) =>
    request("POST", "user/upload-avatar", data, {
      "Content-Type": "multipart/form-data",
    }),

  changePassword: (data) => request("POST", "user/change-password", data),
};

export default userService;
