import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
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

  useEffect(() => {
    productService.getAllProducts().then((response) => {
      console.log("Produtos carregados:", response);
      setProducts(response);
    });

    if (editMode) {
      setStock(currentStock);
    }
  }, [editMode, currentStock]);

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
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {editMode ? "Editar Estoque" : "Adicionar ao Estoque"}
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth margin="normal">
          <InputLabel id="product-select-label">Produto</InputLabel>
          <Select
            labelId="product-select-label"
            name="productId"
            value={stock.productId}
            onChange={handleChange}
          >
            {products.length > 0 ? (
              products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name} - {product.supplierName}
                </MenuItem>
              ))
            ) : (
              <MenuItem disabled value="">
                Nenhum produto disponível
              </MenuItem>
            )}
          </Select>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit}>
          {editMode ? "Salvar" : "Adicionar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockForm;
