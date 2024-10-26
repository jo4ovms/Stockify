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
      sx={{ cursor: "pointer", mb: 1 }}
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
        height: "auto",
        width: "100%",
        maxWidth: isSmallScreen ? "100%" : "550px",
        minWidth: isSmallScreen ? "100%" : "550px",
        padding: isSmallScreen ? theme.spacing(3.5) : theme.spacing(1),
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          justifyContent: isSmallScreen ? "center" : "space-between",
          alignItems: "center",
          width: "100%",
          gap: isSmallScreen ? theme.spacing(2) : theme.spacing(3),
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
              direction={isSmallScreen ? "column" : "row"}
              spacing={isSmallScreen ? 2.5 : 3.5}
              justifyContent="center"
              alignItems="center"
              sx={{ width: "100%" }}
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
