import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Snackbar,
  Skeleton,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import stockService from "../../../services/stockService";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import DashboardCard from "../../../components/shared/DashboardCard";
import StockForm from "./StockForm";

const StockPage = () => {
  const { id } = useParams();
  const [stock, setStock] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStock, setCurrentStock] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [minMaxQuantity, setMinMaxQuantity] = useState([0, 100]);
  const [minMaxValue, setMinMaxValue] = useState([0, 10000]);
  const [quantityRange, setQuantityRange] = useState([0, 100]);
  const [valueRange, setValueRange] = useState([0, 10000]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [targetPage, setTargetPage] = useState(page + 1);

  let debounceTimeout = useRef(null);

  const fetchLimits = async () => {
    try {
      const limits = await stockService.getStockLimits();

      if (limits) {
        setMinMaxQuantity([0, limits.maxQuantity || 100]);
        setMinMaxValue([0, limits.maxValue || 10000]);
        setQuantityRange([0, limits.maxQuantity || 100]);
        setValueRange([0, limits.maxValue || 10000]);
      } else {
        setErrorMessage("Limites de estoque não retornados corretamente.");
      }
    } catch (error) {
      setErrorMessage(`Erro ao obter os limites de estoque: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  useEffect(() => {
    if (id) {
      stockService
        .getStockById(id)
        .then((response) => {
          setStock(response);
          setEditMode(true);
          setCurrentStock(response);
          setOpen(true);
        })
        .catch(() => setErrorMessage("Erro ao carregar o estoque."));
    }
  }, [id]);

  useEffect(() => {
    retrieveSuppliers();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedSupplier]);

  useEffect(() => {
    retrieveStocks(page, itemsPerPage);
  }, [
    page,
    searchQuery,
    selectedSupplier,
    quantityRange,
    valueRange,
    itemsPerPage,
  ]);

  const retrieveStocks = useCallback(
    (pageNumber = 0, size = itemsPerPage) => {
      const params = {
        page: pageNumber,
        size,
        minQuantity: quantityRange[0],
        maxQuantity: quantityRange[1],
        minValue: valueRange[0],
        maxValue: valueRange[1],
        query: searchQuery.trim() || undefined,
        supplierId: selectedSupplier || undefined,
      };

      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

      setLoading(true);

      debounceTimeout.current = setTimeout(() => {
        stockService
          .getAllStock(params)
          .then((response) => {
            const stocksData = response._embedded?.stockDTOList || [];
            setStocks(stocksData);

            const totalPagesFromResponse = response.page?.totalPages || 1;
            const totalItemsFromResponse = response.page?.totalElements || 0;

            setTotalPages(totalPagesFromResponse);
            setTotalItems(totalItemsFromResponse);

            const maxQuantity = Math.max(
              ...stocksData.map((stock) => stock.quantity),
              0
            );
            const maxValue = Math.max(
              ...stocksData.map((stock) => stock.value),
              0
            );
            setMinMaxQuantity([0, maxQuantity]);
            setMinMaxValue([0, maxValue]);
          })
          .catch(() => setErrorMessage("Erro ao carregar o estoque."))
          .finally(() => {
            setLoading(false);
          });
      }, 500);
    },
    [searchQuery, selectedSupplier, quantityRange, valueRange, itemsPerPage]
  );

  const retrieveSuppliers = () => {
    stockService
      .getAllWithoutPagination()
      .then((response) =>
        setSuppliers(Array.isArray(response.data) ? response.data : [])
      )
      .catch(() => setSuppliers([]));
  };

  const handleClickOpen = () => {
    setEditMode(false);
    setCurrentStock(null);
    setOpen(true);
  };

  const handleClickEdit = (stock) => {
    setEditMode(true);
    setCurrentStock(stock);
    setOpen(true);
  };

  const handleDelete = (id, productName) => {
    stockService
      .deleteStock(id)
      .then(() => {
        setSuccessMessage(`Produto ${productName} deletado com sucesso.`);
        retrieveStocks(page, itemsPerPage);
        fetchLimits();
      })
      .catch(() => setErrorMessage("Erro ao deletar o produto em estoque."));
  };

  const handleSliderChange = (setter) => (event, newValue) => setter(newValue);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    retrieveStocks(newPage, itemsPerPage);
    window.scrollTo(0, 0);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setPage(0);
    setTargetPage(1);
    retrieveStocks(0, event.target.value);
  };

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
    retrieveStocks(newPage, itemsPerPage);
  };

  return (
    <DashboardCard title="Gestão de Estoque">
      <Box component="form" noValidate autoComplete="off" mb={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 12, width: "100%" }}>
            <TextField
              label="Buscar por produto"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>
      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={4} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
              fullWidth
            >
              Adicionar ao Estoque
            </Button>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="filter-supplier-label">Fornecedor</InputLabel>
              <Select
                labelId="filter-supplier-label"
                id="filter-supplier"
                value={selectedSupplier}
                label="Fornecedor"
                onChange={(e) => setSelectedSupplier(e.target.value)}
              >
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth>
              <Typography gutterBottom>Quantidade</Typography>
              <Slider
                value={quantityRange}
                onChange={handleSliderChange(setQuantityRange)}
                valueLabelDisplay="auto"
                min={minMaxQuantity[0]}
                max={minMaxQuantity[1]}
              />
              <Typography variant="body2">
                {`${quantityRange[0]} - ${quantityRange[1]}`}
              </Typography>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <FormControl fullWidth>
              <Typography gutterBottom>Valor</Typography>
              <Slider
                value={valueRange}
                onChange={handleSliderChange(setValueRange)}
                valueLabelDisplay="auto"
                min={minMaxValue[0]}
                max={minMaxValue[1]}
              />
              <Typography variant="body2">
                {`R$${valueRange[0]} - R$${valueRange[1]}`}
              </Typography>
            </FormControl>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="items-per-page-label">
                Itens por Página
              </InputLabel>
              <Select
                labelId="items-per-page-label"
                value={itemsPerPage}
                label="Itens por Página"
                onChange={handleItemsPerPageChange}
              >
                {[10, 20, 50, 100].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box mt={2} sx={{ minHeight: stocks.length > 0 ? "auto" : "300px" }}>
        {loading ? (
          <Box>
            {[...Array(5)].map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                height={60}
                animation="wave"
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        ) : stocks.length > 0 ? (
          stocks.map((stock) => (
            <Box
              key={stock.id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={2}
              borderBottom="1px solid #ccc"
            >
              <Box>
                <Typography variant="h6">{stock.productName}</Typography>
                <Typography variant="body2">Valor: {stock.value}</Typography>
                <Typography variant="body2">
                  Quantidade: {stock.quantity}
                </Typography>
                <Typography variant="body2">
                  Fornecedor: {stock.supplierName}
                </Typography>
              </Box>
              <Box>
                <IconButton
                  color="primary"
                  onClick={() => handleClickEdit(stock)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => handleDelete(stock.id, stock.productName)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          !loading && (
            <Alert severity="info" sx={{ mt: 10, justifyContent: "center" }}>
              Nenhum item no estoque —{" "}
              <strong>Verifique os filtros aplicados!</strong>
            </Alert>
          )
        )}
      </Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={2}
      >
        <Button
          variant="contained"
          onClick={() => {
            handlePageChange(Math.max(page - 1, 0));
            window.scrollTo(0, 0);
          }}
          disabled={page === 0}
        >
          Página Anterior
        </Button>

        <Typography>
          Página {page + 1} de {totalPages} (Total de itens: {totalItems})
        </Typography>

        <Button
          variant="contained"
          onClick={() => {
            handlePageChange(Math.min(page + 1, totalPages - 1));
            window.scrollTo(0, 0);
          }}
          disabled={page >= totalPages - 1}
        >
          Próxima Página
        </Button>
      </Box>
      <Box display="flex" alignItems="center" mt={2}>
        <TextField
          type="number"
          label="Ir para página"
          variant="outlined"
          value={targetPage}
          onChange={handleTargetPageChange}
          sx={{ maxWidth: 100, mr: 1 }}
          slotProps={{
            htmlInput: { min: 1, max: totalPages },
          }}
        />
        <Button variant="contained" onClick={goToSpecificPage}>
          Ir
        </Button>
      </Box>
      <StockForm
        open={open}
        handleClose={() => setOpen(false)}
        editMode={editMode}
        currentStock={currentStock}
        retrieveStocks={() => retrieveStocks(page, itemsPerPage)}
        setSuccessMessage={setSuccessMessage}
        fetchLimits={fetchLimits}
      />
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        severity="error"
      />
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        severity="success"
      />
    </DashboardCard>
  );
};

export default StockPage;
