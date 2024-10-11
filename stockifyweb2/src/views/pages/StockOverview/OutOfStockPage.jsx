import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Avatar, IconButton, Button } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconAlertTriangle, IconEye } from "@tabler/icons-react";
import PageContainer from "../../../components/container/PageContainer";
import DashboardCard from "../../../components/shared/DashboardCard";
import stockOverviewService from "../../../services/stockOverviewService";

const OutOfStockPage = () => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    retrieveOutOfStockProducts();
  }, [page]);

  const retrieveOutOfStockProducts = () => {
    setLoading(true);
    stockOverviewService
      .getOutOfStockReport(page, 10)
      .then((response) => {
        const productData = response.data._embedded?.stockDTOList || [];
        setProducts(productData);
        setTotalPages(response.data.page.totalPages);
      })
      .catch(console.log)
      .finally(() => setLoading(false));
  };

  const handleProductClick = (productId) => {
    navigate(`/stock/${productId}/edit`);
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

  return (
    <PageContainer
      title="Produtos Esgotados"
      description="Página de produtos fora de estoque"
    >
      <DashboardCard title="Produtos Esgotados!">
        {loading ? (
          <Typography>Carregando...</Typography>
        ) : (
          <Grid container spacing={-5}>
            {products.length === 0 ? (
              <Typography variant="body2" color="textSecondary">
                Nenhum produto fora de estoque.
              </Typography>
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
                        <IconAlertTriangle width={20} color="#d32f2f" />
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

export default OutOfStockPage;
