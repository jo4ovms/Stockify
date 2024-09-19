import axiosInstance from "./axiosInstance";

const API_URL = "http://localhost:8081/api/suppliers";

class SupplierService {
  getAll() {
    return axiosInstance.get(API_URL);
  }

  create(data) {
    return axiosInstance.post(API_URL, data);
  }

  update(id, data) {
    return axiosInstance.put(`${API_URL}/${id}`, data);
  }

  delete(id) {
    return axiosInstance.delete(`${API_URL}/${id}`);
  }
}

const supplierService = new SupplierService();

export default supplierService;
