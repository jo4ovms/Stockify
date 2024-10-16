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

export default { registerSale };
