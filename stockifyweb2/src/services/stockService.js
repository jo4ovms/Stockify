import axios from "axios";

const API_URL = "http://localhost:8081/api/stock";

const getAllStock = async (page = 0, size = 10) => {
  const response = await axios.get(API_URL, { params: { page, size } });
  console.log("API Response Stock:", response.data);
  return response.data._embedded?.stockDTOList || [];
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

export default { getAllStock, createStock, updateStock, deleteStock };
