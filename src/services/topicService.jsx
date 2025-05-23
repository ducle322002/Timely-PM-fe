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

const topicService = {
  getTopics: (params) => request("GET", "topic", null, {}, params),
  createTopic: (topicData) => request("POST", `topic/create`, topicData),
  updateTopic: (id, topicData, params) =>
    request("PUT", `topic/${id}`, topicData, {}, params),
};

export default topicService;
