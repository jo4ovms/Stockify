import { debounce } from "lodash";
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
  const [errorDialog, setErrorDialog] = useState({
    open: false,
    message: "",
  });
  const [loadingProducts, setLoadingProducts] = useState({});
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
  const [filterProductType, setFilterProductType] = useState("All");
  const [expandedSupplierId, setExpandedSupplierId] = useState(null);
  const [allProductTypes, setAllProductTypes] = useState([]);
  const [targetPage, setTargetPage] = useState(page + 1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const retrieveSuppliers = useCallback(
    (pageNumber = 0, newSize = size) => {
      setLoading(true);
      setErrorMessage("");

      const name = debouncedSearchTerm || null;
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
          const suppliersData = response.data._embedded?.supplierDTOList || [];
          const pageData = response.data.page || {
            totalPages: 1,
            totalElements: 0,
          };

          setSuppliers(suppliersData);
          setTotalPages(pageData.totalPages);
          setTotalItems(pageData.totalElements);

          if (suppliersData.length === 0) {
            setErrorMessage("");
          }
        })
        .catch(() => setErrorMessage("Erro ao carregar os fornecedores."))
        .finally(() => setLoading(false));
    },
    [debouncedSearchTerm, filterProductType, size, sortBy, sortDirection]
  );
  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    handler();

    return () => {
      handler.cancel();
    };
  }, [searchTerm]);

  useEffect(() => {
    retrieveSuppliers(page, size);
  }, [debouncedSearchTerm, filterProductType, page, size, retrieveSuppliers]);

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

  useEffect(() => {
    getAllProductTypes();
  }, []);

  const refreshProductTypesAndSuppliers = useCallback(() => {
    getAllProductTypes();
    retrieveSuppliers();
  }, [retrieveSuppliers]);

  const getAllProductTypes = useCallback(() => {
    supplierService
      .getAllProductTypes()
      .then((response) => {
        setAllProductTypes(["", ...response.data]);
      })
      .catch(console.log);
  }, []);

  useEffect(() => {
    setVisibleProducts({});
  }, [page]);

  const retrieveProducts = useCallback(
    (supplierId, page = 0, size = 10) => {
      if (loadingProducts[supplierId]) return;
      setTimeout(() => {
        if (productListRef.current[supplierId]) {
          const offsetTop = productListRef.current[supplierId].offsetTop;
          window.scrollTo({
            top: offsetTop - 150,
            behavior: "smooth",
          });
        }
      }, 100);

      setLoadingProducts((prev) => ({ ...prev, [supplierId]: true }));
      productService
        .getProductsBySupplier(supplierId, page, size)
        .then((response) => {
          const { products = [], totalPages = 1 } = response;
          setProductsBySupplier((prev) => ({
            ...prev,
            [supplierId]: products.filter((product) => product && product.name),
          }));
          setProductsPage((prev) => ({ ...prev, [supplierId]: page }));
          setProductsTotalPages((prev) => ({
            ...prev,
            [supplierId]: totalPages,
          }));
          setVisibleProducts((prev) => ({ ...prev, [supplierId]: true }));
        })

        .catch(() => setErrorMessage("Erro ao buscar produtos."))
        .finally(() => {
          setLoadingProducts((prev) => ({ ...prev, [supplierId]: false }));
        });
    },
    [loadingProducts, productsBySupplier]
  );

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
    const supplierId = supplier.id;
    setExpandedSupplierId((prevId) => {
      const isSameSupplier = prevId === supplierId;

      if (!isSameSupplier) {
        retrieveProducts(supplierId, productsPage[supplierId] || 0);

        setTimeout(() => {
          if (productListRef.current[supplierId]) {
            const offsetTop = productListRef.current[supplierId].offsetTop;

            window.scrollTo({
              top: offsetTop - 150,
              behavior: "smooth",
            });
          }
        }, 200);
      }

      return isSameSupplier ? null : supplierId;
    });
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
          setSuppliers((prev) =>
            prev.map((supplier) =>
              supplier.id === updatedSupplier.id ? updatedSupplier : supplier
            )
          );
          setSuccessMessage(
            `Fornecedor ${updatedSupplier.name} atualizado com sucesso.`
          );
          refreshProductTypesAndSuppliers();
        })
        .catch((error) => {
          const backendError =
            error?.response?.data?.message || "Erro ao atualizar o fornecedor.";
          setErrorMessage(backendError);
        })
        .finally(() => setLoading(false));
    } else {
      supplierService
        .create(formattedSupplier)
        .then(({ data: createdSupplier }) => {
          setSuppliers((prev) => [createdSupplier, ...prev]);
          setSuccessMessage(
            `Fornecedor ${createdSupplier.name} criado com sucesso.`
          );
          refreshProductTypesAndSuppliers();
          handleClose();
        })
        .catch((error) => {
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
      name: product.name || null,
      value: product.value ? parseFloat(product.value) : null,
      quantity: product.quantity ? parseInt(product.quantity, 10) : null,
    };

    if (!productData.name || !productData.value || !productData.quantity) {
      setErrorMessage("Todos os campos são obrigatórios.");
      return;
    }

    const serviceCall = editMode
      ? productService.updateProduct(productData.id, productData)
      : productService.createProduct(productData);

    serviceCall
      .then(() => {
        retrieveProducts(productData.supplierId);
        handleCloseProductDialog();
        setSuccessMessage(
          `Produto ${productData.name} ${editMode ? "atualizado" : "criado"} com sucesso.`
        );
      })
      .catch(() =>
        setErrorMessage(
          `Erro ao ${editMode ? "atualizar" : "criar"} o produto.`
        )
      );
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
        retrieveProducts(currentSupplier.id);
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
    expandedSupplierId,
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
    loadingProducts,
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
    errorDialog,
    setErrorDialog,
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
