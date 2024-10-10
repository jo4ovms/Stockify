import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Typography, Box, Avatar } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconAlertTriangle } from "@tabler/icons-react";
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
    console.log("Produto selecionado:", productId);
    navigate(`/stock/${productId}/edit`);
  };

  return (
    <PageContainer
      title="Produtos Abaixo da Quantidade Segura"
      description="Página de produtos abaixo da quantidade segura"
    >
      <DashboardCard title="Produtos Acabando!">
        {" "}
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
                    onClick={() => handleProductClick(product.id)}
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
                      </Typography>{" "}
                    </Box>
                    <Typography variant="subtitle2" color="error">
                      Quantity: {product.quantity}
                    </Typography>
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
