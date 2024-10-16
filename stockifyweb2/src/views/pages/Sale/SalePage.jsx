import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import saleService from "../../../services/saleService";
import stockService from "../../../services/stockService";
import DashboardCard from "../../../components/shared/DashboardCard";
import PageContainer from "../../../components/container/PageContainer";

const SalePage = () => {
  const [stockId, setStockId] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [stocks, setStocks] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);

  const fetchStocks = async (search = "") => {
    setSearchLoading(true);
    try {
      const params = {
        page: 0,
        size: 10,
        query: search,
      };
      const response = await stockService.getAllStock(params);
      console.log("Dados recebidos:", response);
      if (response && response._embedded && response._embedded.stockDTOList) {
        setStocks(response._embedded.stockDTOList);
      } else {
        setStocks([]);
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
      setError("Erro ao carregar os produtos em estoque.");
    }
    setSearchLoading(false);
  };

  useEffect(() => {
    fetchStocks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!stockId) {
      setError("Selecione um produto válido.");
      setLoading(false);
      return;
    }

    const saleData = {
      stockId,
      quantity: parseInt(quantity, 10),
    };

    try {
      const result = await saleService.registerSale(saleData);
      setSuccessMessage(
        `Venda registrada com sucesso para o estoque ID: ${result.stockId}`
      );

      setStockId(null);
      setQuantity("");

      setTimeout(() => setSuccessMessage(""), 5000);
    } catch (error) {
      setError(
        "Erro ao registrar a venda. Verifique se o estoque e a quantidade são válidos."
      );
      console.error("Error Registering Sale", error);

      setTimeout(() => setError(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer
      title="Registrar Venda"
      description="Página para registrar uma nova venda de produto."
    >
      <DashboardCard
        title="Nova Venda"
        subtitle="Preencha os detalhes da venda abaixo"
      >
        <Autocomplete
          id="stock-autocomplete"
          options={stocks}
          getOptionLabel={(stock) =>
            stock
              ? `${stock.productName} (Quantidade: ${stock.quantity}, Valor: ${stock.value})`
              : ""
          }
          isOptionEqualToValue={(option, value) => option.id === value?.id}
          onInputChange={(e, newInputValue) => {
            setSearchTerm(newInputValue);
            if (newInputValue.length >= 3) {
              fetchStocks(newInputValue);
            }
          }}
          onChange={(e, value) => {
            console.log("Produto selecionado:", value);
            setStockId(value?.id || null);
            setSelectedStock(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Produto"
              variant="outlined"
              fullWidth
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {searchLoading ? <CircularProgress size={20} /> : null}{" "}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          value={selectedStock || null}
        />

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <TextField
            label="Quantidade"
            type="number"
            fullWidth
            required
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            sx={{ mb: 2 }}
            disabled={loading}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {successMessage && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {successMessage}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
          >
            {loading ? "Registrando Venda..." : "Registrar Venda"}
          </Button>

          {loading && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <CircularProgress />
            </Box>
          )}
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default SalePage;
