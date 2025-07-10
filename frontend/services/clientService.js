import { authorizedApi } from "../utils/api";

export const getAllClients = async () => {
  const response = await authorizedApi().get("/client");
  return response.data;
};

export const updateAttenuation = async (data) => {
  const response = await authorizedApi().put("/client", data);
  return response.data;
};  