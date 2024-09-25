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
  Box,
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

  // Função para resetar o estado ao abrir o formulário para criar um novo item
  const resetForm = () => {
    setStock({
      productId: "",
      quantity: "",
      value: "",
    });
  };

  useEffect(() => {
    // Carregar os produtos disponíveis
    productService.getAllProducts().then((response) => {
      setProducts(response);
    });

    if (editMode && currentStock) {
      // Se estiver no modo de edição, carregar os dados do item atual no estado
      setStock({
        productId: currentStock.productId, // Certifique-se de que productId está sendo carregado corretamente
        quantity: currentStock.quantity,
        value: currentStock.value,
      });
    } else if (!editMode) {
      // Se estiver criando um novo item, resetar o formulário
      resetForm();
    }
  }, [editMode, currentStock, open]); // Adicione `open` para garantir que o reset ocorra ao abrir o diálogo

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
            <InputLabel id="product-select-label">Produto</InputLabel>
            <Select
              labelId="product-select-label"
              name="productId"
              value={stock.productId || ""} // Certifique-se de que o valor do produto está definido
              onChange={handleChange}
              fullWidth
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
