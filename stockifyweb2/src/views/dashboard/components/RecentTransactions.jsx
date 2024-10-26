import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab";
import {
  Typography,
  Fab,
  Box,
  IconButton,
  Tooltip,
  Skeleton,
  Card,
  CardContent,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { IconArrowRight } from "@tabler/icons-react";
import { useQuery } from "react-query";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../../../components/shared/DashboardCard.jsx";
import logService from "../../../services/logService";
import {
  operationTranslationMap,
  entityTranslationMap,
  formatTimestamp,
  translateOperation,
  getDotColor,
  getLogDetails,
} from "./utils";

const fetchLogs = async () => {
  const response = await logService.getRecentLogs();
  const logs = response.data._embedded?.logDTOList || [];
  return logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

const RecentTransactions = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    data: logs = [],
    isLoading,
    isError,
  } = useQuery("recentLogs", fetchLogs, {
    staleTime: 60000,
    cacheTime: 300000,
  });

  const translateEntity = (entity) => {
    return entityTranslationMap[entity] || entity;
  };

  const getEntityIcon = (entity) => {
    switch (entity) {
      case "Product":
        return <InventoryIcon sx={{ fontSize: 20 }} color="primary" />;
      case "Stock":
        return <LocalShippingIcon sx={{ fontSize: 22 }} color="warning" />;
      case "Sale":
        return <ShoppingCartIcon sx={{ fontSize: 22 }} color="success" />;
      case "Supplier":
        return <StoreIcon sx={{ fontSize: 22 }} color="info" />;
      default:
        return <VisibilityIcon sx={{ fontSize: 22 }} color="grey" />;
    }
  };

  const handleViewReportClick = useCallback(
    (logId) => {
      navigate(`/report-logs/${logId}`);
    },
    [navigate]
  );
  const handleViewLogsPageClick = useCallback(() => {
    navigate("/report-logs");
    window.scrollTo(0, 0);
  }, [navigate]);

  const renderLogs = useMemo(() => {
    if (isLoading) {
      return (
        <Box sx={{ mt: 2, p: 2 }}>
          {Array.from(new Array(4)).map((_, index) => (
            <Box
              key={index}
              sx={{
                mb: 2,
                padding: "10px",
                width: "100%",
              }}
            >
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
              <Skeleton variant="circular" width={40} height={40} />
            </Box>
          ))}
        </Box>
      );
    }

    if (isError || logs.length === 0) {
      return (
        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          {isError
            ? "Falha ao carregar atividades recentes."
            : "Nenhuma atividade recente"}
        </Typography>
      );
    }

    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: isSmallScreen ? "column" : "row",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        {logs.slice(0, 5).map((log, index) => (
          <Card
            key={index}
            sx={{
              mb: 1,
              p: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              maxWidth: isSmallScreen ? "100%" : "650px",
              borderRadius: "8px",
              boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
              gap: 1,
            }}
          >
            <Box sx={{ minWidth: "24px" }}>{getEntityIcon(log.entity)}</Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                overflow: "hidden",
              }}
            >
              <Typography
                variant="subtitle2"
                fontWeight="600"
                sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {translateEntity(log.entity)}
                {log.entity !== "Sale" ? " - " : " Concluída"}
                {translateOperation(log.operationType, log.entity)}
              </Typography>
              <Tooltip title={getLogDetails(log)}>
                <Typography
                  variant="body2"
                  sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
                >
                  {getLogDetails(log)}
                </Typography>
              </Tooltip>
              <Typography variant="body2" color="textSecondary">
                {formatTimestamp(log.timestamp)}
              </Typography>
            </Box>

            <IconButton
              color="primary"
              aria-label="Ver detalhes"
              onClick={() => handleViewReportClick(log.id)}
              sx={{ marginLeft: "auto" }}
            >
              <IconArrowRight width={24} />
            </IconButton>
          </Card>
        ))}
      </Box>
    );
  }, [logs, isLoading, isError, isSmallScreen, handleViewReportClick]);

  return (
    <DashboardCard
      title="Atividades Recentes"
      action={
        <Fab
          color="secondary"
          size="medium"
          sx={{ color: "#ffffff" }}
          onClick={handleViewLogsPageClick}
        >
          <IconArrowRight width={24} />
        </Fab>
      }
      sx={{ height: "auto", width: "100%", overflow: "hidden" }}
    >
      <Box
        sx={{
          height: "100%",
          overflowY: "auto",
          overflowX: "hidden",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&:hover": { overflowY: "scroll" },
        }}
      >
        {renderLogs}
      </Box>
    </DashboardCard>
  );
};

export default RecentTransactions;
