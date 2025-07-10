import { authorizedApi } from "../utils/api";

export const getAllClients = async () => {
  const response = await authorizedApi().get("/client");
  console.log("Response from getAllClients:", response.data);
  return response.data;
};

export const updateClient = async (data) => {
  const response = await authorizedApi().put("/client", data);
  return response.data;
};  