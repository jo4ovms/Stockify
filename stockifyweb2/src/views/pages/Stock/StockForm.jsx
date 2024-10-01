import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Box,
} from "@mui/material";
import stockService from "../../../services/stockService";
import ProductSearch from "./ProductSearch";

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
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (selectedProduct) {
      document.getElementsByName("selectedProduct")[0].value =
        selectedProduct.productName;
    }
  }, [selectedProduct]);

  const loadStockById = async (stockId) => {
    try {
      const stock = await stockService.getStockById(stockId);
      setStock({
        productId: stock.productId,
        quantity: stock.quantity,
        value: stock.value,
      });
      setSelectedProduct({
        productId: stock.productId,
        productName: stock.productName,
      });
      console.log("Selected Product after load:", {
        productId: stock.productId,
        productName: stock.productName,
      });
    } catch (error) {
      console.error("Erro ao carregar o estoque:", error);
    }
  };

  const resetForm = () => {
    setStock({
      productId: "",
      quantity: "",
      value: "",
    });
    setSelectedProduct(null);
  };

  useEffect(() => {
    if (open) {
      resetForm();
      console.log("Edit mode:", editMode);
      console.log("Current stock:", currentStock);
      if (editMode && currentStock?.id) {
        loadStockById(currentStock.id);
      }
    }
  }, [open, editMode, currentStock]);

  useEffect(() => {
    if (selectedProduct) {
      setStock((prev) => ({
        ...prev,
        productId: selectedProduct.productId || selectedProduct.id,
      }));
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStock((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    console.log("Stock antes de submeter:", stock);

    if (editMode) {
      stockService.updateStock(currentStock.id, stock).then(() => {
        retrieveStocks();
        resetForm();
        handleClose();
      });
    } else {
      stockService.createStock(stock).then(() => {
        retrieveStocks();
        resetForm();
        handleClose();
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editMode ? "Editar Estoque" : "Adicionar ao Estoque"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <ProductSearch
            setSelectedProduct={setSelectedProduct}
            setStock={setStock}
            selectedProduct={selectedProduct}
          />

          <TextField
            margin="normal"
            name="selectedProduct"
            value={selectedProduct?.productName || selectedProduct?.name || ""}
            label="Produto Selecionado"
            fullWidth
            disabled
          />
          {console.log("Selected Product:", selectedProduct)}

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
