import { authorizedApi } from "../utils/api";

export const getAllRecepteurs = async () => {
  const response = await authorizedApi().get("/recepteur");
  return response.data;
};

export const getRecepteurById = async (id) => {
  const response = await authorizedApi().get(`/recepteur/${id}`);
  return response.data;
};

export const createRecepteur = async (data) => {
  const response = await authorizedApi().post("/recepteur", data);
  return response.data;
};

export const updateRecepteur = async (data) => {
  const response = await authorizedApi().put("/recepteur", data);
  return response.data;
};

export const deleteRecepteur = async (id) => {
  const response = await authorizedApi().delete(`/recepteur/${id}`);
  return response.data;
};
