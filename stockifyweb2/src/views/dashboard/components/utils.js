export const operationTranslationMap = {
  CREATE: "Criação",
  UPDATE: "Atualização",
  DELETE: "Exclusão",
};

export const entityTranslationMap = {
  Supplier: "Fornecedor",
  Product: "Produto",
  Stock: "Estoque",
  Sale: "Venda",
};

export const formatTimestamp = (timestamp) => {
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

export const translateOperation = (operationType, entity) => {
  if (entity === "Sale") {
    return "";
  }
  return operationTranslationMap[operationType] || operationType;
};

export const getDotColor = (entity) => {
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

export const getLogDetails = (log) => {
  const tryParseJSON = (str) => {
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  };

  const newValue = tryParseJSON(log.newValue);
  const oldValue = tryParseJSON(log.oldValue);

  switch (log.entity) {
    case "Product":
      return newValue?.name || oldValue?.name || "Produto desconhecido";
    case "Stock":
      return (
        newValue?.productName ||
        oldValue?.productName ||
        "Produto desconhecido no estoque"
      );
    case "Supplier":
      return newValue?.name || oldValue?.name || "Fornecedor desconhecido";
    case "Sale":
      return (
        newValue?.productName || oldValue?.productName || "Produto vendido"
      );
    default:
      return "Entidade desconhecida";
  }
};
