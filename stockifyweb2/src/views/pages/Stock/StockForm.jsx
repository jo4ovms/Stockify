import React, { useState, useEffect, useRef } from "react";
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
  CircularProgress,
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
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [inputValue, setInputValue] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const listRef = useRef(null);

  const uniqueProducts = (existingProducts, newProducts) => {
    const combinedProducts = [...existingProducts, ...newProducts];
    const unique = Array.from(
      new Map(combinedProducts.map((product) => [product.id, product])).values()
    );
    return unique;
  };

  const loadProducts = async (searchTerm = "", page = 0) => {
    if (loading || !hasMore) return; // Evita requisições duplas.
    setLoading(true);
    try {
      const newProducts = await productService.searchProducts(
        searchTerm,
        page,
        10
      );
      if (newProducts.length === 0) {
        setHasMore(false); // Define que não há mais produtos.
      } else {
        setProducts((prevProducts) =>
          uniqueProducts(prevProducts, newProducts)
        );
      }
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
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
      loadProducts("", 0); // Carrega a primeira página ao abrir o modal.
      setPage(0);
      setHasMore(true); // Reseta a flag de mais produtos.
    }

    if (editMode && currentStock) {
      const selectedProd =
        products.find((p) => p.id === currentStock.productId) || null;
      setSelectedProduct(selectedProd);
      setStock({
        productId: currentStock.productId,
        quantity: currentStock.quantity,
        value: currentStock.value,
      });
    } else if (!editMode) {
      resetForm();
    }
  }, [editMode, currentStock, open]);

  const handleScroll = (event) => {
    if (
      event.target.scrollTop + event.target.clientHeight >=
      event.target.scrollHeight - 50
    ) {
      if (hasMore && !loading) {
        loadProducts(inputValue, page + 1);
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    if (newInputValue.trim()) {
      setProducts([]); // Limpa os produtos ao pesquisar algo novo.
      loadProducts(newInputValue, 0); // Reseta para a página 0 com a nova pesquisa.
      setPage(0); // Reseta o contador de página.
      setHasMore(true); // Permite carregamento de mais produtos novamente.
    }
  };

  const handleProductChange = (event, newValue) => {
    setSelectedProduct(newValue);
    setStock((prev) => ({
      ...prev,
      productId: newValue ? newValue.id : "",
    }));
  };

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
      <DialogContent ref={listRef} onScroll={handleScroll}>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <Autocomplete
              options={products}
              getOptionLabel={(product) =>
                `${product.name} - ${product.supplierName}`
              }
              filterOptions={(options) => options} // Não filtra localmente, já que vem do servidor.
              value={selectedProduct}
              onChange={handleProductChange}
              inputValue={inputValue}
              onInputChange={handleInputChange}
              loading={loading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Produto"
                  variant="outlined"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {loading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
              ListboxProps={{
                onScroll: handleScroll,
                style: {
                  maxHeight: "300px",
                  overflow: "auto",
                },
              }}
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
