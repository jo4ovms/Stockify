import {
  Stack,
  Typography,
  Avatar,
  Fab,
  Box,
  Skeleton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid2";

import { IconAlertTriangle, IconCheck, IconBox } from "@tabler/icons-react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../../../components/shared/DashboardCard.jsx";
import stockOverviewService from "../../../services/stockOverviewService";

const fetchStockSummary = async () => {
  const response = await stockOverviewService.getStockSummary();
  return response.data;
};

const OverviewItem = ({ count, label, color, icon, navigatePath }) => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      alignItems="center"
      onClick={() => {
        navigate(navigatePath);
        window.scrollTo(0, 0);
      }}
      sx={{ cursor: "pointer" }}
    >
      <Avatar sx={{ bgcolor: color, width: 40, height: 40, mr: 2 }}>
        {icon}
      </Avatar>
      <Box>
        <Typography variant="h5">{count}</Typography>
        <Typography variant="subtitle2" color="textSecondary">
          {label}
        </Typography>
      </Box>
    </Box>
  );
};

const StockOverview = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const { data, isLoading, isError } = useQuery(
    "stockSummary",
    fetchStockSummary,
    {
      staleTime: 900000,
      cacheTime: 1800000,
      refetchOnWindowFocus: false,
    }
  );

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
        {isLoading ? (
          <Stack direction="row" spacing={3}>
            {[...Array(3)].map((_, index) => (
              <Box
                key={index}
                display="flex"
                flexDirection="column"
                alignItems="center"
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
          </Stack>
        ) : isError ? (
          <Typography
            variant="subtitle1"
            color="error"
            sx={{ mt: 2, textAlign: "center" }}
          >
            Falha ao carregar dados do estoque.
          </Typography>
        ) : (
          <Box>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              mb={2}
            >
              <Typography variant="h4" fontWeight="700" mt="-10px">
                {data.totalProducts} Itens
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
              <OverviewItem
                count={data.betweenThreshold}
                label="Baixo Estoque"
                color={warninglight}
                icon={
                  <IconAlertTriangle
                    width={24}
                    color={theme.palette.warning.main}
                  />
                }
                navigatePath="/stock/under-safety"
              />

              <OverviewItem
                count={data.zeroQuantity}
                label="Fora de Estoque"
                color={errorlight}
                icon={
                  <IconAlertTriangle
                    width={24}
                    color={theme.palette.error.main}
                  />
                }
                navigatePath="/stock/out-of-stock"
              />

              <OverviewItem
                count={data.aboveThreshold}
                label="Estoque Adequado"
                color={successlight}
                icon={
                  <IconCheck width={24} color={theme.palette.success.main} />
                }
                navigatePath="/stock/safety"
              />
            </Stack>
          </Box>
        )}
      </Box>
    </DashboardCard>
  );
};

export default StockOverview;
