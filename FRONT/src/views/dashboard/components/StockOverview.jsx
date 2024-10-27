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
import PropTypes from "prop-types";
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
      title={
        <Box
          display="flex"
          alignItems="center"
          sx={{
            flexDirection: isSmallScreen ? "row" : "row",
            justifyContent: isSmallScreen ? "flex-start" : "center",
            alignItems: isSmallScreen ? "flex-start" : "center",
            gap: 1,
            mb: isSmallScreen ? 2 : 0,
            mt: isSmallScreen ? -2 : 0,
            ml: isSmallScreen ? -3.5 : 0,
          }}
        >
          <Typography variant="h5" fontWeight="700">
            Visão Geral do Estoque
          </Typography>
          <Fab
            color="secondary"
            size="medium"
            sx={{
              color: "#ffffff",
              position: "relative",
              right: isSmallScreen ? -65 : -225,
              mt: isSmallScreen ? -2 : 0,
            }}
            onClick={() => handleNavigate("/stock")}
          >
            <IconBox width={24} />
          </Fab>
        </Box>
      }
      sx={{
        height: "auto",
        width: "400px",
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
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            height={isSmallScreen ? "250px" : "125px"}
          >
            <Skeleton variant="text" width={50} height={30} sx={{ mb: 1 }} />
            <Skeleton variant="text" width={100} height={20} sx={{ mb: 3 }} />

            <Stack
              direction={isSmallScreen ? "column" : "row"}
              spacing={isSmallScreen ? 3 : 4}
              justifyContent="center"
              alignItems="center"
              width="100%"
            >
              {[...Array(3)].map((_, index) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  sx={{
                    mb: isSmallScreen ? 2 : 0,
                  }}
                >
                  <Skeleton
                    variant="circular"
                    width={40}
                    height={40}
                    sx={{ mr: 2 }}
                  />

                  <Box display="flex" flexDirection="column">
                    <Skeleton
                      variant="text"
                      width={40}
                      height={20}
                      sx={{ mb: 0.5 }}
                    />

                    <Skeleton variant="text" width={80} height={20} />
                  </Box>
                </Box>
              ))}
            </Stack>
          </Box>
        ) : isError ? (
          <Box height={isSmallScreen ? "250px" : "125px"}>
            <Typography
              variant="body2"
              sx={{
                mt: 2,
                ml: isSmallScreen ? 0 : 15,
                textAlign: "center",
                justifyContent: "center",
                display: "flex",
                fontWeight: "bold",
              }}
            >
              Falha ao carregar dados do estoque.
            </Typography>
          </Box>
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
              display={isSmallScreen ? "inline" : "flex"}
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

OverviewItem.propTypes = {
  count: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  navigatePath: PropTypes.string.isRequired,
};
export default StockOverview;
