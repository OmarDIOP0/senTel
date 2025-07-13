import { authorizedApi } from "../utils/api";

export const getAllRapports = async () => {
  const response = await authorizedApi().get("/dimensionnement/rapport");
  return response.data;
};

export const getRapportById = async (id) => {
  const response = await authorizedApi().get(`/dimensionnement/rapport/${id}`);
  return response.data;
};