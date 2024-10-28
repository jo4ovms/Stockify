import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Slider,
  Snackbar,
  Skeleton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import DashboardCard from "../../../components/shared/DashboardCard.jsx";
import Pagination from "../../../components/shared/Pagination.jsx";
import SupplierFilter from "../../../components/shared/SupplierFilter.jsx";
import stockService from "../../../services/stockService";
import StockForm from "./StockForm.jsx";

const StockPage = () => {
  const { id } = useParams();
  const [, setStock] = useState(null);
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStock, setCurrentStock] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [, setMinMaxQuantity] = useState([0, 100]);
  const [, setMinMaxValue] = useState([0, 10000]);
  const [quantityRange, setQuantityRange] = useState([0, 100]);
  const [initialMinMaxValue, setInitialMinMaxValue] = useState([0, 10000]);
  const [valueRange, setValueRange] = useState([0, 10000]);
  const [initialMinMaxQuantity, setInitialMinMaxQuantity] = useState([0, 100]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [, setTargetPage] = useState(page + 1);
  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    id: null,
    productName: "",
  });
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  let debounceTimeout = useRef(null);

  const fetchLimits = async () => {
    try {
      const limits = await stockService.getStockLimits();

      if (limits && typeof limits.maxQuantity === "number") {
        const maxQuantity = limits.maxQuantity;
        setInitialMinMaxQuantity([0, maxQuantity]);
        setQuantityRange([0, maxQuantity]);
      } else {
        setErrorMessage("Limites de quantidade não retornados corretamente.");
      }

      if (limits && typeof limits.maxValue === "number") {
        const maxValue = limits.maxValue;
        setInitialMinMaxValue([0, maxValue]);
        setValueRange([0, maxValue]);
      } else {
        setErrorMessage("Limites de valor não retornados corretamente.");
      }
    } catch (error) {
      setErrorMessage(`Erro ao obter os limites de estoque: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchLimits();
  }, []);

  useEffect(() => {
    if (id) {
      stockService
        .getStockById(id)
        .then((response) => {
          setStock(response);
          setEditMode(true);
          setCurrentStock(response);
          setOpen(true);
        })
        .catch(() => setErrorMessage("Erro ao carregar o estoque."));
    }
  }, [id]);

  useEffect(() => {
    retrieveSuppliers();
  }, []);

  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedSupplier]);

  useEffect(() => {
    retrieveStocks(page, itemsPerPage);
  }, [
    page,
    searchQuery,
    selectedSupplier,
    quantityRange,
    valueRange,
    itemsPerPage,
  ]);

  const retrieveStocks = useCallback(
    (pageNumber = 0, size = itemsPerPage) => {
      const params = {
        page: pageNumber,
        size,
        minQuantity: quantityRange[0],
        maxQuantity: quantityRange[1],
        minValue: valueRange[0],
        maxValue: valueRange[1],
        query: searchQuery.trim() || undefined,
        supplierId: selectedSupplier || undefined,
      };

      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

      setLoading(true);

      debounceTimeout.current = setTimeout(() => {
        stockService
          .getAllStock(params)
          .then((response) => {
            const stocksData = response._embedded?.stockDTOList || [];
            setStocks(stocksData);

            const totalPagesFromResponse = response.page?.totalPages || 1;
            const totalItemsFromResponse = response.page?.totalElements || 0;

            setTotalPages(totalPagesFromResponse);
            setTotalItems(totalItemsFromResponse);

            const maxQuantity = Math.max(
              ...stocksData.map((stock) => stock.quantity),
              0
            );
            const maxValue = Math.max(
              ...stocksData.map((stock) => stock.value),
              0
            );
            setMinMaxQuantity([0, maxQuantity]);
            setMinMaxValue([0, maxValue]);
          })
          .catch(() => setErrorMessage("Erro ao carregar o estoque."))
          .finally(() => {
            setLoading(false);
          });
      }, 500);
    },
    [searchQuery, selectedSupplier, quantityRange, valueRange, itemsPerPage]
  );

  const retrieveSuppliers = () => {
    stockService
      .getAllWithoutPagination()
      .then((response) =>
        setSuppliers(Array.isArray(response.data) ? response.data : [])
      )
      .catch(() => setSuppliers([]));
  };

  const handleClickOpen = () => {
    setEditMode(false);
    setCurrentStock(null);
    setOpen(true);
  };

  const handleClickEdit = (stock) => {
    setEditMode(true);
    setCurrentStock(stock);
    setOpen(true);
  };

  const handleDeleteConfirm = () => {
    const { id, productName } = confirmDelete;
    stockService
      .deleteStock(id)
      .then(() => {
        setSuccessMessage(`Produto ${productName} deletado com sucesso.`);
        retrieveStocks(page, itemsPerPage);
        fetchLimits();
      })
      .catch(() => setErrorMessage("Erro ao deletar o produto em estoque."))
      .finally(() =>
        setConfirmDelete({ open: false, id: null, productName: "" })
      );
  };

  const handleOpenDeleteDialog = (id, productName) => {
    setConfirmDelete({ open: true, id, productName });
  };

  const handleSliderChange = (event, newValue) => {
    if (!Array.isArray(newValue) || newValue.length < 2) return;

    if (newValue[1] > initialMinMaxValue[1]) {
      setValueRange([newValue[0], initialMinMaxValue[1]]);
    } else {
      setValueRange(newValue);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setPage(0);
    setTargetPage(1);
    retrieveStocks(0, event.target.value);
  };

  return (
    <DashboardCard title="Gestão de Estoque">
      <Box component="form" noValidate autoComplete="off" mb={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid size={{ xs: 12, md: 12 }}>
            <TextField
              label="Buscar por produto"
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Grid>
        </Grid>
      </Box>
      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={isSmallScreen ? 2 : 4} alignItems="center">
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickOpen}
              fullWidth
            >
              Adicionar ao Estoque
            </Button>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <SupplierFilter
              fullWidth={isSmallScreen}
              value={selectedSupplier}
              onChange={(newSupplierId) => setSelectedSupplier(newSupplierId)}
            />
          </Grid>
          <Box
            display="flex"
            flexDirection={isSmallScreen ? "row" : "row"}
            gap={isSmallScreen ? 15 : 4}
            justifyContent={isSmallScreen ? "center" : "flex-start"}
            alignItems="center"
            sx={{ width: isSmallScreen ? undefined : "31.3%" }}
          >
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{
                width: isSmallScreen ? "100%" : "200%",
                mr: isSmallScreen ? 0 : 2,
              }}
            >
              <FormControl fullWidth>
                <Typography gutterBottom>Quantidade</Typography>
                <Slider
                  value={quantityRange}
                  onChange={(event, newValue) => {
                    if (!Array.isArray(newValue) || newValue.length < 2) return;
                    if (newValue[1] > initialMinMaxQuantity[1]) {
                      setQuantityRange([newValue[0], initialMinMaxQuantity[1]]);
                    } else {
                      setQuantityRange(newValue);
                    }
                  }}
                  valueLabelDisplay="auto"
                  min={initialMinMaxQuantity[0]}
                  max={initialMinMaxQuantity[1]}
                  sx={{ width: isSmallScreen ? "180%" : "100%" }}
                />
                <Typography variant="body2">
                  {`${quantityRange[0]} - ${quantityRange[1]}`}
                </Typography>
              </FormControl>
            </Box>

            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              sx={{ width: isSmallScreen ? "100%" : "200%" }}
            >
              <FormControl fullWidth>
                <Typography gutterBottom>Valor</Typography>
                <Slider
                  value={valueRange}
                  onChange={handleSliderChange}
                  valueLabelDisplay="auto"
                  min={initialMinMaxValue[0]}
                  max={initialMinMaxValue[1]}
                  sx={{ width: isSmallScreen ? "180%" : "100%" }}
                />
                <Typography variant="body2">
                  {`R$${valueRange[0]} - R$${valueRange[1]}`}
                </Typography>
              </FormControl>
            </Box>
          </Box>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <FormControl fullWidth>
              <InputLabel id="items-per-page-label">
                Itens por Página
              </InputLabel>
              <Select
                labelId="items-per-page-label"
                value={itemsPerPage}
                label="Itens por Página"
                onChange={handleItemsPerPageChange}
              >
                {[10, 20, 50, 100].map((size) => (
                  <MenuItem key={size} value={size}>
                    {size}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Box>
      <Box mt={2} sx={{ minHeight: stocks.length > 0 ? "auto" : "300px" }}>
        {loading ? (
          <Box>
            {[...Array(5)].map((_, index) => (
              <Skeleton
                key={index}
                variant="rectangular"
                height={60}
                animation="wave"
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
        ) : stocks.length > 0 ? (
          stocks.map((stock) => (
            <Box
              key={stock.id}
              display="flex"
              flexDirection={isSmallScreen ? "row" : "row"}
              alignItems={"center"}
              justifyContent="space-between"
              p={2}
              borderBottom="1px solid #ccc"
              gap={1}
            >
              <Box>
                <Typography variant="h6">{stock.productName}</Typography>
                <Typography variant="body2">Valor: R$ {stock.value}</Typography>
                <Typography variant="body2">
                  Quantidade: {stock.quantity}
                </Typography>
                <Typography variant="body2">
                  Fornecedor: {stock.supplierName}
                </Typography>
              </Box>
              <Box display="flex" gap={1} alignItems={"center"}>
                <IconButton
                  color="primary"
                  onClick={() => handleClickEdit(stock)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() =>
                    handleOpenDeleteDialog(stock.id, stock.productName)
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          !loading && (
            <Alert severity="info" sx={{ mt: 10, justifyContent: "center" }}>
              Nenhum item no estoque —{" "}
              <strong>Verifique os filtros aplicados!</strong>
            </Alert>
          )
        )}
      </Box>
      <Pagination
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={handlePageChange}
      />
      <StockForm
        open={open}
        handleClose={() => setOpen(false)}
        editMode={editMode}
        currentStock={currentStock}
        retrieveStocks={() => retrieveStocks(page, itemsPerPage)}
        setSuccessMessage={setSuccessMessage}
        fetchLimits={fetchLimits}
      />
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        severity="error"
      />
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        severity="success"
      />

      <Dialog
        open={confirmDelete.open}
        onClose={() =>
          setConfirmDelete({ open: false, id: null, productName: "" })
        }
        aria-labelledby="confirm-delete-dialog"
        aria-describedby="confirm-delete-description"
      >
        <DialogTitle id="confirm-delete-dialog">Confirmar Exclusão</DialogTitle>
        <DialogContent>
          <Typography id="confirm-delete-description">
            Tem certeza de que deseja excluir o produto{" "}
            <strong>{confirmDelete.productName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() =>
              setConfirmDelete({ open: false, id: null, productName: "" })
            }
            color="primary"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="primary"
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardCard>
  );
};

export default StockPage;