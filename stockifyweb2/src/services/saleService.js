import axiosInstance from "./axiosInstance";

const API_URL = "http://localhost:8081/api/sales";

const registerSale = async (saleData) => {
  try {
    const response = await axiosInstance.post(API_URL, saleData);
    return response.data;
  } catch (error) {
    console.error("Error Registering Sale", error);
    throw error;
  }
};

const getBestSellingItems = async () => {
  try {
    const response = await axiosInstance.get(`${API_URL}/best-sellers`);
    return response.data;
  } catch (error) {
    console.error("Error Fetching Best Selling Items", error);
    throw error;
  }
};
const getAllSoldItems = async (
  page = 0,
  size = 10,
  searchTerm = "",
  sortDirection = "desc",
  supplierId = null,
  startDate = null,
  endDate = null
) => {
  try {
    const response = await axiosInstance.get(`${API_URL}`, {
      params: {
        page,
        size,
        searchTerm,
        sortDirection,
        supplierId,
        startDate: startDate
          ? new Date(startDate).toISOString().split("T")[0]
          : null,
        endDate: endDate ? new Date(endDate).toISOString().split("T")[0] : null,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error Fetching Sold Items", error);
    throw error;
  }
};

const getSalesGroupedByDay = async (month) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/daily`, {
      params: { month },
    });
    return response.data;
  } catch (error) {
    console.error("Error Fetching Sales Grouped By Day", error);
    throw error;
  }
};

export default {
  registerSale,
  getBestSellingItems,
  getAllSoldItems,
  getSalesGroupedByDay,
};
