import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Avatar, IconButton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconAlertTriangle, IconEye } from "@tabler/icons-react"; // Import eye icon
import PageContainer from "../../../components/container/PageContainer";
import DashboardCard from "../../../components/shared/DashboardCard";
import stockOverviewService from "../../../services/stockOverviewService";

const StockUnderSafetyPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const threshold = 5;

  useEffect(() => {
    retrieveLowStockProducts();
  }, []);

  const retrieveLowStockProducts = () => {
    stockOverviewService
      .getLowStockReport(threshold)
      .then((response) => {
        const productData = response.data.products || [];
        setProducts(productData);
      })
      .catch(console.log);
  };

  const handleProductClick = (productId) => {
    navigate(`/stock/${productId}/edit`);
  };

  return (
    <PageContainer
      title="Produtos Abaixo da Quantidade Segura"
      description="Página de produtos abaixo da quantidade segura"
    >
      <DashboardCard title="Produtos Acabando!">
        <Grid container spacing={-5}>
          {products.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              Nenhum produto abaixo da quantidade segura.
            </Typography>
          ) : (
            products
              .filter((product) => product.quantity > 0)
              .map((product) => (
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
      </DashboardCard>
    </PageContainer>
  );
};

export default StockUnderSafetyPage;
