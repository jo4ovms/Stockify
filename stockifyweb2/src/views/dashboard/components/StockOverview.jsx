import React, { useState, useEffect } from "react";
import { Stack, Typography, Avatar, Fab, Box, Skeleton } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useTheme, useMediaQuery } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IconAlertTriangle, IconCheck, IconBox } from "@tabler/icons-react";
import DashboardCard from "../../../components/shared/DashboardCard";
import stockOverviewService from "../../../services/stockOverviewService";

const StockOverview = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [outOfStockItems, setOutOfStockItems] = useState(0);
  const [adequateStockItems, setAdequateStockItems] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const fetchStockSummary = async () => {
    try {
      const response = await stockOverviewService.getStockSummary();
      const stockData = response.data;

      setTotalItems(stockData.totalProducts);
      setLowStockItems(stockData.betweenThreshold);
      setOutOfStockItems(stockData.zeroQuantity);
      setAdequateStockItems(stockData.aboveThreshold);

      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar resumo do estoque:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStockSummary();

    const interval = setInterval(fetchStockSummary, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
    window.scrollTo(0, 0);
  };

  const errorlight = "#fdede8";
  const warninglight = "#fff8e1";
  const successlight = "#e8f5e9";

  return (
    <DashboardCard
      title="Visão Geral do Estoque"
      action={
        <Fab
          color="secondary"
          size="medium"
          sx={{ color: "#ffffff" }}
          onClick={() => handleNavigate("/stock")}
        >
          <IconBox width={24} />
        </Fab>
      }
      sx={{
        height: "240px",
        width: isSmallScreen ? "150%" : "125%",
        minWidth: isSmallScreen ? "100%" : "120%",
        maxWidth: isSmallScreen ? "150%" : "250%",
        padding: isSmallScreen ? theme.spacing(2) : theme.spacing(0),
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100%",
        }}
      >
        {loading ? (
          <Grid container spacing={5}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                mt: 2,
              }}
            >
              {[...Array(3)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mb: 2,
                    mr: 10,
                  }}
                >
                  <Skeleton variant="circular" width={40} height={40} />
                  <Skeleton
                    variant="text"
                    width={100}
                    height={20}
                    sx={{ mt: 1 }}
                  />
                </Box>
              ))}
            </Box>
          </Grid>
        ) : (
          <Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h4" fontWeight="700" mt="-10px">
                {totalItems} Itens
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Total em Estoque
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={3}
              justifyContent="space-between"
              alignItems="center"
            >
              <Box
                display="flex"
                alignItems="center"
                onClick={() => handleNavigate("/stock/under-safety")}
                style={{ cursor: "pointer" }}
              >
                <Avatar
                  sx={{ bgcolor: warninglight, width: 40, height: 40, mr: 2 }}
                >
                  <IconAlertTriangle
                    width={24}
                    color={theme.palette.warning.main}
                  />
                </Avatar>
                <Box>
                  <Typography variant="h5">{lowStockItems}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Baixo Estoque
                  </Typography>
                </Box>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                onClick={() => handleNavigate("/stock/out-of-stock")}
                style={{ cursor: "pointer" }}
              >
                <Avatar
                  sx={{ bgcolor: errorlight, width: 40, height: 40, mr: 2 }}
                >
                  <IconAlertTriangle
                    width={24}
                    color={theme.palette.error.main}
                  />
                </Avatar>
                <Box>
                  <Typography variant="h5">{outOfStockItems}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Fora de Estoque
                  </Typography>
                </Box>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                onClick={() => handleNavigate("/stock/safety")}
                style={{ cursor: "pointer" }}
              >
                <Avatar
                  sx={{ bgcolor: successlight, width: 40, height: 40, mr: 2 }}
                >
                  <IconCheck width={24} color={theme.palette.success.main} />
                </Avatar>
                <Box>
                  <Typography variant="h5">{adequateStockItems}</Typography>
                  <Typography variant="subtitle2" color="textSecondary">
                    Estoque Adequado
                  </Typography>
                </Box>
              </Box>
            </Stack>
          </Box>
        )}
      </Box>
    </DashboardCard>
  );
};

export default StockOverview;
