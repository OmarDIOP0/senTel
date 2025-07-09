import { authorizedApi } from "./api";

export const getAllDimensionnements = async () => {
  const response = await authorizedApi().get("/dimensionnement/rapport");
  return response.data;
};

export const getDimensionnementById = async (id) => {
  const response = await authorizedApi().get(`/dimensionnement/rapport/${id}`);
  return response.data;
};

export const createDimensionnement = async (data) => {
  const response = await authorizedApi().post("/dimensionnement/rapport", data);
  return response.data;
};

export const updateDimensionnement = async (data) => {
  const response = await authorizedApi().put("/dimensionnement/rapport", data);
  return response.data;
};

export const deleteDimensionnement = async (id) => {
  const response = await authorizedApi().delete(`/dimensionnement/rapport${id}`);
  return response.data;
};
