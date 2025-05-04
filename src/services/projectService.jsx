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

const projectService = {
  getProjects: () => request("GET", "project"),
  getProjectsForUser: () => request("GET", "project/user"),
  getMembers: (projectId) => request("GET", `member/${projectId}`),
  getMemberRequest: (projectId) =>
    request("GET", `member/${projectId}/pending`),
  inviteMember: (projectId, params) =>
    request("POST", `project/${projectId}/invite`, null, {}, params),
  createProjects: (projectData) =>
    request("POST", "project/create", projectData),
  getProjectsById: (id) => request("GET", `project/${id}`),
  deleteProject: (id) => request("DELETE", `project/${id}`),
  closeProject: (id) => request("POST", `project/${id}/close`),

  removeMember: (projectId, params) =>
    request("DELETE", `project/${projectId}/delete/member`, null, {}, params),

  joinProject: (params) => request("POST", `project/join`, null, {}, params),
  statusMember: (projectId, params) =>
    request("PUT", `member/${projectId}/status`, null, {}, params),

  getTasksForProject: (projectId) =>
    request("GET", `task/task/${projectId}/project`),
  getIssuesForProject: (projectId) =>
    request("GET", `issue/issue/${projectId}/project`),
  getProjectLog: (projectId) => request("GET", `activity/${projectId}`),

  updateProject: (projectId, projectData) =>
    request("PUT", `project/${projectId}`, projectData),

  deleteTopic: (topicId, params) =>
    request("DELETE", `topic/${topicId}`, null, {}, params),

  activeProject: (projectId) => request("POST", `project/${projectId}/process`),

  getProjectDocument: (projectId) =>
    request("GET", `file/${projectId}/project`),

  deleteProjectDocument: (fileId) =>
    request("DELETE", `file/delete/${fileId}/file`),

  uploadProjectDocument: (projectId, data) =>
    request("POST", `file/${projectId}/project`, data),
};

export default projectService;
