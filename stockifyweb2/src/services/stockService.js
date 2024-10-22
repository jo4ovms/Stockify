import axios from "axios";

const API_URL = "http://localhost:8081/api/stock";

const getAllStock = async (params = {}) => {
  const response = await axios.get(`${API_URL}/filtered`, { params });
  return response.data || [];
};

const getStocksBySupplier = async (params = {}) => {
  const response = await axios.get(API_URL + "/by-supplier", { params });
  return response.data || [];
};

const getAllWithoutPagination = async () => {
  const response = await axios.get("http://localhost:8081/api/suppliers/all");
  return response;
};

const getStockById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

const createStock = async (stock) => {
  const response = await axios.post(API_URL, stock);
  return response.data;
};

const updateStock = async (id, stock) => {
  const response = await axios.put(`${API_URL}/${id}`, stock);
  return response.data;
};

const deleteStock = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};

const searchStocks = async (params = {}) => {
  const response = await axios.get(`${API_URL}/search`, { params });
  return response.data || [];
};

const getStockLimits = async () => {
  try {
    const response = await axios.get(`${API_URL}/limits`);
    return response.data;
  } catch (error) {
    throw new Error("Falha ao obter os limites de estoque.");
  }
};

export default {
  getAllStock,
  getStockLimits,
  createStock,
  updateStock,
  deleteStock,
  getStockById,
  getAllWithoutPagination,
  getStocksBySupplier,
  searchStocks,
};
