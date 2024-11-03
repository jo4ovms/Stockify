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
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  lazy,
  Suspense,
} from "react";
import { useParams } from "react-router-dom";
import DashboardCard from "../../../components/shared/DashboardCard.jsx";
import Pagination from "../../../components/shared/Pagination.jsx";
import SupplierFilter from "../../../components/shared/SupplierFilter.jsx";
import stockService from "../../../services/stockService";
const StockForm = lazy(() => import("./StockForm.jsx"));
const EditIcon = lazy(() => import("@mui/icons-material/Edit"));
const DeleteIcon = lazy(() => import("@mui/icons-material/Delete"));

const StockPage = () => {
  const { id } = useParams();
  const [stocks, setStocks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStock, setCurrentStock] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [firstLoad, setFirstLoad] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [quantityRange, setQuantityRange] = useState([0, 100]);
  const [initialMinMaxValue, setInitialMinMaxValue] = useState([0, 10000]);
  const [valueRange, setValueRange] = useState([0, 10000]);
  const [initialMinMaxQuantity, setInitialMinMaxQuantity] = useState([0, 100]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
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
        setInitialMinMaxQuantity([0, limits.maxQuantity || 100]);
        setQuantityRange([0, limits.maxQuantity || 100]);
      }
      if (limits && typeof limits.maxValue === "number") {
        setInitialMinMaxValue([0, limits.maxValue || 10000]);
        setValueRange([0, limits.maxValue || 10000]);
      }
    } catch (error) {
      setErrorMessage(`Erro ao obter os limites de estoque: ${error.message}`);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (id) {
      setLoading(true);
      stockService
        .getStockById(id)
        .then((response) => {
          setEditMode(true);
          setCurrentStock(response);
          setOpen(true);
        })
        .catch(() => setErrorMessage("Erro ao carregar o estoque."))
        .finally(() => setLoading(false));
    }
  }, [id]);

  useEffect(() => {
    setPage(0);
  }, [searchQuery, selectedSupplier]);

  const retrieveStocks = async () => {
    setLoading(true);

    const controller = new AbortController();
    try {
      const params = {
        page,
        size: itemsPerPage,
        minQuantity: quantityRange[0],
        maxQuantity: quantityRange[1],
        minValue: valueRange[0],
        maxValue: valueRange[1],
        query: searchQuery.trim() || undefined,
        supplierId: selectedSupplier || undefined,
      };

      const response = await stockService.getAllStock(params);
      const newStocks = response._embedded?.stockDTOList || [];
      setStocks(newStocks);
      // setStocks(response._embedded?.stockDTOList || []);
      if (firstLoad && newStocks.length === 1) {
        setFirstLoad(false);
      }

      if (formSubmitted) {
        setFormSubmitted(false);
      }
      setTotalPages(response.page?.totalPages || 1);
      setTotalItems(response.page?.totalElements || 0);
      // setInitialLoadComplete(true);
    } catch {
      setErrorMessage("Erro ao carregar o estoque.");
    } finally {
      setLoading(false);
      setInitialLoadComplete(true);
    }
    return () => controller.abort();
  };

  const handleFormClose = () => {
    setOpen(false);
    if (formSubmitted) {
      fetchLimits();
      retrieveStocks();
      setFormSubmitted(false);
    }
  };

  useEffect(() => {
    fetchLimits();
    setInitialLoadComplete(true);
  }, []);

  useEffect(() => {
    if (!initialLoadComplete) return;

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      retrieveStocks();
    }, 300);

    return () => clearTimeout(debounceTimeout.current);
  }, [
    page,
    itemsPerPage,
    quantityRange,
    valueRange,
    debouncedQuery,
    selectedSupplier,
  ]);

  const handleClickOpen = () => {
    setEditMode(false);
    setCurrentStock(null);
    setOpen(true);
  };

  const handleClickEdit = useCallback((stock) => {
    setEditMode(true);
    setCurrentStock(stock);
    setOpen(true);
  }, []);

  const handleDeleteConfirm = async () => {
    const { id, productName } = confirmDelete;
    try {
      await stockService.deleteStock(id);
      retrieveStocks();
      setSuccessMessage(`Produto ${productName} deletado com sucesso.`);
    } catch {
      setErrorMessage("Erro ao deletar o produto em estoque.");
    } finally {
      setConfirmDelete({ open: false, id: null, productName: "" });
    }
  };

  const handleOpenDeleteDialog = (id, productName) => {
    setConfirmDelete({ open: true, id, productName });
  };

  const handleSliderChange = (event, newValue) => {
    if (Array.isArray(newValue) && newValue.length === 2) {
      setLoading(true);
      setValueRange(
        newValue[1] > initialMinMaxValue[1]
          ? [newValue[0], initialMinMaxValue[1]]
          : newValue
      );
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(event.target.value);
    setPage(0);
  };

  return (
    <DashboardCard title="Gestão de Estoque">
      <Box sx={{ padding: theme.spacing(2, 0) }}>
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
                  sx={{ width: isSmallScreen ? "160%" : "100%" }}
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
              sx={{ width: isSmallScreen ? "160%" : "200%" }}
            >
              <FormControl fullWidth>
                <Typography gutterBottom>Valor</Typography>
                <Slider
                  value={valueRange}
                  onChange={handleSliderChange}
                  valueLabelDisplay="auto"
                  min={initialMinMaxValue[0]}
                  max={initialMinMaxValue[1]}
                  sx={{ width: isSmallScreen ? "150%" : "100%" }}
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
                <Typography variant="h6">
                  {stock.productName || "Nome do produto não disponível"}
                </Typography>
                <Typography variant="body2">
                  Valor: R$ {stock.value || "0,00"}
                </Typography>
                <Typography variant="body2">
                  Quantidade: {stock.quantity || "0"}
                </Typography>
                <Typography variant="body2">
                  Fornecedor: {stock.supplierName || "Desconhecido"}
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
          initialLoadComplete &&
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
      <Suspense
        fallback={
          <Skeleton variant="rectangular" height={60} animation="wave" />
        }
      >
        <StockForm
          open={open}
          handleClose={handleFormClose}
          editMode={editMode}
          currentStock={currentStock}
          retrieveStocks={() => {
            setFormSubmitted(true);
            retrieveStocks();
          }}
          setSuccessMessage={(message) => setSuccessMessage(message)}
          fetchLimits={() => setPage(0)}
          setFormSubmitted={setFormSubmitted}
        />
      </Suspense>
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
