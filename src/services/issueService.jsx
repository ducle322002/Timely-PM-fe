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

const issueService = {
  getIssues: (params) => request("GET", "issue", null, {}, params),
  getIssueDetail: (id, params) =>
    request("GET", `issue/${id}`, null, {}, params),
  createIssue: (issueData, topicParams) =>
    request("POST", `issue/create`, issueData, null, topicParams),
  updateIssueStataus: (issueId, params) =>
    request("PUT", `issue/${issueId}`, null, {}, params),
};

export default issueService;
