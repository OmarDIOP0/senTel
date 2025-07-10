import { authorizedApi } from "../utils/api";

export const getAllConfigurations = async () => {
  const response = await authorizedApi().get("/configuration");
  return response.data;
};

export const getConfigurationById = async (id) => {
  const response = await authorizedApi().get(`/configuration/${id}`);
  return response.data;
};

export const createConfiguration = async (data) => {
  const response = await authorizedApi().post("/configuration", data);
  return response.data;
};

export const updateConfiguration = async (data) => {
  const response = await authorizedApi().put("/configuration", data);
  return response.data;
};

export const deleteConfiguration = async (id) => {
  const response = await authorizedApi().delete(`/configuration/${id}`);
  return response.data;
};
export const getConfigurationByProjet = async (id) => {
  const response = await authorizedApi().get(`/configuration/projet/${id}`);
  return response.data;
};
