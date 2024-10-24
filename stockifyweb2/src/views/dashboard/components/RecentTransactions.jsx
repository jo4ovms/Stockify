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
import { useNavigate } from "react-router-dom";
import DashboardCard from "../../../components/shared/DashboardCard.jsx";
import logService from "../../../services/logService";

const tryParseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
};

const operationTranslationMap = {
  CREATE: "Criação",
  UPDATE: "Atualização",
  DELETE: "Exclusão",
};

const entityTranslationMap = {
  Supplier: "Fornecedor",
  Product: "Produto",
  Stock: "Estoque",
  Sale: "Venda",
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
  } = useQuery("recentLogs", fetchLogs);

  const translateOperation = (operationType, entity) => {
    if (entity === "Sale") {
      return "";
    }
    return operationTranslationMap[operationType] || operationType;
  };

  const translateEntity = (entity) => {
    return entityTranslationMap[entity] || entity;
  };

  const getDotColor = (entity) => {
    switch (entity) {
      case "Product":
        return "primary";
      case "Stock":
        return "warning";
      case "Sale":
        return "success";
      case "Supplier":
        return "info";
      default:
        return "grey";
    }
  };

  const handleViewReportClick = (logId) => {
    navigate(`/report-logs/${logId}`);
  };

  const handleViewLogsPageClick = () => {
    navigate("/report-logs");
    window.scrollTo(0, 0);
  };

  const formatTimestamp = (timestamp) => {
    return new Date(
      timestamp[0],
      timestamp[1] - 1,
      timestamp[2],
      timestamp[3],
      timestamp[4],
      timestamp[5]
    ).toLocaleTimeString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getLogDetails = (log) => {
    const newValue = tryParseJSON(log.newValue);
    const oldValue = tryParseJSON(log.oldValue);

    if (log.entity === "Product") {
      return newValue?.name || oldValue?.name || "Produto desconhecido";
    } else if (log.entity === "Stock") {
      return (
        newValue?.productName ||
        oldValue?.productName ||
        "Produto desconhecido no estoque"
      );
    } else if (log.entity === "Supplier") {
      return newValue?.name || oldValue?.name || "Fornecedor desconhecido";
    } else if (log.entity === "Sale") {
      return (
        newValue?.productName || oldValue?.productName || "Produto vendido"
      );
    } else {
      return "Entidade desconhecida";
    }
  };

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
        width: "595px",
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
          <>
            {Array.from(new Array(4)).map((_, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  padding: "10px",
                  width: "100%",
                  // minWidth: "650px",
                }}
              >
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
                <Skeleton variant="circular" width={40} height={40} />
              </Box>
            ))}
          </>
        ) : isError ? (
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              width: "100%",
              minWidth: "650px",
              padding: 2,
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ textAlign: "center", mr: 12 }}
            >
              Falha ao carregar atividades recentes.
            </Typography>
          </Box>
        ) : logs.length > 0 ? (
          <Timeline
            className="theme-timeline"
            sx={{
              p: 0,
            }}
          >
            {logs.slice(0, 5).map((log, index) => (
              <TimelineItem
                key={index}
                sx={{
                  mb: 2,
                  backgroundColor: index === 0 ? "#f9f9f9" : "transparent",
                  borderRadius: "8px",
                  padding: "10px",
                  boxShadow: "0px 1px 3px rgba(0, 0, 0, 0.1)",
                  minHeight: "80px",
                }}
              >
                <TimelineOppositeContent
                  sx={{
                    paddingRight: "12px",
                    display: "flex",
                    alignItems: "center",
                    ml: "0px",
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
                    color={getDotColor(log.entity)}
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
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {translateEntity(log.entity)}
                      {log.entity !== "Sale" ? " - " : " Concluída"}
                      {translateOperation(log.operationType, log.entity)}
                    </Typography>
                    <Tooltip title={getLogDetails(log)}>
                      <Typography
                        variant="body2"
                        sx={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {getLogDetails(log)}
                      </Typography>
                    </Tooltip>
                  </Box>
                  <IconButton
                    color="primary"
                    aria-label="Ver detalhes"
                    onClick={() => handleViewReportClick(log.id)}
                    sx={{ marginLeft: "auto" }}
                  >
                    {getEntityIcon(log.entity)}
                  </IconButton>
                </TimelineContent>
              </TimelineItem>
            ))}
          </Timeline>
        ) : (
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            Nenhuma atividade recente
          </Typography>
        )}
      </Box>
    </DashboardCard>
  );
};

export default RecentTransactions;
