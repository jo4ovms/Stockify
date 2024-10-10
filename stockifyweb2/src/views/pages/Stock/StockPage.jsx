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

  const [minMaxQuantity, setMinMaxQuantity] = useState([0, 100]);
  const [minMaxValue, setMinMaxValue] = useState([0, 10000]);
  const [quantityRange, setQuantityRange] = useState([0, 100]);
  const [valueRange, setValueRange] = useState([0, 10000]);

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
        .catch(console.log);
    }
  }, [id]);

  useEffect(() => {
    retrieveSuppliers();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      setPage(0);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (selectedSupplier) {
      setPage(0);
    }
  }, [selectedSupplier]);

  useEffect(() => {
    retrieveStocks(page, 10);
  }, [page, searchQuery, selectedSupplier, quantityRange, valueRange]);

  useEffect(() => {
    stockService
      .getStockLimits()
      .then((limits) => {
        setMinMaxQuantity([0, limits.maxQuantity]);
        setMinMaxValue([0, limits.maxValue]);
        setQuantityRange([0, limits.maxQuantity]);
        setValueRange([0, limits.maxValue]);
      })
      .catch((error) => {
        console.error("Erro ao obter os limites de estoque:", error);
      });
  }, []);

  const retrieveStocks = (pageNumber = 0, size = 10) => {
    const params = {
      page: pageNumber,
      size: size > 0 ? size : 10,
      minQuantity: quantityRange[0],
      maxQuantity: quantityRange[1],
      minValue: valueRange[0],
      maxValue: valueRange[1],
      query: searchQuery.trim() || undefined,
      supplierId: selectedSupplier || undefined,
    };

    console.log("Parâmetros enviados para a API:", params);

    stockService
      .getAllStock(params)
      .then((response) => {
        const stocksData = response._embedded?.stockDTOList || [];
        setStocks(stocksData);

        const totalPagesFromResponse = response.page?.totalPages || 1;
        setTotalPages(totalPagesFromResponse);
      })
      .catch((error) => {
        console.error("Erro ao buscar os estoques:", error);
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
    stockService.deleteStock(id).then(() => retrieveStocks(page, 10));
  };

  const handleSliderChange = (setter) => (event, newValue) => setter(newValue);

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
            const newPage = Math.max(page - 1, 0);
            setPage(newPage);
            retrieveStocks(newPage, 10);
            window.scrollTo(0, 0);
          }}
          disabled={page === 0}
        >
          Página Anterior
        </Button>

        <Typography>
          Página {page + 1} de {totalPages}
        </Typography>

        <Button
          variant="contained"
          onClick={() => {
            const newPage = Math.min(page + 1, totalPages - 1);
            setPage(newPage);
            retrieveStocks(newPage, 10);
            window.scrollTo(0, 0);
          }}
          disabled={page >= totalPages - 1}
        >
          Próxima Página
        </Button>
      </Box>

      <StockForm
        open={open}
        handleClose={() => setOpen(false)}
        editMode={editMode}
        currentStock={currentStock}
        retrieveStocks={() => retrieveStocks(page, 10)}
      />
    </DashboardCard>
  );
};

export default StockPage;
