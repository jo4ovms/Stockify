import axios from "axios";

const API_URL = "http://localhost:8081/api/logs";

const getAllLogs = () => {
  return axios.get(`${API_URL}/recent`);
};

const getLogsByDateRange = (startDate, endDate) => {
  return axios.get(`${API_URL}/by-date`, {
    params: {
      start: startDate,
      end: endDate,
    },
  });
};

export default {
  getAllLogs,
  getLogsByDateRange,
};
