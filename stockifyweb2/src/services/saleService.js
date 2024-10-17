import axios from "axios";

const API_URL = "http://localhost:8081/api/sales";

const registerSale = async (saleData) => {
  try {
    const response = await axios.post(API_URL, saleData);
    return response.data;
  } catch (error) {
    console.error("Error Registering Sale", error);
    throw error;
  }
};

const getBestSellingItems = async () => {
  try {
    const response = await axios.get(`${API_URL}/best-sellers`);
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
  supplierId = null
) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: {
        page,
        size,
        searchTerm,
        sortDirection,
        supplierId,
      },
    });
    console.log("API Response: ", response.data);
    return response.data;
  } catch (error) {
    console.error("Error Fetching Sold Items", error);
    throw error;
  }
};

export default { registerSale, getBestSellingItems, getAllSoldItems };
