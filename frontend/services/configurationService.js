import { authorizedApi } from "../utils/api";

export const getAllConfigurations = async () => {
  const response = await authorizedApi().get("/configuration");
  return response.data;
};
export const getAllConfigurationsV2 = async () => {
  const response = await authorizedApi().get("/configuration/projet");
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
export const addEmetteurToConfig = async (configId, data) => {
  const response = await authorizedApi().post(`/configuration/${configId}/emetteur`, data)
  return response.data;
}

export const addRecepteurToConfig = async (configId, data) => {
  const response = await authorizedApi().post(`/configuration/${configId}/recepteur`, data)
  return response.data;
}

export const addAttenuationsToConfig = async (configId, data) => {
  const response = await authorizedApi().post(`/configuration/${configId}/attenuations`, data)
  return response.data;
}

export const simulerConfiguration = async (configId) => {
  const response = await authorizedApi().post(`/configuration/${configId}/simuler`);
  return response.data;
}
