import { useEffect, useState } from "react";
import supplierService from "../services/supplier.service";

const useSupplier = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [currentSupplier, setCurrentSupplier] = useState({
    id: null,
    name: "",
    email: "",
    cnpj: "",
    phone: "",
    productType: "",
  });
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    retrieveSuppliers();
  }, []);

  const retrieveSuppliers = () => {
    supplierService
      .getAll()
      .then((response) => setSuppliers(response.data))
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

  const handleClose = () => setOpen(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCurrentSupplier((prev) => ({
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

  const deleteSupplier = (id) => {
    supplierService.delete(id).then(retrieveSuppliers).catch(console.log);
  };

  return {
    suppliers,
    currentSupplier,
    open,
    editMode,
    handleClickOpen,
    handleClickEdit,
    handleClose,
    handleChange,
    saveSupplier,
    deleteSupplier,
  };
};

export default useSupplier;
