import axiosInstance from "./axiosInstance";
const API_URL = "http://localhost:8081/api/products";

const getAllProducts = async (page = 0, size = 100) => {
  const response = await axiosInstance.get(API_URL, { params: { page, size } });

  return response.data._embedded?.productDTOList || [];
};

const getProductById = async (id) => {
  try {
    const response = await axiosInstance.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar o produto com id ${id}:`, error);
    throw error;
  }
};

const getProductsBySupplier = async (supplierId, page = 0, size = 10) => {
  const response = await axiosInstance.get(
    `${API_URL}/supplier/${supplierId}`,
    {
      params: {
        page,
        size,
      },
    },
  );

  if (response.data && response.data.page) {
    const { totalPages, totalElements } = response.data.page;

    return {
      products: response.data._embedded?.productDTOList || [],
      totalPages,
      totalElements,
    };
  }

  return { products: [], totalPages: 1, totalElements: 0 };
};

const createProduct = async (product) => {
  const response = await axiosInstance.post(API_URL, product);
  return response.data;
};

const updateProduct = async (id, product) => {
  const response = await axiosInstance.put(`${API_URL}/${id}`, product);
  return response.data;
};

const deleteProduct = async (id) => {
  await axiosInstance.delete(`${API_URL}/${id}`);
};

const searchProducts = async (searchTerm, page = 0, size = 100) => {
  const response = await axiosInstance.get(`${API_URL}/search`, {
    params: { searchTerm, page, size },
  });

  return response.data._embedded?.productDTOList || [];
};

const searchProductsBySupplier = async (
  supplierId,
  searchTerm,
  page = 0,
  size = 10,
) => {
  const response = await axiosInstance.get(
    `${API_URL}/supplier/${supplierId}/search`,
    {
      params: {
        searchTerm,
        page,
        size,
      },
    },
  );

  if (response.data && response.data.page) {
    const { totalPages, totalElements } = response.data.page;

    return {
      products: response.data._embedded?.productDTOList || [],
      totalPages,
      totalElements,
    };
  }

  return { products: [], totalPages: 1, totalElements: 0 };
};

export default {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
  getProductsBySupplier,
  getProductById,
  searchProductsBySupplier,
};
