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
import { Typography, Fab, Box, IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";

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

const keyTranslationMap = {
  name: "Nome",
  value: "Valor",
  supplierId: "ID do Fornecedor",
  supplierName: "Fornecedor",
  quantity: "Quantidade",
  id: "ID",
  phone: "Telefone",
  email: "Email",
  productType: "Tipo de Produto",
  cnpj: "CNPJ",
  available: "Disponível",
  productName: "Nome do Produto",
  productId: "ID do Produto",
};

const entityTranslationMap = {
  Supplier: "Fornecedor",
  Product: "Produto",
  Stock: "Estoque",
  Sale: "Venda",
};

const RecentTransactions = () => {
  const [page, setPage] = useState(0);
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    retrieveLogs();
  }, [page]);

  const translateKey = (key) => {
    return keyTranslationMap[key] || key;
  };

  const translateOperation = (operationType) => {
    return operationTranslationMap[operationType] || operationType;
  };

  const translateEntity = (entity) => {
    return entityTranslationMap[entity] || entity;
  };

  const getDotColor = (action) => {
    switch (action) {
      case "CREATE":
        return "primary";
      case "UPDATE":
        return "warning";
      case "DELETE":
        return "error";
      case "VENDIDO":
        return "success";
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
      return newValue?.name || oldValue?.productName || "Produto desconhecido";
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
        height: "700px",
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
              <TimelineItem key={index} sx={{ mb: 2 }}>
                <TimelineOppositeContent sx={{ paddingRight: "12px" }}>
                  <Typography color="textSecondary" variant="body2">
                    {formatTimestamp(log.timestamp)}
                  </Typography>
                </TimelineOppositeContent>
                <TimelineSeparator>
                  <TimelineDot
                    color={getDotColor(log.operationType)}
                    variant="outlined"
                  />
                  {index < logs.length - 1 && <TimelineConnector />}
                </TimelineSeparator>
                <TimelineContent
                  sx={{ paddingLeft: "12px", paddingRight: "12px" }}
                >
                  <Typography variant="subtitle2" fontWeight="600">
                    {translateEntity(log.entity)} (
                    {translateOperation(log.operationType)})
                  </Typography>
                  <Typography variant="body2">{getLogDetails(log)}</Typography>
                  <IconButton
                    color="primary"
                    aria-label="Ver detalhes"
                    onClick={() => handleViewReportClick(log.id)}
                  >
                    <VisibilityIcon />
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
