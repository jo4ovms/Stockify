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
  useMediaQuery,
  Tooltip,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, useEffect, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../../../components/container/PageContainer.jsx";
import DashboardCard from "../../../components/shared/DashboardCard.jsx";
import Pagination from "../../../components/shared/Pagination.jsx";
import logService from "../../../services/logService";
import {
  formatTimestamp,
  keyTranslationMap,
  operationTranslationMap,
  entityTranslationMap,
} from "../../dashboard/components/utils.js";

const tryParseJSON = (str) => {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
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
        return `Quantidade alterada: de ${oldValue?.quantity || "N/A"} para ${newValue?.quantity || "N/A"}`;
      }
      if (oldValue?.value !== newValue?.value) {
        return `Valor alterado: de ${oldValue?.value ? formatCurrency(oldValue.value) : "N/A"} para ${newValue?.value ? formatCurrency(newValue.value) : "N/A"}`;
      }
    } else if (
      log.entity === "Supplier" &&
      oldValue?.productType !== newValue?.productType
    ) {
      return `Tipo de Produto alterado: de ${oldValue?.productType || "N/A"} para ${newValue?.productType || "N/A"}`;
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
      <Typography variant="body2" sx={{ mb: 0.5 }}>
        {log.entity === "Product" || log.entity === "Stock" ? (
          `Produto: ${newValue?.name || newValue?.productName || "Produto não especificado"}`
        ) : log.entity === "Sale" ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Produto: {newValue?.productName || "Produto não especificado"}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5 }}>
              Valor Total: {getSaleTotal()}
            </Typography>
          </Box>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Fornecedor Criado:
              {newValue?.name || "Fornecedor não especificado"}
            </Typography>
          </Box>
        )}
      </Typography>
    );
  }

  if (log.operationType === "UPDATE") {
    const secondaryChange = getSecondaryChange();
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="body2" sx={{ mb: 0.5 }}>
          {log.entity === "Product" || log.entity === "Stock"
            ? `Produto: ${newValue?.name || newValue?.productName || "Produto não especificado"}`
            : `Fornecedor: ${newValue?.name || "Fornecedor não especificado"}`}
        </Typography>
        {secondaryChange && (
          <Typography variant="body2" sx={{ mt: 0.5 }}>
            {secondaryChange}
          </Typography>
        )}
      </Box>
    );
  }

  if (log.operationType === "DELETE") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <Typography variant="body2" color="error" sx={{ mb: 3 }}>
          {log.entity === "Product" || log.entity === "Stock"
            ? `Produto excluído: ${oldValue?.name || oldValue?.productName || "Produto não especificado"}`
            : `Fornecedor excluído: ${oldValue?.name || "Fornecedor não especificado"}`}
        </Typography>
      </Box>
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
  const [totalItems, setTotalItems] = useState(0);

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  let debounceTimeout = useRef(null);

  useEffect(() => {
    retrieveLogs(page);
  }, [entityFilter, operationTypeFilter, page]);

  useEffect(() => {
    setPage(0);
  }, [entityFilter, operationTypeFilter]);

  useEffect(() => {
    if (logId && logs.length > 0) {
      const targetLogId = parseInt(logId);

      const logExists = logs.some((log) => log.id === targetLogId);

      if (logExists) {
        setExpandedLogId(targetLogId);

        setTimeout(() => {
          const element = document.getElementById(`log-${targetLogId}`);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
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
            setTotalItems(response.data.page.totalElements);

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
    const newExpandedLogId = expandedLogId === logId ? null : logId;
    setExpandedLogId(newExpandedLogId);

    if (newExpandedLogId !== null) {
      setTimeout(() => {
        const element = document.getElementById(`log-${logId}`);
        if (element) {
          const offset =
            element.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: offset, behavior: "smooth" });
        }
      }, 100);
    }
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

  const renderKeyValuePairs = (data) => {
    return (
      <Grid container spacing={2}>
        {Object.entries(data).map(([key, value]) => (
          <Grid size={{ xs: 12, sm: 6 }} key={key}>
            <Box display="flex" mb={1} sx={{ overflow: "hidden" }}>
              <Typography variant="body2" fontWeight="bold" mr={1}>
                {translateKey(key)}:
              </Typography>
              <Tooltip
                title={typeof value === "string" ? value : String(value)}
              >
                <Typography
                  variant="body2"
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "200px",
                  }}
                >
                  {typeof value === "string" || typeof value === "number"
                    ? value
                    : "N/A"}
                </Typography>
              </Tooltip>
            </Box>
          </Grid>
        ))}
      </Grid>
    );
  };

  const getMainInfo = (log) => {
    const newValue = tryParseJSON(log.newValue);
    const oldValue = tryParseJSON(log.oldValue);

    if (log.operationType === "DELETE") {
      return (
        oldValue?.name ||
        oldValue?.productName ||
        oldValue?.supplierName ||
        "Informação não disponível"
      );
    }

    return (
      newValue?.name ||
      newValue?.productName ||
      newValue?.supplierName ||
      "Informação não disponível"
    );
  };

  const shouldShowNewValue = (operationType) => {
    return operationType !== "DELETE";
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };
  const shouldShowOldValue = (operationType) => {
    return operationType === "UPDATE" || operationType === "DELETE";
  };

  const renderLogs = () => {
    if (loading) {
      return (
        <Grid container spacing={2}>
          {[...Array(5)].map((_, index) => (
            <Grid size={{ xs: 12 }} key={index}>
              <Box
                p={2}
                mb={0}
                border="1px solid #ccc"
                borderRadius={2}
                display="flex"
                flexDirection="column"
                backgroundColor="#fff"
                sx={{
                  transition: "all 0.3s ease",
                  height: isSmallScreen ? "165px" : "165px",
                }}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent={isSmallScreen ? "center" : "space-between"}
                  flexDirection={isSmallScreen ? "column" : "row"}
                  mb={1}
                >
                  <Box
                    display="flex"
                    alignItems="center"
                    gap={1}
                    flex={isSmallScreen ? "none" : "1"}
                    mb={isSmallScreen ? 1 : 0}
                    ml={isSmallScreen ? -2 : 0}
                  >
                    <Skeleton
                      variant="circular"
                      width={isSmallScreen ? 25 : 30}
                      height={isSmallScreen ? 25 : 30}
                      sx={{ ml: isSmallScreen ? -10 : 0 }}
                    />
                    <Box
                      display="flex"
                      flexDirection={"row"}
                      flexGrow={1}
                      gap={1}
                    >
                      <Skeleton
                        variant="text"
                        width={isSmallScreen ? 60 : "10%"}
                        height={25}
                      />
                      <Skeleton
                        variant="text"
                        width={isSmallScreen ? 110 : "15%"}
                        height={25}
                      />
                    </Box>
                  </Box>

                  <Skeleton
                    variant="text"
                    width={isSmallScreen ? 250 : 350}
                    height={20}
                    sx={{ ml: isSmallScreen ? -6 : "auto" }}
                  />
                </Box>

                {!isSmallScreen && (
                  <Box display="flex" flexDirection="column" gap={1} mb={2}>
                    <Skeleton variant="text" width="20%" height={20} />
                    <Skeleton variant="text" width="20%" height={20} />
                  </Box>
                )}

                <Box display="flex" justifyContent="flex-end">
                  <Skeleton
                    variant="rectangular"
                    width={isSmallScreen ? 300 : 150}
                    height={isSmallScreen ? 30 : 30}
                    sx={{
                      mt: !isSmallScreen ? -5.5 : 1,
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  />
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      );
    }

    if (logs.length === 0) {
      return <Typography variant="body2">Nenhum log encontrado.</Typography>;
    }

    return logs.map((log) => {
      return (
        <Box
          key={log.id}
          id={`log-${log.id}`}
          p={2}
          mb={2}
          border="0.2px solid #ccc"
          borderRadius={2}
          backgroundColor="#fff"
          sx={{
            backgroundColor: "#fff",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            transition: "all 0.3s ease",
            height: "auto",
          }}
        >
          <Box
            display="flex"
            flexDirection={isSmallScreen ? "column" : "row"}
            alignItems={isSmallScreen ? "flex-start" : "center"}
            justifyContent="space-between"
            gap={2}
          >
            <Box display="flex" alignItems="center">
              {getOperationIcon(log.operationType)}
              <Typography
                variant="h6"
                mr={1}
                sx={{
                  fontSize: isSmallScreen ? "14px" : "16px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {translateEntity(log.entity)}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                noWrap
                sx={{ overflow: "hidden", textOverflow: "ellipsis", flex: 1 }}
              >
                {getMainInfo(log)}
              </Typography>
            </Box>

            <Box display="flex" alignItems="center" gap={1}>
              <Typography
                variant="body2"
                sx={{
                  fontSize: isSmallScreen ? "12px" : "14px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {formatTimestamp(log.timestamp)}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontSize: isSmallScreen ? "12px" : "14px",
                  color: "gray",
                }}
              >
                {translateOperation(log.operationType, log.entity)}
              </Typography>
            </Box>
          </Box>

          {!isSmallScreen && renderSummary(log)}
          <Box
            sx={{
              mt: isSmallScreen ? 0 : -5,
              display: "flex",
              justifyContent: "flex-end",
            }}
          >
            <Button
              variant="outlined"
              color="primary"
              size={isSmallScreen ? "small" : "medium"}
              onClick={() => toggleLogDetails(log.id)}
              sx={{ width: isSmallScreen ? "100%" : "15%" }}
            >
              {expandedLogId === log.id ? <ExpandLess /> : <ExpandMore />} Ver
              Detalhes
            </Button>
          </Box>

          <Collapse in={expandedLogId === log.id} sx={{ mt: 2 }}>
            <Box p={2} borderTop="1px solid #ccc" backgroundColor="#fff">
              {shouldShowNewValue(log.operationType) && (
                <>
                  <Typography variant="body2" fontWeight="bold" mb={1}>
                    Valor Atual:
                  </Typography>
                  {log.newValue ? (
                    tryParseJSON(log.newValue) ? (
                      renderKeyValuePairs(tryParseJSON(log.newValue))
                    ) : (
                      <Typography
                        variant="body2"
                        sx={{ wordBreak: "break-all" }}
                      >
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
                      <Typography
                        variant="body2"
                        sx={{ wordBreak: "break-all" }}
                      >
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
      );
    });
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
        <Box
          mt={2}
          mb={3}
          display="flex"
          flexDirection={isSmallScreen ? "column" : "row"}
          gap={2}
        >
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

        <Box mt={2}>{renderLogs()}</Box>

        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={handlePageChange}
        />
      </DashboardCard>
    </PageContainer>
  );
};

export default LogReportPage;
