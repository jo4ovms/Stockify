import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Skeleton,
  Snackbar,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import PageContainer from "../../../components/container/PageContainer";
import DashboardCard from "../../../components/shared/DashboardCard";
import saleService from "../../../services/saleService";
import stockService from "../../../services/stockService";
import { debounce } from "lodash";
import { Refresh } from "@mui/icons-material";

let debounceTimeout = null;
const SoldItemsPage = () => {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [soldItems, setSoldItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [supplierId, setSupplierId] = useState(null);
  const [sortDirection, setSortDirection] = useState("desc");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const debouncedSetQuery = debounce((value) => {
    setQuery(value);
  }, 500);
  const fetchSoldItems = useCallback(
    (currentPage) => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      setLoading(true);
      debounceTimeout = setTimeout(() => {
        saleService
          .getAllSoldItems(
            currentPage,
            size,
            query,
            sortDirection,
            supplierId,
            startDate,
            endDate
          )
          .then((response) => {
            setSoldItems(response.content || []);
            setTotalPages(response.totalPages || 1);
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            setErrorMessage(
              "Erro ao carregar produtos vendidos. Tente novamente."
            );
          });
      }, 300);
    },
    [query, size, sortDirection, supplierId, startDate, endDate]
  );

  const retrieveSuppliers = useCallback(() => {
    stockService
      .getAllWithoutPagination()
      .then((response) => {
        setSuppliers(response.data);
      })
      .catch(() => setSuppliers([]));
  }, []);

  useEffect(() => {
    retrieveSuppliers();
    fetchSoldItems(page);
  }, [page, query, sortDirection, supplierId, startDate, endDate]);

  const handleInputChange = (setter) => (event) => {
    const value = event.target.value;

    if (setter === setQuery) {
      debouncedSetQuery(value);
    } else {
      setter(value);
    }
    setPage(0);
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage(page - 1);
  };

  const toggleSortDirection = () => {
    setSortDirection((prevSortDirection) =>
      prevSortDirection === "asc" ? "desc" : "asc"
    );
  };

  const handleResetFilters = () => {
    setQuery("");
    setSupplierId(null);
    setStartDate(null);
    setEndDate(null);
    setPage(0);
  };

  return (
    <PageContainer
      title="Sold Items"
      description="List of sold items with pagination, search filters, and supplier filter"
    >
      <DashboardCard title="Produtos Vendidos">
        <Grid container spacing={2} mb={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Pesquise por Produtos..."
              variant="outlined"
              value={query}
              onChange={handleInputChange(setQuery)}
              fullWidth
              disabled={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Fornecedor</InputLabel>
              <Select
                value={supplierId || ""}
                onChange={(e) => setSupplierId(e.target.value || null)}
                disabled={loading}
              >
                <MenuItem value="">
                  <em>Todos Fornecedores</em>
                </MenuItem>
                {suppliers.length === 0 ? (
                  <MenuItem disabled>Nenhum fornecedor disponível </MenuItem>
                ) : (
                  suppliers.map((supplier) => (
                    <MenuItem key={supplier.id} value={supplier.id}>
                      {supplier.name}
                    </MenuItem>
                  ))
                )}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Data Início"
              type="date"
              value={startDate || ""}
              onChange={handleInputChange(setStartDate)}
              fullWidth
              disabled={loading}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Data Fim"
              type="date"
              value={endDate || ""}
              onChange={handleInputChange(setEndDate)}
              fullWidth
              disabled={loading}
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Button
              variant="contained"
              fullWidth
              onClick={toggleSortDirection}
              startIcon={
                sortDirection === "asc" ? (
                  <IconSortAscending />
                ) : (
                  <IconSortDescending />
                )
              }
              sx={{ mt: 2, paddingY: 1 }}
            >
              Classificar por Quantidade
            </Button>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={handleResetFilters}
              startIcon={<Refresh />}
              sx={{ mt: 2, paddingY: 1 }}
              disabled={
                loading || (!query && !supplierId && !startDate && !endDate)
              }
            >
              Limpar Filtros
            </Button>
          </Grid>
        </Grid>

        {loading ? (
          <Grid container spacing={2}>
            {[...Array(size)].map((_, index) => (
              <Grid size={{ xs: 12 }} key={index}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{
                    padding: "10px",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    mb: 2,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Skeleton variant="circular" width={27} height={27} />
                    <Skeleton variant="text" width={150} sx={{ ml: 2 }} />
                  </Box>
                  <Skeleton variant="rectangular" width={80} height={27} />
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={-5}>
            {soldItems.length === 0 ? (
              <Typography>Nenhum produto encontrado</Typography>
            ) : (
              soldItems.map((item) => (
                <Grid size={{ xs: 12 }} key={item.productName}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      padding: "20px",
                      borderRadius: "8px",
                      backgroundColor: "#f9f9f9",
                      mb: 2,
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <Typography variant="subtitle2">
                        {item.productName || "Unnamed Product"}
                      </Typography>
                    </Box>
                    <Typography variant="subtitle2">
                      Quantidade: {item.totalQuantitySold}
                    </Typography>
                  </Box>
                </Grid>
              ))
            )}
          </Grid>
        )}

        <Box
          display="flex"
          justifyContent="space-between"
          mt={2}
          alignItems="center"
        >
          <Button
            variant="contained"
            onClick={handlePreviousPage}
            disabled={page === 0 || loading}
          >
            Página Anterior
          </Button>
          <Typography>
            Página {page + 1} de {totalPages}
          </Typography>
          <Button
            variant="contained"
            onClick={handleNextPage}
            disabled={page >= totalPages - 1 || loading}
          >
            Próxima Página
          </Button>
        </Box>
      </DashboardCard>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
      />
    </PageContainer>
  );
};

export default SoldItemsPage;
