import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import stockService from "../../../services/stockService";
import ProductSearch from "./ProductSearch.jsx";

const StockForm = ({
  open,
  handleClose,
  editMode,
  currentStock,
  retrieveStocks,
  setSuccessMessage,
  fetchLimits,
}) => {
  const [stock, setStock] = useState({
    productId: "",
    quantity: "",
    value: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const inputRef = useRef(null);
  const [originalProductName, setOriginalProductName] = useState("");

  const loadStockById = async (stockId) => {
    try {
      const stock = await stockService.getStockById(stockId);
      setStock({
        productId: stock.productId,
        quantity: stock.quantity,
        value: stock.value,
      });
      const productInfo = {
        id: stock.productId,
        name: stock.productName,
        supplierName: stock.supplierName,
      };
      setSelectedProduct(productInfo);
      setOriginalProductName(stock.productName);
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
    setOriginalProductName("");
  };

  useEffect(() => {
    if (open) {
      resetForm();

      if (editMode && currentStock?.id) {
        loadStockById(currentStock.id);
      }
    }
  }, [open, editMode, currentStock]);

  useEffect(() => {
    if (selectedProduct) {
      setStock((prev) => ({
        ...prev,
        productId: selectedProduct.id,
      }));
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStock((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (editMode) {
      stockService.updateStock(currentStock.id, stock).then(() => {
        retrieveStocks();
        fetchLimits();
        resetForm();
        handleClose();
        setSuccessMessage(
          `Estoque de ${selectedProduct?.name || originalProductName} atualizado com sucesso.`
        );
      });
    } else {
      stockService.createStock(stock).then(() => {
        retrieveStocks();
        fetchLimits();
        resetForm();
        handleClose();
        setSuccessMessage(
          `Estoque de ${selectedProduct?.name || originalProductName} criado com sucesso.`
        );
      });
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editMode
          ? `Editando ${selectedProduct?.name || originalProductName}`
          : "Adicionar ao Estoque"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 3 }}>
          <ProductSearch
            setSelectedProduct={setSelectedProduct}
            setStock={setStock}
            selectedProduct={selectedProduct}
            inputRef={inputRef}
          />

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

StockForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  currentStock: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  retrieveStocks: PropTypes.func.isRequired,
  setSuccessMessage: PropTypes.func.isRequired,
  fetchLimits: PropTypes.func.isRequired,
};

export default StockForm;
