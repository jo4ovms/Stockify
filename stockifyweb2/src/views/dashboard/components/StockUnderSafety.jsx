import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Avatar,
  Fab,
  Box,
  CircularProgress,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconAlertTriangle } from "@tabler/icons-react";
import DashboardCard from "../../../components/shared/DashboardCard";
import stockOverviewService from "../../../services/stockOverviewService";
import { useQuery } from "react-query";

const fetchCriticalStock = async () => {
  const response = await stockOverviewService.getCriticalStockReport(
    4,
    0,
    10,
    "",
    null,
    "quantity",
    "asc"
  );
  return {
    products: response.data._embedded?.stockDTOList || [],
    totalCriticalProducts: response.data.page.totalElements,
  };
};

const StockUnderSafety = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const errorlight = "#fdede8";

  const { data, isLoading, isError } = useQuery(
    "criticalStock",
    fetchCriticalStock
  );

  if (isLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Typography>Erro Carregando os Produtos Críticos</Typography>;
  }

  const products = data?.products || [];
  const totalCriticalProducts = data?.totalCriticalProducts || 0;

  const handleProductClick = (productId) => {
    navigate(`/stock/${productId}/edit`);
  };

  const handleViewAllClick = () => {
    navigate("/stock/critical-stock");
  };

  return (
    <DashboardCard
      title="Produtos Críticos!"
      action={
        <Fab
          color="secondary"
          size="medium"
          sx={{ color: "#ffffff" }}
          onClick={handleViewAllClick}
        >
          <IconAlertTriangle width={24} />
        </Fab>
      }
      sx={{ width: "125%", height: "270px", maxWidth: "600px" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Typography variant="h5" fontWeight="600" mb={0} mt={-2}>
          {totalCriticalProducts} produtos críticos
        </Typography>
        <Grid container spacing={2} sx={{ width: "100%" }}>
          {products.length === 0 ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
              width="85%"
            >
              <Typography
                variant="h7"
                color="textSecondary"
                sx={{ ml: 10, mt: 3, textAlign: "center" }}
              >
                Nenhum produto abaixo da quantidade crítica.
              </Typography>
            </Box>
          ) : (
            products.slice(0, 2).map((product) => (
              <Grid
                size={{ xs: 12 }}
                key={product.id}
                onClick={() => handleProductClick(product.id)}
                sx={{
                  cursor: "pointer",
                  padding: 1,
                  borderRadius: "8px",
                  "&:hover": { backgroundColor: "#f0f0f0" },
                }}
              >
                <Paper
                  elevation={2}
                  sx={{
                    padding: 1,
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    backgroundColor: "#fff",
                  }}
                >
                  <Box display="flex" alignItems="center">
                    <Avatar
                      sx={{
                        bgcolor: errorlight,
                        width: 25,
                        height: 25,
                        mr: 1,
                      }}
                    >
                      <IconAlertTriangle width={18} color="#d32f2f" />
                    </Avatar>
                    <Typography variant="subtitle2" fontWeight="500">
                      {product.productName}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle2" color="error">
                    Quantidade: {product.quantity}
                  </Typography>
                </Paper>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </DashboardCard>
  );
};

export default StockUnderSafety;
