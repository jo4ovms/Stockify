import {
  Typography,
  Avatar,
  Fab,
  Box,
  Paper,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconAlertTriangle } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../../../components/shared/DashboardCard.jsx";
import stockOverviewService from "../../../services/stockOverviewService";
const fetchCriticalStock = async () => {
  try {
    const response = await stockOverviewService.getCriticalStockReport(
      4,
      0,
      10,
      "",
      null,
      "quantity",
      "asc"
    );

    const products = response.data?._embedded?.stockDTOList || [];
    const totalCriticalProducts = response.data?.page?.totalElements || 0;

    return {
      products,
      totalCriticalProducts,
    };
  } catch (error) {
    console.error("Error fetching critical stock report:", error);
    throw error;
  }
};

const ProductItem = ({ product, handleClick }) => (
  <Grid
    size={{ xs: 12 }}
    onClick={() => handleClick(product.id)}
    sx={{
      cursor: "pointer",
      padding: 1,
      borderRadius: "8px",
      "&:hover": { backgroundColor: "#f9f9f9" },
    }}
  >
    <Paper
      elevation={2}
      sx={{
        padding: 1.5,
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#fff",
      }}
    >
      <Box display="flex" alignItems="center">
        <Avatar sx={{ bgcolor: "#fdede8", width: 25, height: 25, mr: 1 }}>
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
);

const StockUnderSafety = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const { data, isLoading, isError } = useQuery(
    "criticalStock",
    fetchCriticalStock,
    {
      staleTime: 900000,
      cacheTime: 1800000,
      retry: 2,
      onError: (error) => {
        console.error("Error fetching critical stock:", error);
      },
    }
  );

  const handleProductClick = useCallback(
    (productId) => {
      navigate(`/stock/${productId}/edit`);
      window.scrollTo(0, 0);
    },
    [navigate]
  );

  const renderContent = useMemo(() => {
    if (isLoading) {
      return (
        <>
          <Box sx={{ width: "550px" }}>
            <Skeleton
              variant="text"
              width={150}
              height={40}
              sx={{ ml: 25, mb: 1 }}
            />
            <Grid container spacing={2} sx={{ width: "100%" }}>
              {[...Array(2)].map((_, index) => (
                <Grid size={{ xs: 12 }} key={index}>
                  <Skeleton
                    variant="rectangular"
                    width={300}
                    height={40}
                    sx={{
                      borderRadius: "8px",
                      mb: 2,
                      ml: isSmallScreen ? 16 : 15,
                    }}
                  />
                </Grid>
              ))}
            </Grid>
          </Box>
        </>
      );
    }

    if (isError) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            width: "550px",
            padding: 2,
            height: isSmallScreen ? "175px" : "100%",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              mt: isSmallScreen ? -1 : 2,
              ml: 1,
              textAlign: "center",
              justifyContent: "center",
              display: "flex",
              fontWeight: "bold",
            }}
          >
            Falha ao carregar produtos críticos.
          </Typography>
        </Box>
      );
    }

    if (data.products.length === 0) {
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            width: "550px",
            padding: 2,
            height: isSmallScreen ? "175px" : "100%",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              mt: isSmallScreen ? -1 : 2,
              ml: 1,
              textAlign: "center",
              justifyContent: "center",
              display: "flex",
              fontWeight: "bold",
            }}
          >
            Nenhum produto abaixo da quantidade crítica.
          </Typography>
        </Box>
      );
    }

    return (
      <>
        <Typography variant="h5" fontWeight="600" mb={1}>
          {data.totalCriticalProducts} produtos críticos
        </Typography>
        <Grid container spacing={2} sx={{ width: "100%" }}>
          {data.products.slice(0, 2).map((product) => (
            <ProductItem
              key={product.id}
              product={product}
              handleClick={handleProductClick}
            />
          ))}
        </Grid>
      </>
    );
  }, [data, isLoading, isError, handleProductClick]);
  return (
    <DashboardCard
      title="Produtos Críticos!"
      action={
        <Fab
          color="secondary"
          size="medium"
          sx={{ color: "#ffffff" }}
          onClick={() => navigate("/stock/critical-stock")}
        >
          <IconAlertTriangle width={24} />
        </Fab>
      }
      sx={{
        width: isSmallScreen ? "150%" : "550px",
        height: isSmallScreen ? "100%" : "300px",
        minWidth: isSmallScreen ? "100%" : "550px",
        maxWidth: isSmallScreen ? "100%" : "550px",
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        sx={{ width: "100%", padding: 0 }}
      >
        {renderContent}
      </Box>
    </DashboardCard>
  );
};
ProductItem.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.number.isRequired,
    productName: PropTypes.string.isRequired,
    quantity: PropTypes.number.isRequired,
  }).isRequired,
  handleClick: PropTypes.func.isRequired,
};
export default StockUnderSafety;
