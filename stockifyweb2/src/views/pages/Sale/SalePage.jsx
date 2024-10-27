import {
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Autocomplete,
} from "@mui/material";
import { useState, useEffect } from "react";
import PageContainer from "../../../components/container/PageContainer.jsx";
import DashboardCard from "../../../components/shared/DashboardCard.jsx";
import saleService from "../../../services/saleService";
import stockService from "../../../services/stockService";

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
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchStocks = async (search = "", newPage = 0) => {
    setSearchLoading(true);
    try {
      const params = {
        page: newPage,
        size: 15,
        query: search,
      };
      const response = await stockService.getAllStock(params);
      if (response && response._embedded && response._embedded.stockDTOList) {
        const newStocks = response._embedded.stockDTOList;
        if (newPage === 0) {
          setStocks(newStocks);
        } else {
          setStocks((prevStocks) => {
            const mergedStocks = [...prevStocks];
            newStocks.forEach((stock) => {
              if (!prevStocks.some((s) => s.id === stock.id)) {
                mergedStocks.push(stock);
              }
            });
            return mergedStocks;
          });
        }
        setHasMore(response.page.number + 1 < response.page.totalPages);
      } else {
        setStocks([]);
        setHasMore(false);
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
      productId: selectedStock.productId,
      quantity: parseInt(quantity, 10),
    };

    try {
      await saleService.registerSale(saleData);
      setSuccessMessage(
        `Venda registrada com sucesso para o produto: ${selectedStock?.productName}`
      );

      setStockId(null);
      setQuantity("");
      setSelectedStock(null);

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

  const handleScroll = (event) => {
    const bottomReached =
      event.target.scrollHeight - event.target.scrollTop ===
      event.target.clientHeight;
    if (bottomReached && hasMore && !searchLoading) {
      setPage((prevPage) => prevPage + 1);
      fetchStocks(searchTerm, page + 1);
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
            setPage(0);
            fetchStocks(newInputValue, 0);
          }}
          onFocus={() => {
            if (stocks.length === 0) {
              fetchStocks();
            }
          }}
          onChange={(e, value) => {
            setStockId(value?.id || null);
            setSelectedStock(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Produto"
              variant="outlined"
              fullWidth
              slotProps={{
                input: {
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {searchLoading ? <CircularProgress size={20} /> : null}{" "}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                },
              }}
            />
          )}
          ListboxProps={{
            onScroll: handleScroll,
          }}
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
