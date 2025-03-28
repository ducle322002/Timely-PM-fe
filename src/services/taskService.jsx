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

const taskService = {
  getTopics: (params) => request("GET", "topic", null, {}, params),
  getTasks: (params) => request("GET", "task", null, {}, params),
  getTasksDetail: (id, params) =>
    request("GET", `task/${id}`, null, {}, params),
  createTask: (taskData, topicParams) =>
    request("POST", `task/create`, taskData, null, topicParams),

  createIssueInTask: (taskId, issueData, taskParams) =>
    request("POST", `task/${taskId}/issue`, issueData, null, taskParams),
  updateTaskStatus: (taskId, taskParams) =>
    request("PUT", `task/${taskId}`, null, null, taskParams),
};

export default taskService;
