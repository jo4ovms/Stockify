import axiosInstance from "./axiosInstance";

const API_URL = "http://localhost:8081/api/products";

class ProductService {
  getAll(page = 0, size = 10, nameFilter = "") {
    return axiosInstance.get(API_URL, {
      params: {
        page,
        size,
        nameFilter,
      },
    });
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

  get(id) {
    return axiosInstance.get(`${API_URL}/${id}`);
  }
}

const productService = new ProductService();

export default productService;
