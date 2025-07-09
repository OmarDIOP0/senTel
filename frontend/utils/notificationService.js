import { authorizedApi } from "./api";

export const getAllNotifications = async () => {
  const response = await authorizedApi().get("/notification");
  return response.data;
};

export const getNotificationById = async (id) => {
  const response = await authorizedApi().get(`/notification/${id}`);
  return response.data;
};

export const createNotification = async (data) => {
  const response = await authorizedApi().post("/notification", data);
  return response.data;
};

export const updateNotification = async (data) => {
  const response = await authorizedApi().put("/notification", data);
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await authorizedApi().delete(`/notification/${id}`);
  return response.data;
};
export const getNotificationByClient = async (id) => {
  const response = await authorizedApi().get(`/notification/client/${id}`);
  return response.data;
};
