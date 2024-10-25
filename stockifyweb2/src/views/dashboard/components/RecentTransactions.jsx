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
    if (logs.length > 0) {
      return (
        <Timeline sx={{ p: 0 }}>
          {logs.slice(0, 5).map((log, index) => (
            <TimelineItem
              key={index}
              sx={{
                mb: 2,
                backgroundColor: index === 0 ? "#f9f9f9" : "transparent",
                borderRadius: "8px",
                padding: "10px",
                boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
              }}
            >
              <TimelineOppositeContent
                sx={{
                  paddingRight: "12px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Typography
                  color="textSecondary"
                  variant="body2"
                  sx={{ fontSize: "12px" }}
                >
                  {formatTimestamp(log.timestamp)}
                </Typography>
              </TimelineOppositeContent>
              <TimelineSeparator>
                <TimelineDot
                  color={
                    [
                      "primary",
                      "secondary",
                      "error",
                      "info",
                      "success",
                      "warning",
                    ].includes(getDotColor(log.entity))
                      ? getDotColor(log.entity)
                      : "default"
                  }
                  sx={
                    getDotColor(log.entity) === "default"
                      ? { borderColor: "grey", borderWidth: 2 }
                      : {}
                  }
                  variant="outlined"
                />
                {index < logs.length - 1 && <TimelineConnector />}
              </TimelineSeparator>
              <TimelineContent
                sx={{
                  paddingLeft: "25px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  maxWidth: "50%",
                }}
              >
                <Box
                  sx={{
                    maxWidth: "80%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
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
                </Box>
                <IconButton
                  color="primary"
                  aria-label="Ver detalhes"
                  onClick={() => handleViewReportClick(log.id)}
                >
                  {getEntityIcon(log.entity)}
                </IconButton>
              </TimelineContent>
            </TimelineItem>
          ))}
        </Timeline>
      );
    } else {
      return (
        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          Nenhuma atividade recente
        </Typography>
      );
    }
  }, [logs, handleViewReportClick]);

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
      sx={{
        height: "600px",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          height: "100%",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
          "&:hover": { overflowY: "scroll" },
        }}
      >
        {isLoading ? (
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
        ) : isError ? (
          <Typography variant="subtitle1" sx={{ textAlign: "center", mr: 12 }}>
            Falha ao carregar atividades recentes.
          </Typography>
        ) : (
          renderLogs
        )}
      </Box>
    </DashboardCard>
  );
};

export default RecentTransactions;
