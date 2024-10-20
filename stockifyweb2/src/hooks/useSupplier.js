import { useEffect, useState, useRef } from "react";
import supplierService from "../services/supplier.service";
import productService from "../services/productService";

const useSupplier = () => {
  const [sortBy, setSortBy] = useState("name");
  const [sortDirection, setSortDirection] = useState("asc");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [suppliers, setSuppliers] = useState([]);
  const [productsBySupplier, setProductsBySupplier] = useState({});
  const [searchProductTermBySupplier, setSearchProductTermBySupplier] =
    useState({});
  const [productsPage, setProductsPage] = useState({});
  const [productsTotalPages, setProductsTotalPages] = useState({});
  const productListRef = useRef({});

  const [currentSupplier, setCurrentSupplier] = useState({
    id: null,
    name: "",
    email: "",
    cnpj: "",
    phone: "",
    productType: "",
  });
  const [currentProduct, setCurrentProduct] = useState({
    id: null,
    name: "",
    value: "",
    quantity: "",
    supplierId: null,
    supplierName: "",
  });
  const [products, setProducts] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState({});
  const [open, setOpen] = useState(false);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProductType, setFilterProductType] = useState("");

  const [allProductTypes, setAllProductTypes] = useState([]);

  const scrollToProductListTop = (supplierId) => {
    const interval = setInterval(() => {
      if (productListRef.current[supplierId]) {
        const offsetTop = productListRef.current[supplierId].offsetTop;
        window.scrollTo({
          top: offsetTop - 60,
          behavior: "smooth",
        });
        clearInterval(interval);
      }
    }, 100);
  };

  useEffect(() => {
    getAllProductTypes();
  }, []);
  const getAllProductTypes = () => {
    supplierService
      .getAllProductTypes()
      .then((response) => {
        setAllProductTypes(["", ...response.data]);
      })
      .catch(console.log);
  };

  const updateProductTypes = (newType) => {
    setAllProductTypes((prevTypes) => {
      if (newType && !prevTypes.includes(newType)) {
        return [...prevTypes, newType];
      }
      return prevTypes;
    });
  };

  const removeProductType = (typeToRemove) => {
    setAllProductTypes((prevTypes) =>
      prevTypes.filter((type) => type !== typeToRemove)
    );
  };

  useEffect(() => {
    retrieveSuppliers();
  }, [page, size, searchTerm, filterProductType]);

  const retrieveSuppliers = () => {
    supplierService
      .filterSuppliers(
        searchTerm,
        filterProductType,
        page,
        size,
        sortBy,
        sortDirection
      )
      .then((response) => {
        const suppliersData = response.data._embedded?.supplierDTOList || [];
        const pageData = response.data.page || { totalPages: 1 };

        setSuppliers(suppliersData);
        setTotalPages(pageData.totalPages);
      })
      .catch(console.log);
  };

  const retrieveProducts = (supplier, page = 0, size = 10) => {
    productService
      .getProductsBySupplier(supplier.id, page, size)
      .then(({ products, totalPages }) => {
        setProductsBySupplier((prev) => ({
          ...prev,
          [supplier.id]: products,
        }));

        setProductsPage((prev) => ({
          ...prev,
          [supplier.id]: page,
        }));

        setProductsTotalPages((prev) => ({
          ...prev,
          [supplier.id]: totalPages,
        }));

        setVisibleProducts((prev) => ({ ...prev, [supplier.id]: true }));
        scrollToProductListTop(supplier.id);
      })
      .catch((error) => {
        console.error("Erro ao buscar produtos:", error);
      });
  };

  const searchProductsForSupplier = (
    supplierId,
    searchTerm,
    page = 0,
    size = 10
  ) => {
    productService
      .searchProductsBySupplier(supplierId, searchTerm, page, size)
      .then(({ products, totalPages }) => {
        setProductsBySupplier((prev) => ({
          ...prev,
          [supplierId]: products,
        }));
        setProductsPage((prev) => ({
          ...prev,
          [supplierId]: page,
        }));
        setProductsTotalPages((prev) => ({
          ...prev,
          [supplierId]: totalPages,
        }));
      })
      .catch(console.log);
  };

  const handleClickOpen = () => {
    setEditMode(false);
    setCurrentSupplier({
      id: null,
      name: "",
      email: "",
      cnpj: "",
      phone: "",
      productType: "",
    });

    setOpen(true);
  };

  const handleClickEdit = (supplier) => {
    setEditMode(true);
    setCurrentSupplier(supplier);
    setOpen(true);
  };

  const handleClickCreateProduct = (supplier) => {
    setEditMode(false);
    setCurrentSupplier(supplier);
    setCurrentProduct({
      id: null,
      name: "",
      value: "",
      quantity: "",
      supplierId: supplier.id,
      supplierName: supplier.name,
    });
    setOpenProductDialog(true);
  };

  const handleClickShowProducts = (supplier) => {
    if (visibleProducts[supplier.id]) {
      setVisibleProducts((prev) => ({ ...prev, [supplier.id]: false }));
    } else {
      const searchTerm = searchProductTermBySupplier[supplier.id] || "";
      if (searchTerm) {
        searchProductsForSupplier(supplier.id, searchTerm);
      } else {
        retrieveProducts(supplier);
      }
      setCurrentSupplier(supplier);
    }
  };

  const handleClose = () => setOpen(false);

  const handleCloseProductDialog = () => setOpenProductDialog(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentSupplier((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeProduct = (e) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const editProduct = (product) => {
    setEditMode(true);
    setCurrentProduct({
      id: product.id,
      name: product.name,
      value: product.value,
      quantity: product.quantity,
      supplierId: product.supplierId,
      supplierName: currentSupplier.name,
    });
    setOpenProductDialog(true);
  };

  const saveSupplier = () => {
    if (editMode) {
      supplierService
        .update(currentSupplier.id, currentSupplier)
        .then(({ data: updatedSupplier }) => {
          updateProductTypes(updatedSupplier.productType);
          retrieveSuppliers();
        })
        .catch(console.log)
        .finally(handleClose);
    } else {
      supplierService
        .create(currentSupplier)
        .then(({ data: createdSupplier }) => {
          updateProductTypes(createdSupplier.productType);
          retrieveSuppliers();
        })
        .catch(console.log)
        .finally(handleClose);
    }
  };

  const saveProduct = () => {
    if (editMode) {
      productService
        .updateProduct(currentProduct.id, currentProduct)
        .then(() => {
          retrieveProducts(currentSupplier);
          handleCloseProductDialog();
        })
        .catch(console.log);
    } else {
      productService
        .createProduct(currentProduct)
        .then(() => {
          retrieveProducts(currentSupplier);
          handleCloseProductDialog();
        })
        .catch(console.log);
    }
  };

  const deleteSupplier = (id) => {
    const supplierToDelete = suppliers.find((s) => s.id === id);

    supplierService
      .delete(id)
      .then(() => {
        removeProductType(supplierToDelete.productType);
        retrieveSuppliers();
      })
      .catch(console.log);
  };

  const deleteProduct = (id) => {
    productService
      .deleteProduct(id)
      .then(() => {
        retrieveProducts(currentSupplier);
        getAllProductTypes();
      })
      .catch(console.log);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setPage(0);
  };

  const handleSearchProductChange = (supplierId, searchTerm) => {
    setSearchProductTermBySupplier((prev) => ({
      ...prev,
      [supplierId]: searchTerm,
    }));

    searchProductsForSupplier(supplierId, searchTerm);
  };
  const handleFilterProductTypeChange = (e) => {
    setFilterProductType(e.target.value);
    setPage(0);
  };

  return {
    suppliers,
    allProductTypes,
    setVisibleProducts,
    retrieveProducts,
    currentSupplier,
    currentProduct,
    products,
    visibleProducts,
    productsBySupplier,
    productsPage,
    productsTotalPages,
    open,
    openProductDialog,
    editMode,
    searchTerm,
    filterProductType,
    handleClickOpen,
    handleClickEdit,
    handleClickCreateProduct,
    handleClickShowProducts,
    handleClose,
    handleCloseProductDialog,
    handleChange,
    handleChangeProduct,
    handleSearchChange,
    handleFilterProductTypeChange,
    saveSupplier,
    saveProduct,
    deleteSupplier,
    deleteProduct,
    editProduct,
    page,
    setPage,
    totalPages,
    retrieveProducts,
    productListRef,
    handleClickShowProducts,
    handleSearchProductChange,
    searchProductTermBySupplier,
  };
};

export default useSupplier;
