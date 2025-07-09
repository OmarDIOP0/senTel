import { authorizedApi } from "./api";
export const updateAttenuation = async (data) => {
  const response = await authorizedApi().put("/client", data);
  return response.data;
};