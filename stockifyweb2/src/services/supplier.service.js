import axiosInstance from "./axiosInstance";

const API_URL = "http://localhost:8081/api/suppliers";

class SupplierService {
  getAll(page = 0, size = 10) {
    const params = { page, size };
    return axiosInstance.get(API_URL, { params });
  }

  filterSuppliers(name, productType, page = 0, size = 10) {
    const params = { name, productType, page, size };
    return axiosInstance.get(`${API_URL}/filter`, { params });
  }

  getAllProductTypes() {
    return axiosInstance.get(`${API_URL}/product-types`);
  }

  searchByName(name, page = 0, size = 10) {
    const params = { name, page, size };
    return axiosInstance.get(`${API_URL}/search`, { params });
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
