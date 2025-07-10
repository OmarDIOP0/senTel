import { authorizedApi } from "../utils/api";

export const getAllProjets = async () => {
  const response = await authorizedApi().get("/projet");
  return response.data;
};

export const getProjetById = async (id) => {
  const response = await authorizedApi().get(`/projet/${id}`);
  return response.data;
};

export const createProjet = async (data) => {
  const response = await authorizedApi().post("/projet", data);
  return response.data;
};

export const updateProjet = async (data) => {
  const response = await authorizedApi().put("/projet/", data);
  return response.data;
};

export const deleteProjet = async (id) => {
  const response = await authorizedApi().delete(`/projet/${id}`);
  return response.data;
};
