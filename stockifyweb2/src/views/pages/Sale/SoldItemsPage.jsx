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
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import PageContainer from "../../../components/container/PageContainer";
import DashboardCard from "../../../components/shared/DashboardCard";
import saleService from "../../../services/saleService";
import stockService from "../../../services/stockService";

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

  const retrieveSuppliers = useCallback(() => {
    stockService
      .getAllWithoutPagination()
      .then((response) => {
        setSuppliers(response.data);
      })
      .catch(() => setSuppliers([]));
  }, []);

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
            const content = response.content || [];
            setSoldItems(content);
            setTotalPages(response.totalPages || 1);
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
            console.error("Error fetching sold items:", error);
          });
      }, 300);
    },
    [query, size, sortDirection, supplierId, startDate, endDate]
  );

  useEffect(() => {
    fetchSoldItems(page);
  }, [page, query, sortDirection, supplierId, fetchSoldItems]);

  useEffect(() => {
    retrieveSuppliers();
  }, [retrieveSuppliers]);

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
              onChange={(e) => setQuery(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel>Fornecedor</InputLabel>
              <Select
                value={supplierId || ""}
                onChange={(e) => setSupplierId(e.target.value || null)}
              >
                <MenuItem value="">
                  <em>Todos Fornecedores</em>
                </MenuItem>
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Data Início"
              type="date"
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
              fullWidth
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
              onChange={(e) => setEndDate(e.target.value)}
              fullWidth
              slotProps={{
                inputLabel: { shrink: true },
              }}
            />
          </Grid>
        </Grid>

        <Button
          sx={{ mb: 2 }}
          variant="contained"
          fullWidth
          onClick={toggleSortDirection}
        >
          Classificar por quantidade ({sortDirection === "asc" ? "asc" : "desc"}
          )
        </Button>

        {loading ? (
          <Grid container spacing={-5}>
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

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button
            variant="contained"
            onClick={handlePreviousPage}
            disabled={page === 0}
          >
            Página Anterior
          </Button>
          <Button
            variant="contained"
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
          >
            Próxima Página
          </Button>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default SoldItemsPage;
