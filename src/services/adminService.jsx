import create from "@ant-design/icons/lib/components/IconFont";
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

const adminService = {
  getAllUser: () => request("GET", "user/get-all"),
  getDataDashboard: () => request("GET", "admin/dashboard"),
  getAllProject: () => request("GET", "admin/project"),
  banUser: (userId) => request("DELETE", `user/${userId}`),

  getAllNews: () => request("GET", "news"),
  createNews: (data) => request("POST", "news/create", data),
  deleteNews: (newsId) => request("DELETE", `news/${newsId}`),
  imageNews: (data) =>
    request("POST", "news/image", data, {
      "Content-Type": "multipart/form-data",
    }),

  getBlogDetail: (newsId) => request("GET", `news/${newsId}`),
};

export default adminService;
