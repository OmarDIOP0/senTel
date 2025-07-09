import axios from "axios";
import API_URL from "./apiUrl";

const getAuthHeader = () => {
  const tokenStr = localStorage.getItem("token");
  const token = tokenStr ? JSON.parse(tokenStr) : null;
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
  };
};

export const api = axios.create({
  baseURL: API_URL
});

export const authorizedApi = () => {
  return axios.create({
    baseURL: API_URL,
    headers: getAuthHeader().headers,
  });
};
