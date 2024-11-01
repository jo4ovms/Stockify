import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  List as ListIcon,
} from "@mui/icons-material";
import SearchIcon from "@mui/icons-material/Search";
import {
  Typography,
  Button,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  IconButton,
  MenuItem,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  useMediaQuery,
  Collapse,
  useTheme,
  CircularProgress,
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import { Suspense, lazy } from "react";
import PageContainer from "../../../components/container/PageContainer.jsx";
import DashboardCard from "../../../components/shared/DashboardCard.jsx";
import Pagination from "../../../components/shared/Pagination.jsx";
import useSupplier from "../../../hooks/useSupplier";
import ProductList from "../Product/ProductList.jsx";
const ProductForm = lazy(() => import("./ProductForm.jsx"));
const SupplierForm = lazy(() => import("./SupplierForm.jsx"));

const SupplierPage = () => {
  const {
    suppliers,
    currentSupplier,
    expandedSupplierId,
    productListRef,
    setSuccessMessage,
    setErrorMessage,
    retrieveProducts,
    currentProduct,
    productsBySupplier,
    productsPage,
    productsTotalPages,
    open,
    openProductDialog,
    editMode,
    searchTerm,
    filterProductType,
    handleClickOpen,
    handleClickEdit,
    handleClickCreateProduct,
    handleClickShowProducts,
    handleClose,
    handleCloseProductDialog,
    handleChange,
    handleChangeProduct,
    handleSearchChange,
    handleFilterProductTypeChange,
    saveSupplier,
    saveProduct,
    editProduct,
    page,
    setPage,
    totalPages,
    totalItems,
    handleItemsPerPageChange,
    allProductTypes,
    searchProductTermBySupplier,
    handleSearchProductChange,
    loading,
    errorMessage,
    size,
    successMessage,
    confirmDeleteProduct,
    cancelDeleteProduct,
    handleDeleteProduct,
    confirmDeleteDialog,
    loadingProducts,
    confirmDeleteSupplier,
    cancelDeleteSupplier,
    handleDeleteSupplier,
    confirmDeleteSupplierDialog,
  } = useSupplier();

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <PageContainer title="Suppliers" description="this is Suppliers page">
      <DashboardCard title="Fornecedores">
        <Box
          display="flex"
          flexDirection={isSmallScreen ? "column" : "row"}
          justifyContent="space-between"
          alignItems="center"
          mb={2}
          gap={isSmallScreen ? 2 : 0}
        >
          <Box
            display="flex"
            gap={2}
            flexDirection={isSmallScreen ? "column" : "row"}
            width="100%"
          >
            <FormControl
              fullWidth={isSmallScreen}
              sx={{ minWidth: isSmallScreen ? "auto" : 200 }}
            >
              <InputLabel id="filter-tipo-produto-label">
                Tipo de Produto
              </InputLabel>
              <Select
                labelId="filter-tipo-produto-label"
                id="filter-tipo-produto"
                value={
                  allProductTypes.includes(filterProductType)
                    ? filterProductType
                    : ""
                }
                label="Tipo de Produto"
                onChange={handleFilterProductTypeChange}
              >
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
                {allProductTypes.map((productType, index) => (
                  <MenuItem key={index} value={productType}>
                    {productType}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Pesquisar Fornecedor"
              variant="outlined"
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ minWidth: isSmallScreen ? "auto" : 200 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <FormControl sx={{ minWidth: isSmallScreen ? "auto" : 150 }}>
              <InputLabel id="items-per-page-label">
                Itens por Página
              </InputLabel>
              <Select
                labelId="items-per-page-label"
                value={size}
                onChange={(e) => handleItemsPerPageChange(e.target.value)}
              >
                {[10, 20, 50, 100].map((sizeOption) => (
                  <MenuItem key={sizeOption} value={sizeOption}>
                    {sizeOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            fullWidth={isSmallScreen}
            sx={{ mt: isSmallScreen ? 2 : 0 }}
          >
            Criar Fornecedor
          </Button>
        </Box>

        <Box mt={2} sx={{ minHeight: suppliers.length > 0 ? "auto" : "300px" }}>
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
          ) : suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <Box
                key={supplier.id}
                display="flex"
                flexDirection="column"
                borderBottom="1px solid #ccc"
                mb={2}
                ref={(el) => (productListRef.current[supplier.id] = el)}
              >
                <Box
                  display="flex"
                  flexDirection={isSmallScreen ? "column" : "row"}
                  alignItems={isSmallScreen ? "flex-start" : "center"}
                  justifyContent="space-between"
                  p={2}
                >
                  <Box>
                    <Typography variant="h6">{supplier.name}</Typography>
                    <Typography variant="body2">
                      Email: {supplier.email}
                    </Typography>
                    <Typography variant="body2">
                      CNPJ: {supplier.cnpj}
                    </Typography>
                    <Typography variant="body2">
                      Telefone: {supplier.phone}
                    </Typography>
                    <Typography variant="body2">
                      Tipo de Produto: {supplier.productType}
                    </Typography>
                  </Box>
                  <Box
                    display="flex"
                    flexDirection={"row"}
                    alignItems="center"
                    justifyContent="center"
                    ml={isSmallScreen ? 6 : 0}
                    gap={2}
                    height={40}
                    mt={isSmallScreen ? 1 : 0}
                    sx={{ border: "1px solid transparent" }}
                  >
                    <IconButton
                      color="primary"
                      onClick={() => handleClickEdit(supplier)}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="primary"
                      onClick={() => handleClickCreateProduct(supplier)}
                    >
                      <AddIcon />
                    </IconButton>

                    <IconButton
                      color="primary"
                      onClick={() => handleClickShowProducts(supplier)}
                    >
                      <ListIcon />
                    </IconButton>

                    <IconButton
                      color="secondary"
                      onClick={() =>
                        handleDeleteSupplier(supplier.id, supplier.name)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>

                <Collapse
                  in={expandedSupplierId === supplier.id}
                  timeout={300}
                  unmountOnExit
                >
                  <Box mt={2} pl={2} pr={2} pb={2}>
                    <Box minHeight="300px">
                      {" "}
                      {loadingProducts[supplier.id] ? (
                        <Box
                          height="300px"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <CircularProgress />
                        </Box>
                      ) : (
                        <>
                          <TextField
                            label={`Buscar produtos de ${supplier.name}`}
                            variant="outlined"
                            value={
                              searchProductTermBySupplier[supplier.id] || ""
                            }
                            onChange={(e) =>
                              handleSearchProductChange(
                                supplier.id,
                                e.target.value
                              )
                            }
                            fullWidth={isSmallScreen}
                            sx={{
                              minWidth: isSmallScreen ? "auto" : 400,
                              marginBottom: 3,
                            }}
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon sx={{ color: "#888" }} />
                                  </InputAdornment>
                                ),
                              },
                            }}
                          />

                          {productsBySupplier[supplier.id]?.length > 0 ? (
                            <ProductList
                              products={productsBySupplier[supplier.id] || []}
                              productsPage={productsPage[supplier.id] || 0}
                              productsTotalPages={
                                productsTotalPages[supplier.id] || 1
                              }
                              onPreviousPage={() =>
                                retrieveProducts(
                                  supplier.id,
                                  Math.max(productsPage[supplier.id] - 1, 0)
                                )
                              }
                              onNextPage={() =>
                                retrieveProducts(
                                  supplier.id,
                                  productsPage[supplier.id] + 1
                                )
                              }
                              isSmallScreen={isSmallScreen}
                              onEditProduct={(product) => editProduct(product)}
                              onDeleteProduct={(productId, productName) =>
                                handleDeleteProduct(productId, productName)
                              }
                            />
                          ) : (
                            <Typography variant="h6">
                              Nenhum produto registrado ainda.
                            </Typography>
                          )}
                        </>
                      )}
                    </Box>
                  </Box>
                </Collapse>
              </Box>
            ))
          ) : (
            !loading && (
              <Alert severity="info" sx={{ mt: 10, justifyContent: "center" }}>
                Nenhum fornecedor encontrado —{" "}
                <strong>Verifique os filtros aplicados!</strong>
              </Alert>
            )
          )}
        </Box>
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setPage}
        />
      </DashboardCard>
      <Suspense fallback={<div>Loading...</div>}>
        <SupplierForm
          open={open}
          handleClose={handleClose}
          handleSave={saveSupplier}
          supplier={currentSupplier}
          editMode={editMode}
          handleChange={handleChange}
        />
        {currentSupplier?.id && (
          <ProductForm
            open={openProductDialog}
            handleClose={handleCloseProductDialog}
            handleSave={saveProduct}
            currentProduct={currentProduct}
            editMode={editMode}
            handleChange={handleChangeProduct}
            currentSupplier={currentSupplier}
            setSuccessMessage={setSuccessMessage}
            setErrorMessage={setErrorMessage}
          />
        )}
      </Suspense>
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage("")}
        message={errorMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
        message={successMessage}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />
      <Dialog
        open={confirmDeleteDialog.open}
        onClose={cancelDeleteProduct}
        aria-labelledby="confirm-delete-dialog-title"
      >
        <DialogTitle id="confirm-delete-dialog-title">
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza de que deseja excluir o produto{" "}
            <strong>{confirmDeleteDialog.productName}</strong>?
            <br />
            <strong style={{ color: "#f44336" }}>
              Esta operação irá apagar o produto em estoque também.
            </strong>
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteProduct} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={confirmDeleteProduct}
            color="primary"
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={confirmDeleteSupplierDialog.open}
        onClose={cancelDeleteSupplier}
        aria-labelledby="confirm-delete-supplier-dialog-title"
      >
        <DialogTitle id="confirm-delete-supplier-dialog-title">
          Confirmar Exclusão
        </DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza de que deseja excluir o fornecedor{" "}
            <strong>{confirmDeleteSupplierDialog.supplierName}</strong>?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteSupplier} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={confirmDeleteSupplier}
            color="primary"
            variant="contained"
          >
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default SupplierPage;
