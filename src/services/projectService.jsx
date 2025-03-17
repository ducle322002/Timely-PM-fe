import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const request = async (method, url, data = null, headers = {}) => {
  try {
    const accessToken = Cookies.get("token")?.replaceAll('"', "");

    const authHeaders = accessToken
      ? { Authorization: `Bearer ${accessToken}` }
      : {};

    const response = await axios({
      method,
      url: `${API_BASE_URL}${url}`,
      data,
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
  // getProducts: () => request("GET", "/products"),
  // getProductById: (id) => request("GET", `/products/${id}`),
  // createProduct: (productData) => request("POST", "/products", productData),
  // updateProduct: (id, productData) =>
  //   request("PUT", `/products/${id}`, productData),
  // deleteProduct: (id) => request("DELETE", `/products/${id}`),
  getProjects: () => request("GET", "project"),
  createProjects: (projectData) =>
    request("POST", "project/create", projectData),
  getProjectsById: (id) => request("GET", `project/${id}`),
  deleteProject: (id) => request("DELETE", `project/${id}`),
};

export default projectService;
