import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import stockService from "../../../services/stockService";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import DashboardCard from "../../../components/shared/DashboardCard";
import StockForm from "./StockForm";

const PAGE_SIZE = 10;

const StockPage = () => {
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStock, setCurrentStock] = useState(null);
  const [page, setPage] = useState(0);

  const [quantityRange, setQuantityRange] = useState([0, 100]);
  const [valueRange, setValueRange] = useState([0, 10000]);

  useEffect(() => {
    retrieveSuppliers();
  }, []);

  useEffect(() => {
    setPage(0);
    retrieveStocks(selectedSupplier, 0);
  }, [searchQuery, selectedSupplier, quantityRange, valueRange]);

  useEffect(() => {
    retrieveStocks(selectedSupplier, page);
  }, [page]);

  const retrieveStocks = (supplierId = "", pageNumber = 0) => {
    let fetchStocks;

    if (searchQuery) {
      fetchStocks = stockService.searchStocks(
        searchQuery,
        pageNumber,
        PAGE_SIZE
      );
    } else if (supplierId) {
      fetchStocks = stockService.getStocksBySupplier(
        pageNumber,
        PAGE_SIZE,
        supplierId
      );
    } else {
      fetchStocks = stockService.getAllStock(pageNumber, PAGE_SIZE);
    }

    fetchStocks.then((data) => {
      let filteredStocks = data;

      filteredStocks = filteredStocks.filter(
        (stock) =>
          stock.quantity >= quantityRange[0] &&
          stock.quantity <= quantityRange[1]
      );

      filteredStocks = filteredStocks.filter(
        (stock) => stock.value >= valueRange[0] && stock.value <= valueRange[1]
      );

      setStocks(filteredStocks);
    });
  };

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

  const handleDelete = (id) => {
    stockService.deleteStock(id).then(() => retrieveStocks(selectedSupplier));
  };

  const handleSliderChange = (setter) => (event, newValue) => setter(newValue);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePreviousPage = () => setPage((prev) => (prev > 0 ? prev - 1 : 0));

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
                min={0}
                max={100}
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
                min={0}
                max={10000}
              />
              <Typography variant="body2">
                {`R$${valueRange[0]} - R$${valueRange[1]}`}
              </Typography>
            </FormControl>
          </Grid>
        </Grid>
      </Box>

      <Box mt={2}>
        {stocks.length > 0 ? (
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
                  onClick={() => handleDelete(stock.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>Nenhum item no estoque ainda.</Typography>
        )}
      </Box>

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button
          variant="contained"
          onClick={() => {
            handlePreviousPage();
            window.scrollTo(0, 0);
          }}
          disabled={page === 0}
        >
          Página Anterior
        </Button>
        <Button
          variant="contained"
          onClick={() => {
            handleNextPage();
            window.scrollTo(0, 0);
          }}
          disabled={stocks.length < PAGE_SIZE}
        >
          Próxima Página
        </Button>
      </Box>

      <StockForm
        open={open}
        handleClose={() => setOpen(false)}
        editMode={editMode}
        currentStock={currentStock}
        retrieveStocks={() => retrieveStocks(selectedSupplier)}
      />
    </DashboardCard>
  );
};

export default StockPage;
