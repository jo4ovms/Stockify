import axiosInstance from "./axiosInstance";

const API_URL = "http://localhost:8081/api/logs";

const getLogs = (entity, operationType, page, size) => {
  return axiosInstance.get(API_URL, {
    params: {
      entity: entity || "",
      operationType: operationType.toUpperCase() || "",
      page: page || 0,
      size: size || 10,
    },
  });
};

const getRecentLogs = (page, size) => {
  return axiosInstance.get(`${API_URL}/recent`, {
    params: {
      page: page || 0,
      size: size || 10,
    },
  });
};

export default {
  getLogs,
  getRecentLogs,
};
