import { useEffect, useState } from "react";
import supplierService from "../services/supplier.service";
import productService from "../services/product.service";

const useSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [allSuppliers, setAllSuppliers] = useState([]);
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

  useEffect(() => {
    retrieveSuppliers();
  }, []);

  const retrieveSuppliers = () => {
    supplierService
      .getAll()
      .then((response) => {
        setAllSuppliers(response.data);
        setSuppliers(response.data);
      })
      .catch(console.log);
  };

  const retrieveProducts = (supplier) => {
    productService
      .getAll()
      .then((response) => {
        const productsForSupplier =
          response.data.embedded?.productDTOList?.filter(
            (product) => product.supplierId === supplier.id
          ) || [];
        setProducts(productsForSupplier);
        setVisibleProducts((prev) => ({ ...prev, [supplier.id]: true }));
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
      retrieveProducts(supplier);
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

  const saveSupplier = () => {
    if (editMode) {
      supplierService
        .update(currentSupplier.id, currentSupplier)
        .then(retrieveSuppliers)
        .catch(console.log)
        .finally(handleClose);
    } else {
      supplierService
        .create(currentSupplier)
        .then(retrieveSuppliers)
        .catch(console.log)
        .finally(handleClose);
    }
  };

  const saveProduct = () => {
    productService
      .create(currentProduct)
      .then(() => {
        retrieveProducts(currentSupplier);
        handleCloseProductDialog();
      })
      .catch(console.log);
  };

  const deleteSupplier = (id) => {
    supplierService.delete(id).then(retrieveSuppliers).catch(console.log);
  };

  const deleteProduct = (id) => {
    productService
      .delete(id)
      .then(() => retrieveProducts(currentSupplier))
      .catch(console.log);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterProductTypeChange = (e) =>
    setFilterProductType(e.target.value);

  useEffect(() => {
    const filteredSuppliers = allSuppliers.filter(
      (supplier) =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterProductType === "" || supplier.productType === filterProductType)
    );
    setSuppliers(filteredSuppliers);
  }, [searchTerm, filterProductType, allSuppliers]);

  return {
    suppliers,
    currentSupplier,
    currentProduct,
    products,
    visibleProducts,
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
  };
};

export default useSupplier;
