import {
  Box,
  Button,
  Typography,
  TextField,
  Avatar,
  IconButton,
  Skeleton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import {
  IconAlertTriangle,
  IconEye,
  IconExclamationCircle,
} from "@tabler/icons-react";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../../../components/container/PageContainer.jsx";
import DashboardCard from "../../../components/shared/DashboardCard.jsx";
import Pagination from "../../../components/shared/Pagination.jsx";
import SupplierFilter from "../../../components/shared/SupplierFilter.jsx";
import stockOverviewService from "../../../services/stockOverviewService";
import stockService from "../../../services/stockService";
let debounceTimeout = null;

const CriticalStockPage = () => {
  const [page, setPage] = useState(0);
  const [suppliers, setSuppliers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [size] = useState(10);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const threshold = 4;
  const [query, setQuery] = useState("");
  const [supplierId, setSupplierId] = useState(null);
  const [sortBy] = useState("quantity");
  const [sortDirection, setSortDirection] = useState("desc");
  const [totalItems, setTotalItems] = useState(0);

  const getSupplierName = () => {
    const supplier = suppliers.find((sup) => sup.id === supplierId);
    return supplier ? supplier.name : "";
  };

  const retrieveSuppliers = useCallback(() => {
    stockService
      .getAllWithoutPagination()
      .then((response) => {
        setSuppliers(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => setSuppliers([]));
  }, []);

  const retrieveLowStockProducts = useCallback(
    (currentPage) => {
      if (debounceTimeout) clearTimeout(debounceTimeout);

      setLoading(true);

      debounceTimeout = setTimeout(() => {
        stockOverviewService
          .getCriticalStockReport(
            threshold,
            currentPage,
            size,
            query,
            supplierId,
            sortBy,
            sortDirection
          )
          .then((response) => {
            const productData = response.data._embedded?.stockDTOList || [];
            setProducts(productData);
            setTotalPages(response.data.page.totalPages);
            setLoading(false);
            setTotalItems(response.data.page.totalElements);
          })
          .catch((error) => {
            setLoading(false);
            if (error.response && error.response.status === 404) {
              setProducts([]);
              setTotalPages(1);
            } else {
              console.error("Erro ao buscar produtos:", error);
            }
          });
      }, 300);
    },
    [query, supplierId, sortBy, sortDirection, size]
  );

  useEffect(() => {
    setPage(0);
  }, [query, supplierId, sortBy, sortDirection]);

  useEffect(() => {
    if (
      (page >= 0 && page < totalPages) ||
      query !== "" ||
      supplierId !== null ||
      sortBy !== "quantity" ||
      sortDirection !== "desc"
    ) {
      retrieveLowStockProducts(page);
    }
  }, [
    page,
    query,
    supplierId,
    sortBy,
    sortDirection,
    retrieveLowStockProducts,
  ]);

  useEffect(() => {
    retrieveSuppliers();
  }, [retrieveSuppliers]);

  const handleProductClick = (productId) => {
    navigate(`/stock/${productId}/edit`);
  };

  return (
    <PageContainer
      title="Produtos Com Estoque Crítico"
      description="Página de produtos abaixo da quantidade segura"
    >
      <DashboardCard title="Produtos Críticos!">
        <Grid container spacing={2} mb={2}>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              label="Buscar por produto"
              variant="outlined"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <SupplierFilter
              value={supplierId}
              onChange={(newSupplierId) => setSupplierId(newSupplierId)}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Button
              variant="contained"
              fullWidth
              sx={{ p: 1.8 }}
              onClick={() =>
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }
            >
              Ordenar por Quantidade (
              {sortDirection === "asc" ? "Crescente" : "Decrescente"})
            </Button>
          </Grid>
        </Grid>

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
                    "&:hover": {
                      backgroundColor: "#f0f0f0",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Skeleton variant="circular" width={27} height={27} />
                    <Skeleton
                      variant="text"
                      width={150}
                      sx={{ marginLeft: 2 }}
                      animation="wave"
                    />
                  </Box>
                  <Skeleton variant="rectangular" width={80} height={27} />
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Grid container spacing={-5}>
            {products.length === 0 ? (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                flexDirection="column"
                sx={{
                  height: "50vh",
                  textAlign: "center",
                  margin: "0 auto",
                  maxWidth: "400px",
                }}
              >
                <IconExclamationCircle size={60} color="#FFAE1F" />
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ mt: 2 }}
                >
                  {query && !supplierId
                    ? `Nenhum produto correspondente à pesquisa "${query}" foi encontrado.`
                    : supplierId && products.length === 0
                      ? `Nenhum produto do fornecedor "${getSupplierName()}" está em baixo estoque.`
                      : "Nenhum produto está em baixo estoque."}
                </Typography>
              </Box>
            ) : (
              products.map((product, index) => (
                <Grid size={{ xs: 12 }} key={product.id || index}>
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
                      "&:hover": {
                        backgroundColor: "#f0f0f0",
                      },
                    }}
                  >
                    <Box display="flex" alignItems="center">
                      <Avatar
                        sx={{
                          bgcolor: "#fdede8",
                          width: 27,
                          height: 27,
                          mr: 2,
                        }}
                      >
                        <IconAlertTriangle width={20} color="#FFAE1F" />
                      </Avatar>
                      <Typography variant="subtitle2">
                        {product.productName}
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center">
                      <Typography
                        variant="subtitle2"
                        color="error"
                        sx={{ mr: 2 }}
                      >
                        Quantidade: {product.quantity}
                      </Typography>

                      <IconButton
                        onClick={() => handleProductClick(product.id)}
                        aria-label="Edit product"
                      >
                        <IconEye width={20} />
                      </IconButton>
                    </Box>
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
    </PageContainer>
  );
};

export default CriticalStockPage;
