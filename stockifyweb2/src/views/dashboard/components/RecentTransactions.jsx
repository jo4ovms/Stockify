import React, { useState, useEffect } from "react";
import DashboardCard from "../../../components/shared/DashboardCard";
import { useNavigate } from "react-router-dom";
import { IconArrowRight } from "@tabler/icons-react";
import logService from "../../../services/logService";
import {
  Timeline,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from "@mui/lab";
import { Typography, Fab, Box, IconButton, Tooltip } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import InventoryIcon from "@mui/icons-material/Inventory";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import StoreIcon from "@mui/icons-material/Store";

const tryParseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch (e) {
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

const RecentTransactions = () => {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    retrieveLogs();
  }, []);

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
    console.log("Viewing report for logId:", logId);
    navigate(`/report-logs/${logId}`);
  };

  const retrieveLogs = () => {
    logService
      .getRecentLogs()
      .then((response) => {
        const logs = response.data._embedded?.logDTOList || [];
        setLogs(
          logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        );
      })
      .catch(() => setErrorMessage("Erro ao buscar logs."));
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
          onClick={() => navigate("/report-logs")}
        >
          <IconArrowRight width={24} />
        </Fab>
      }
      sx={{
        height: "600px",
        width: "100%",
        maxWidth: "100%",
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
        {logs.length > 0 ? (
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
