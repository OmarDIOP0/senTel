import { authorizedApi } from "../utils/api";

export const getAllAttenuations = async () => {
  const response = await authorizedApi().get("/attenuation");
  return response.data;
};

export const getAttenuationById = async (id) => {
  const response = await authorizedApi().get(`/attenuation/${id}`);
  return response.data;
};

export const createAttenuation = async (data) => {
  const response = await authorizedApi().post("/attenuation", data);
  return response.data;
};

export const updateAttenuation = async (data) => {
  const response = await authorizedApi().put("/attenuation", data);
  return response.data;
};

export const deleteAttenuation = async (id) => {
  const response = await authorizedApi().delete(`/attenuation/${id}`);
  return response.data;
};
