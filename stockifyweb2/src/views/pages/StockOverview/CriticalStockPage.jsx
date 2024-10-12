import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Avatar,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import { IconAlertTriangle, IconEye } from "@tabler/icons-react";
import PageContainer from "../../../components/container/PageContainer";
import DashboardCard from "../../../components/shared/DashboardCard";
import stockOverviewService from "../../../services/stockOverviewService";
import stockService from "../../../services/stockService";

const CriticalStockPage = () => {
  const [page, setPage] = useState(0);
  const [suppliers, setSuppliers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [size] = useState(10);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const threshold = 5;
  const [query, setQuery] = useState("");
  const [supplierId, setSupplierId] = useState(null);
  const [sortBy, setSortBy] = useState("quantity");
  const [sortDirection, setSortDirection] = useState("desc");
  const getSupplierName = () => {
    const supplier = suppliers.find((sup) => sup.id === supplierId);
    return supplier ? supplier.name : "";
  };

  useEffect(() => {
    retrieveLowStockProducts(page);
  }, [page, query, supplierId, sortBy, sortDirection]);

  useEffect(() => {
    retrieveSuppliers();
  }, []);
  const retrieveSuppliers = () => {
    stockService
      .getAllWithoutPagination()
      .then((response) => {
        setSuppliers(Array.isArray(response.data) ? response.data : []);
      })
      .catch(() => setSuppliers([]));
  };

  const retrieveLowStockProducts = (currentPage) => {
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
      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          setProducts([]);
          setTotalPages(1);
        } else {
          console.error("Erro ao buscar produtos:", error);
        }
      });
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

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
            <FormControl fullWidth>
              <InputLabel>Fornecedor</InputLabel>
              <Select
                value={supplierId || ""}
                onChange={(e) => setSupplierId(e.target.value || null)}
              >
                <MenuItem value="">
                  <em>Todos os Fornecedores</em>
                </MenuItem>
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
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

        <Grid container spacing={-5}>
          {products.length === 0 ? (
            supplierId ? (
              <Typography variant="body2" color="textSecondary">
                Nenhum produto do fornecedor "{getSupplierName()}" está em baixo
                estoque.
              </Typography>
            ) : (
              <Typography variant="body2" color="textSecondary">
                Nenhum produto abaixo da quantidade segura.
              </Typography>
            )
          ) : (
            products.map((product) => (
              <Grid size={{ xs: 12 }} key={product.id}>
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

export default CriticalStockPage;
