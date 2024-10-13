import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Snackbar,
  SnackbarContent,
  Typography,
  Collapse,
  Divider,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import PageContainer from "../../../components/container/PageContainer";
import DashboardCard from "../../../components/shared/DashboardCard";
import logService from "../../../services/logService";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

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
};

const LogReportPage = () => {
  const [logs, setLogs] = useState([]);
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    retrieveLogs();
  }, []);

  const retrieveLogs = () => {
    logService
      .getAllLogs()
      .then((response) => {
        const logs = response.data._embedded?.logDTOList || [];
        setLogs(
          logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        );
      })
      .catch(() => setErrorMessage("Erro ao buscar logs."));
  };

  const toggleLogDetails = (logId) => {
    setExpandedLogId(expandedLogId === logId ? null : logId);
  };

  const translateKey = (key) => {
    return keyTranslationMap[key] || key;
  };

  const translateOperation = (operationType) => {
    return operationTranslationMap[operationType] || operationType;
  };

  const translateEntity = (entity) => {
    return entityTranslationMap[entity] || entity;
  };

  const closeSnackbar = () => {
    setErrorMessage("");
    setSuccessMessage("");
  };

  const getOperationIcon = (operationType) => {
    switch (operationType) {
      case "CREATE":
        return (
          <CheckCircleIcon style={{ color: "green", marginRight: "5px" }} />
        );
      case "UPDATE":
        return <EditIcon style={{ color: "orange", marginRight: "5px" }} />;
      case "DELETE":
        return <DeleteIcon style={{ color: "red", marginRight: "5px" }} />;
      default:
        return null;
    }
  };

  const formatKeyValue = (key, value) => {
    let displayValue = value;

    if (key === "available") {
      displayValue = value ? "Sim" : "Não";
    }

    if (key === "quantity" && value === 0) {
      displayValue = "0";
    }

    return (
      <Box display="flex" mb={1}>
        <Typography variant="body2" fontWeight="bold" mr={1}>
          {translateKey(key)}:
        </Typography>
        <Typography variant="body2">{displayValue || "N/A"}</Typography>
      </Box>
    );
  };

  const renderKeyValuePairs = (data) => {
    return (
      <Grid container spacing={2}>
        {Object.entries(data).map(([key, value]) => (
          <Grid size={{ xs: 6 }} key={key}>
            {formatKeyValue(key, value)}
          </Grid>
        ))}
      </Grid>
    );
  };

  const shouldShowNewValue = (operationType) => {
    return operationType !== "DELETE";
  };

  const shouldShowOldValue = (operationType) => {
    return operationType === "UPDATE" || operationType === "DELETE";
  };

  return (
    <PageContainer
      title="Relatórios de Log"
      description="Visualize logs detalhados de atividades"
    >
      <DashboardCard title="Relatórios de Atividades">
        <Box mt={2}>
          {logs.length > 0 ? (
            logs.map((log) => (
              <Box
                key={log.id}
                display="flex"
                flexDirection="column"
                p={2}
                borderBottom="1px solid #ccc"
                mb={2}
              >
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ width: "100%" }}
                >
                  <Box display="flex" alignItems="center" sx={{ flex: 0 }}>
                    {getOperationIcon(log.operationType)}
                    <Typography variant="h6" mr={2} sx={{ minWidth: "100px" }}>
                      {translateEntity(log.entity)}
                    </Typography>
                    <Typography variant="body2" sx={{ minWidth: "100px" }}>
                      {translateOperation(log.operationType)}
                    </Typography>
                  </Box>
                  <Box sx={{ flex: "0.6 1 200px", textAlign: "right" }}>
                    <Typography variant="body2" sx={{ textAlign: "right" }}>
                      {new Date(
                        log.timestamp[0],
                        log.timestamp[1] - 1,
                        log.timestamp[2],
                        log.timestamp[3],
                        log.timestamp[4],
                        log.timestamp[5]
                      ).toLocaleString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => toggleLogDetails(log.id)}
                  >
                    Ver Detalhes
                  </Button>
                </Box>
                <Collapse in={expandedLogId === log.id}>
                  <Box mt={2}>
                    {shouldShowNewValue(log.operationType) && (
                      <>
                        <Typography variant="body2" fontWeight="bold" mb={1}>
                          Valor Atual:
                        </Typography>
                        {log.newValue ? (
                          tryParseJSON(log.newValue) ? (
                            renderKeyValuePairs(tryParseJSON(log.newValue))
                          ) : (
                            <Typography variant="body2">
                              {log.newValue}
                            </Typography>
                          )
                        ) : (
                          <Typography variant="body2">N/A</Typography>
                        )}
                        <Divider sx={{ my: 2 }} />
                      </>
                    )}
                    {shouldShowOldValue(log.operationType) && (
                      <>
                        <Typography variant="body2" fontWeight="bold" mb={1}>
                          Valor Antigo:
                        </Typography>
                        {log.oldValue ? (
                          tryParseJSON(log.oldValue) ? (
                            renderKeyValuePairs(tryParseJSON(log.oldValue))
                          ) : (
                            <Typography variant="body2">
                              {log.oldValue}
                            </Typography>
                          )
                        ) : (
                          <Typography variant="body2">N/A</Typography>
                        )}
                        <Divider sx={{ my: 2 }} />
                      </>
                    )}
                    <Typography variant="body2">
                      <strong>Detalhes:</strong> {log.details || "N/A"}
                    </Typography>
                  </Box>
                </Collapse>
              </Box>
            ))
          ) : (
            <Typography variant="h7">Nenhum log encontrado.</Typography>
          )}
        </Box>

        <Snackbar
          open={Boolean(errorMessage)}
          autoHideDuration={6000}
          onClose={closeSnackbar}
        >
          <SnackbarContent
            message={errorMessage}
            style={{ backgroundColor: "red" }}
          />
        </Snackbar>

        <Snackbar
          open={Boolean(successMessage)}
          autoHideDuration={6000}
          onClose={closeSnackbar}
        >
          <SnackbarContent
            message={successMessage}
            style={{ backgroundColor: "green" }}
          />
        </Snackbar>
      </DashboardCard>
    </PageContainer>
  );
};

export default LogReportPage;
