import { Refresh } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  TextField,
  Skeleton,
  Snackbar,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconSortAscending, IconSortDescending } from "@tabler/icons-react";
import { debounce } from "lodash";
import { useState, useEffect, useCallback } from "react";
import PageContainer from "../../../components/container/PageContainer.jsx";
import DashboardCard from "../../../components/shared/DashboardCard.jsx";
import Pagination from "../../../components/shared/Pagination.jsx";
import SupplierFilter from "../../../components/shared/SupplierFilter.jsx";
import saleService from "../../../services/saleService";

let debounceTimeout = null;
const SoldItemsPage = () => {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [soldItems, setSoldItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [supplierId, setSupplierId] = useState(null);
  const [sortDirection, setSortDirection] = useState("desc");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [totalItems, setTotalItems] = useState(0);
  const [searchInput, setSearchInput] = useState("");

  const debouncedFetchSoldItems = useCallback(
    debounce((newQuery) => {
      setPage(0);
      setQuery(newQuery);
    }, 300),
    []
  );

  const fetchSoldItems = useCallback(
    (currentPage, append = false) => {
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
            const fetchedItems = response.content || [];
            setSoldItems((prev) =>
              append ? [...prev, ...fetchedItems] : fetchedItems
            );
            setTotalPages(response.totalPages || 1);
            setTotalItems(response.totalElements || 0);
            setLoading(false);
          })
          .catch(() => {
            setLoading(false);
            setErrorMessage(
              "Erro ao carregar produtos vendidos. Tente novamente."
            );
          });
      }, 300);
    },
    [query, size, sortDirection, supplierId, startDate, endDate]
  );

  useEffect(() => {
    fetchSoldItems(page);
  }, [page, query, sortDirection, supplierId, startDate, endDate]);

  const handleInputChange = (setter) => (event) => {
    const value = event.target.value;
    setter(value);
    setPage(0);
  };

  const handleQueryChange = (event) => {
    const value = event.target.value;
    setSearchInput(value);
    debouncedFetchSoldItems(value);
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
              value={searchInput}
              onChange={handleQueryChange}
              fullWidth
              disabled={loading}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <SupplierFilter
              value={supplierId}
              onChange={(newSupplierId) => {
                if (newSupplierId !== supplierId) {
                  setSupplierId(newSupplierId);
                }
              }}
            />
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
                    <Skeleton variant="text" width={150} sx={{ ml: 2 }} />
                  </Box>
                  <Skeleton variant="text" width={80} height={27} />
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

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setPage}
        />
      </DashboardCard>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
    </PageContainer>
  );
};

export default SoldItemsPage;
