import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  FormControl,
  Box,
  Autocomplete,
} from "@mui/material";
import productService from "../../../services/productService";
import stockService from "../../../services/stockService";

const StockForm = ({
  open,
  handleClose,
  editMode,
  currentStock,
  retrieveStocks,
}) => {
  const [stock, setStock] = useState({
    productId: "",
    quantity: "",
    value: "",
  });
  const [products, setProducts] = useState([]);

  const resetForm = () => {
    setStock({
      productId: "",
      quantity: "",
      value: "",
    });
  };

  useEffect(() => {
    productService.getAllProducts().then((response) => {
      setProducts(response);
    });

    if (editMode && currentStock) {
      setStock({
        productId: currentStock.productId,
        quantity: currentStock.quantity,
        value: currentStock.value,
      });
    } else if (!editMode) {
      resetForm();
    }
  }, [editMode, currentStock, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStock((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (editMode) {
      stockService.updateStock(currentStock.id, stock).then(retrieveStocks);
    } else {
      stockService.createStock(stock).then(retrieveStocks);
    }
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          minWidth: "500px",
        },
      }}
    >
      <DialogTitle>
        {editMode ? "Editar Estoque" : "Adicionar ao Estoque"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <Autocomplete
              options={products}
              getOptionLabel={(product) =>
                `${product.name} - ${product.supplierName}`
              }
              value={products.find((p) => p.id === stock.productId) || null}
              onChange={(event, newValue) => {
                setStock((prev) => ({
                  ...prev,
                  productId: newValue ? newValue.id : "",
                }));
              }}
              renderInput={(params) => (
                <TextField {...params} label="Produto" variant="outlined" />
              )}
            />
          </FormControl>

          <TextField
            margin="normal"
            name="quantity"
            label="Quantidade"
            type="number"
            fullWidth
            value={stock.quantity}
            onChange={handleChange}
          />

          <TextField
            margin="normal"
            name="value"
            label="Valor"
            type="number"
            fullWidth
            value={stock.value}
            onChange={handleChange}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {editMode ? "Salvar" : "Adicionar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockForm;
