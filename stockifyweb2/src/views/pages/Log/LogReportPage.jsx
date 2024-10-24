import { ExpandMore, ExpandLess } from "@mui/icons-material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import {
  Box,
  Button,
  Typography,
  Collapse,
  Divider,
  Select,
  MenuItem,
  Snackbar,
  Skeleton,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../../../components/container/PageContainer.jsx";
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
  stockId: "ID do Estoque",
  stockValueAtSale: "Valor Unitário",
};

const entityTranslationMap = {
  Supplier: "Fornecedor",
  Product: "Produto",
  Stock: "Estoque",
  Sale: "Venda",
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const renderSummary = (log) => {
  const newValue = tryParseJSON(log.newValue);
  const oldValue = tryParseJSON(log.oldValue);

  const getSecondaryChange = () => {
    if (log.entity === "Stock" || log.entity === "Product") {
      if (oldValue?.quantity !== newValue?.quantity) {
        return `Quantidade: de ${oldValue?.quantity || "N/A"} para ${newValue?.quantity || "N/A"}`;
      }
      if (oldValue?.value !== newValue?.value) {
        return `Valor: de ${oldValue?.value ? formatCurrency(oldValue.value) : "N/A"} para ${newValue?.value ? formatCurrency(newValue.value) : "N/A"}`;
      }
    } else if (log.entity === "Supplier" && oldValue?.cnpj !== newValue?.cnpj) {
      return `CNPJ: de ${oldValue?.cnpj || "N/A"} para ${newValue?.cnpj || "N/A"}`;
    }
    return null;
  };

  const getSaleTotal = () => {
    if (
      log.entity === "Sale" &&
      newValue?.stockValueAtSale &&
      newValue?.quantity
    ) {
      return formatCurrency(newValue.stockValueAtSale * newValue.quantity);
    }
    return "N/A";
  };

  if (log.operationType === "CREATE") {
    return (
      <Typography variant="body2">
        {log.entity === "Product" || log.entity === "Stock"
          ? `Produto: ${newValue?.name || newValue?.productName || "Produto não especificado"}`
          : log.entity === "Sale"
            ? `  Produto: ${newValue?.productName || "Produto não especificado"}, Valor Total: ${getSaleTotal()}`
            : `Fornecedor: ${newValue?.name || "Fornecedor não especificado"}`}
      </Typography>
    );
  }

  if (log.operationType === "UPDATE") {
    const secondaryChange = getSecondaryChange();
    return (
      <Typography variant="body2">
        {log.entity === "Product" || log.entity === "Stock"
          ? `Produto: ${newValue?.name || newValue?.productName || "Produto não especificado"}`
          : `Fornecedor: ${newValue?.name || "Fornecedor não especificado"}`}
        {secondaryChange && (
          <>
            <br />
            {secondaryChange}
          </>
        )}
      </Typography>
    );
  }

  if (log.operationType === "DELETE") {
    return (
      <Typography variant="body2" color="error">
        {log.entity === "Product" || log.entity === "Stock"
          ? `Produto excluído: ${oldValue?.name || oldValue?.productName || "Produto não especificado"}`
          : `Fornecedor excluído: ${oldValue?.name || "Fornecedor não especificado"}`}
      </Typography>
    );
  }

  return null;
};

const LogReportPage = () => {
  const [logs, setLogs] = useState([]);
  const [expandedLogId, setExpandedLogId] = useState(null);
  const [entityFilter, setEntityFilter] = useState("");
  const [operationTypeFilter, setOperationTypeFilter] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [size] = useState(10);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { logId } = useParams();
  let debounceTimeout = useRef(null);

  useEffect(() => {
    retrieveLogs(page);
  }, [entityFilter, operationTypeFilter, page]);

  useEffect(() => {
    setPage(0);
  }, [entityFilter, operationTypeFilter]);

  useEffect(() => {
    if (logId && logs.length > 0) {
      setExpandedLogId(logId);

      const logExists = logs.some((log) => log.id === parseInt(logId));

      if (logExists) {
        const element = document.getElementById(`log-${logId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }
    }
  }, [logId, logs]);

  const retrieveLogs = useCallback(
    (currentPage) => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      setLoading(true);

      debounceTimeout = setTimeout(() => {
        logService
          .getLogs(entityFilter, operationTypeFilter, currentPage, size)
          .then((response) => {
            const logs = response.data._embedded?.logDTOList || [];
            setLogs(
              logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            );
            setTotalPages(response.data.page.totalPages);

            if (logId) {
              setExpandedLogId(logId);
            }

            setLoading(false);
          })
          .catch(() => {
            setErrorMessage("Erro ao buscar logs.");
            setLoading(false);
          });
      }, 300);
    },
    [entityFilter, operationTypeFilter, size, logId]
  );

  const toggleLogDetails = (logId) => {
    setExpandedLogId(expandedLogId === logId ? null : logId);
  };

  const translateKey = (key) => {
    return keyTranslationMap[key] || key;
  };

  const translateOperation = (operationType, entity) => {
    if (entity === "Sale" && operationType === "CREATE") {
      return " ";
    }
    return operationTranslationMap[operationType] || operationType;
  };

  const translateEntity = (entity) => {
    return entityTranslationMap[entity] || entity;
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

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
    window.scrollTo(0, 0);
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
    window.scrollTo(0, 0);
  };

  const renderKeyValuePairs = (data) => {
    return (
      <Grid container spacing={2}>
        {Object.entries(data).map(([key, value]) => (
          <Grid size={{ xs: 6 }} key={key}>
            <Box display="flex" mb={1}>
              <Typography variant="body2" fontWeight="bold" mr={1}>
                {translateKey(key)}:
              </Typography>
              <Typography variant="body2">
                {typeof value === "string" || typeof value === "number"
                  ? value
                  : "N/A"}
              </Typography>
            </Box>
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
        <Snackbar
          open={!!errorMessage}
          autoHideDuration={6000}
          onClose={() => setErrorMessage("")}
          message={errorMessage}
        />
        <Box mt={2} mb={3} display="flex" gap={2}>
          <Select
            value={entityFilter}
            onChange={(e) => setEntityFilter(e.target.value)}
            displayEmpty
            variant="outlined"
          >
            <MenuItem value="">Todos os Entidades</MenuItem>
            <MenuItem value="Product">Produto</MenuItem>
            <MenuItem value="Supplier">Fornecedor</MenuItem>
            <MenuItem value="Stock">Estoque</MenuItem>
            <MenuItem value="Sale">Venda</MenuItem>
          </Select>

          <Select
            value={operationTypeFilter}
            onChange={(e) => setOperationTypeFilter(e.target.value)}
            displayEmpty
            variant="outlined"
          >
            <MenuItem value="">Todos os Tipos de Operação</MenuItem>
            <MenuItem value="CREATE">Criação</MenuItem>
            <MenuItem value="UPDATE">Atualização</MenuItem>
            <MenuItem value="DELETE">Exclusão</MenuItem>
          </Select>
        </Box>

        {loading ? (
          <Grid container spacing={2}>
            {[...Array(5)].map((_, index) => (
              <Grid size={{ xs: 12 }} key={index}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  p={2}
                >
                  <Box display="flex" alignItems="center">
                    <Skeleton variant="circular" width={40} height={40} />
                    <Skeleton
                      variant="text"
                      width={120}
                      height={20}
                      sx={{ ml: 2 }}
                    />
                  </Box>
                  <Skeleton variant="text" width={200} height={20} />
                  <Skeleton variant="rectangular" width={100} height={40} />
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box mt={2}>
            {logs.length > 0 ? (
              logs.map((log) => (
                <Box
                  key={log.id}
                  id={`log-${log.id}`}
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
                    <Box display="flex" alignItems="center">
                      {getOperationIcon(log.operationType)}
                      <Typography variant="h6" mr={2}>
                        {translateEntity(log.entity)}
                      </Typography>
                      <Typography variant="body2" sx={{ minWidth: "100px" }}>
                        {translateOperation(log.operationType, log.entity)}
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
                      {expandedLogId === log.id ? (
                        <ExpandLess />
                      ) : (
                        <ExpandMore />
                      )}
                      Ver Detalhes
                    </Button>
                  </Box>
                  <Box mt={1}>{renderSummary(log)}</Box>
                  <Collapse in={parseInt(expandedLogId) === log.id}>
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
        )}

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button
            variant="contained"
            onClick={handlePreviousPage}
            disabled={page === 0}
          >
            Página Anterior
          </Button>
          <Button
            variant="contained"
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
          >
            Próxima Página
          </Button>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default LogReportPage;
