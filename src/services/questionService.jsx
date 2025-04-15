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

const questionService = {
  getQuestions: (params) => request("GET", "question", null, {}, params),
  getQuestionDetail: (id, params) =>
    request("GET", `question/${id}`, null, {}, params),
  createQuestion: (questionData, topicParams) =>
    request("POST", `question/create`, questionData, null, topicParams),
  updateQuestionStatus: (questionId, params) =>
    request("PUT", `question/${questionId}`, null, {}, params),
};

export default questionService;
