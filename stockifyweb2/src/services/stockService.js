import axios from "axios";

const API_URL = "http://localhost:8081/api/stock";

const getAllStock = async (page = 0, size = 10, supplierId = "") => {
  const params = { page, size };
  if (supplierId) {
    params.supplierId = supplierId;
  }

  //console.log("Params for API call:", params);

  const response = await axios.get(API_URL, { params });
  // console.log("API Response Stock:", response.data);

  return response.data._embedded?.stockDTOList || [];
};

const getStocksBySupplier = async (page = 0, size = 10, supplierId) => {
  const params = { page, size, supplierId };
  const response = await axios.get(API_URL + "/by-supplier", { params });
  return response.data._embedded?.stockDTOList || [];
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

export default {
  getAllStock,
  createStock,
  updateStock,
  deleteStock,
  getStockById,
  getAllWithoutPagination,
  getStocksBySupplier,
};
