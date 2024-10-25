import { useEffect, useState, useRef, useCallback } from "react";
import productService from "../services/productService";
import supplierService from "../services/supplier.service";

const useSupplier = () => {
  const [sortBy] = useState("name");
  const [sortDirection] = useState("asc");
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [productsBySupplier, setProductsBySupplier] = useState({});
  const [searchProductTermBySupplier, setSearchProductTermBySupplier] =
    useState({});
  const [productsPage, setProductsPage] = useState({});
  const [productsTotalPages, setProductsTotalPages] = useState({});
  const productListRef = useRef({});
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({
    open: false,
    productId: null,
    productName: "",
  });
  const [confirmDeleteSupplierDialog, setConfirmDeleteSupplierDialog] =
    useState({
      open: false,
      supplierId: null,
      supplierName: "",
    });

  const debounceTimeout = useRef(null);
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
  const [products] = useState([]);
  const [visibleProducts, setVisibleProducts] = useState({});
  const [open, setOpen] = useState(false);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterProductType, setFilterProductType] = useState("");

  const [allProductTypes, setAllProductTypes] = useState([]);
  const [targetPage, setTargetPage] = useState(page + 1);

  const handleTargetPageChange = (event) => {
    setTargetPage(event.target.value);
  };

  const goToSpecificPage = () => {
    const newPage = Math.min(
      Math.max(parseInt(targetPage, 10) - 1, 0),
      totalPages - 1
    );
    window.scrollTo(0, 0);
    setPage(newPage);
  };

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
    retrieveSuppliers(page, size);
  }, [page, size, searchTerm, filterProductType]);

  useEffect(() => {
    setVisibleProducts({});
  }, [page]);

  const retrieveSuppliers = useCallback(
    (pageNumber = 0, newSize = size) => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

      setLoading(true);
      setErrorMessage("");

      debounceTimeout.current = setTimeout(() => {
        const name = searchTerm || null;
        const productType = filterProductType || null;

        supplierService
          .filterSuppliers(
            name,
            productType,
            pageNumber,
            newSize,
            sortBy,
            sortDirection
          )
          .then((response) => {
            const suppliersData =
              response.data._embedded?.supplierDTOList || [];
            const pageData = response.data.page || {
              totalPages: 1,
              totalElements: 0,
            };

            setSuppliers(suppliersData);
            setTotalPages(pageData.totalPages);
            setTotalItems(pageData.totalElements);

            if (suppliersData.length === 0) {
              setErrorMessage(
                "Nenhum fornecedor encontrado para os filtros aplicados."
              );
            }
          })
          .catch(() => setErrorMessage("Erro ao carregar os fornecedores."))
          .finally(() => setLoading(false));
      }, 500);
    },
    [sortBy, sortDirection, searchTerm, filterProductType]
  );

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
      .catch(() => setErrorMessage("Erro ao buscar produtos."));
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
      .catch(() => setErrorMessage("Erro ao buscar produtos."));
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
    if (!supplier?.id) {
      setErrorMessage("Supplier information is required.");
      return;
    }

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
    setVisibleProducts((prev) => {
      const updatedVisibleProducts = Object.keys(prev).reduce((acc, key) => {
        acc[key] = false;
        return acc;
      }, {});

      updatedVisibleProducts[supplier.id] = !prev[supplier.id];

      return updatedVisibleProducts;
    });

    if (!visibleProducts[supplier.id]) {
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
      supplierName: product.supplierName,
    });
    setOpenProductDialog(true);
  };

  const formatPhoneNumber = (phone) => {
    const cleaned = phone.replace(/\D/g, "");

    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, "($1) $2-$3");
    } else if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    }

    return phone;
  };

  const saveSupplier = (supplierData) => {
    setLoading(true);
    setErrorMessage("");

    const formattedSupplier = {
      ...supplierData,
      cnpj: supplierData.cnpj.replace(/\D/g, ""),
      phone: formatPhoneNumber(supplierData.phone),
    };

    if (editMode) {
      supplierService
        .update(currentSupplier.id, formattedSupplier)
        .then(({ data: updatedSupplier }) => {
          setSuccessMessage(
            `Fornecedor ${updatedSupplier.name} atualizado com sucesso.`
          );
          retrieveSuppliers();
        })
        .catch((error) => {
          console.error("Error updating supplier:", error.response?.data);
          const backendError =
            error?.response?.data?.message || "Erro ao atualizar o fornecedor.";
          setErrorMessage(backendError);
        })
        .finally(() => setLoading(false));
    } else {
      supplierService
        .create(formattedSupplier)
        .then(({ data: createdSupplier }) => {
          setSuccessMessage(
            `Fornecedor ${createdSupplier.name} criado com sucesso.`
          );
          retrieveSuppliers();
        })
        .catch((error) => {
          console.error("Error creating supplier:", error.response?.data);
          const backendError =
            error?.response?.data?.message || "Erro ao criar o fornecedor.";
          setErrorMessage(backendError);
        })
        .finally(() => setLoading(false));
    }
  };
  const saveProduct = (product) => {
    if (!product.supplierId) {
      setErrorMessage("Supplier ID is required.");
      return;
    }

    const productData = {
      ...product,
      name: product.name ? product.name : null,
      value: product.value ? parseFloat(product.value) : null,
      quantity: product.quantity ? parseInt(product.quantity, 10) : null,
    };

    if (!productData.name || !productData.value || !productData.quantity) {
      setErrorMessage("Todos os campos são obrigatórios.");
      return;
    }

    if (editMode) {
      productService
        .updateProduct(productData.id, productData)
        .then(() => {
          retrieveProducts(currentSupplier);
          handleCloseProductDialog();
          setSuccessMessage(
            `Produto ${productData.name} atualizado com sucesso.`
          );
        })
        .catch(() => setErrorMessage("Erro ao atualizar o produto."));
    } else {
      productService
        .createProduct(productData)
        .then(() => {
          retrieveProducts(currentSupplier);
          handleCloseProductDialog();
          setSuccessMessage(`Produto ${productData.name} criado com sucesso.`);
        })
        .catch(() => setErrorMessage("Erro ao criar o produto."));
    }
  };
  const handleDeleteSupplier = (supplierId, supplierName) => {
    setConfirmDeleteSupplierDialog({
      open: true,
      supplierId,
      supplierName,
    });
  };

  const cancelDeleteSupplier = () => {
    setConfirmDeleteSupplierDialog({
      open: false,
      supplierId: null,
      supplierName: "",
    });
  };

  const confirmDeleteSupplier = () => {
    const { supplierId, supplierName } = confirmDeleteSupplierDialog;

    supplierService
      .delete(supplierId)
      .then(() => {
        setSuccessMessage(`Fornecedor ${supplierName} excluído com sucesso.`);
        retrieveSuppliers();
      })
      .catch(() => setErrorMessage("Erro ao excluir o fornecedor."))
      .finally(() => {
        setConfirmDeleteSupplierDialog({
          open: false,
          supplierId: null,
          supplierName: "",
        });
      });
  };

  const handleDeleteProduct = (productId, productName) => {
    setConfirmDeleteDialog({
      open: true,
      productId,
      productName,
    });
  };

  const confirmDeleteProduct = () => {
    const { productId, productName } = confirmDeleteDialog;

    productService
      .deleteProduct(productId)
      .then(() => {
        setSuccessMessage(`Produto ${productName} excluído com sucesso.`);
        retrieveProducts(currentSupplier);
        getAllProductTypes();
      })
      .catch(() => setErrorMessage("Erro ao excluir o produto."))
      .finally(() => {
        setConfirmDeleteDialog({
          open: false,
          productId: null,
          productName: "",
        });
      });
  };

  const cancelDeleteProduct = () => {
    setConfirmDeleteDialog({
      open: false,
      productId: null,
      productName: "",
    });
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

  const handleItemsPerPageChange = (newSize) => {
    setSize(newSize);
    setPage(0);
  };

  return {
    suppliers,
    allProductTypes,
    setSuccessMessage,
    setErrorMessage,
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
    handleItemsPerPageChange,
    saveSupplier,
    saveProduct,
    editProduct,
    page,
    size,
    setPage,
    totalPages,
    totalItems,
    productListRef,
    handleSearchProductChange,
    searchProductTermBySupplier,
    handleTargetPageChange,
    goToSpecificPage,
    successMessage,
    errorMessage,
    targetPage,
    loading,
    confirmDeleteProduct,
    cancelDeleteProduct,
    handleDeleteProduct,
    confirmDeleteDialog,
    confirmDeleteSupplier,
    cancelDeleteSupplier,
    handleDeleteSupplier,
    confirmDeleteSupplierDialog,
  };
};

export default useSupplier;
