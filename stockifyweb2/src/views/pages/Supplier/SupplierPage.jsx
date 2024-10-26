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
} from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import PageContainer from "../../../components/container/PageContainer.jsx";
import DashboardCard from "../../../components/shared/DashboardCard.jsx";
import useSupplier from "../../../hooks/useSupplier";
import ProductForm from "./ProductForm.jsx";
import SupplierForm from "./SupplierForm.jsx";
import Pagination from "../../../components/shared/Pagination.jsx";

const SupplierPage = () => {
  const {
    suppliers,
    currentSupplier,
    productListRef,
    setSuccessMessage,
    setErrorMessage,
    retrieveProducts,
    currentProduct,
    productsBySupplier,
    productsPage,
    productsTotalPages,
    visibleProducts,
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
    confirmDeleteSupplier,
    cancelDeleteSupplier,
    handleDeleteSupplier,
    confirmDeleteSupplierDialog,
  } = useSupplier();

  return (
    <PageContainer title="Suppliers" description="this is Suppliers page">
      <DashboardCard title="Fornecedores">
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Box display="flex" gap={2}>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel id="filter-tipo-produto-label">
                Tipo de Produto
              </InputLabel>
              <Select
                labelId="filter-tipo-produto-label"
                id="filter-tipo-produto"
                value={filterProductType}
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
              sx={{ minWidth: 200 }}
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

            <FormControl sx={{ minWidth: 150 }}>
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

          <Button variant="contained" color="primary" onClick={handleClickOpen}>
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
                  alignItems="center"
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
                  <Box>
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

                {visibleProducts[supplier.id] && (
                  <Box mt={2} pl={2} pr={2} pb={2}>
                    <TextField
                      label={`Buscar produtos de ${supplier.name}`}
                      variant="outlined"
                      value={searchProductTermBySupplier[supplier.id] || ""}
                      onChange={(e) =>
                        handleSearchProductChange(supplier.id, e.target.value)
                      }
                      sx={{ minWidth: 400, marginBottom: 3 }}
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
                      productsBySupplier[supplier.id].map((product) => (
                        <Box
                          key={product.id}
                          display="flex"
                          alignItems="center"
                          justifyContent="space-between"
                          p={2}
                          borderBottom="1px solid #ccc"
                        >
                          <Box>
                            <Typography variant="h6">{product.name}</Typography>
                            <Typography variant="body2">
                              Valor: R$ {product.value}
                            </Typography>
                            <Typography variant="body2">
                              Quantidade: {product.quantity}
                            </Typography>
                          </Box>
                          <Box>
                            <IconButton
                              color="primary"
                              onClick={() => editProduct(product)}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              color="secondary"
                              onClick={() =>
                                handleDeleteProduct(product.id, product.name)
                              }
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      ))
                    ) : (
                      <Typography variant="h6">
                        Nenhum produto registrado ainda.
                      </Typography>
                    )}

                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      mt={3}
                    >
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          retrieveProducts(
                            supplier,
                            Math.max(productsPage[supplier.id] - 1, 0)
                          );
                        }}
                        disabled={productsPage[supplier.id] === 0}
                      >
                        Página Anterior
                      </Button>

                      <Typography>
                        Página {productsPage[supplier.id] + 1} de{" "}
                        {productsTotalPages[supplier.id]}
                      </Typography>

                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                          retrieveProducts(
                            supplier,
                            Math.min(
                              productsPage[supplier.id] + 1,
                              productsTotalPages[supplier.id] - 1
                            )
                          );
                        }}
                        disabled={
                          productsPage[supplier.id] >=
                          productsTotalPages[supplier.id] - 1
                        }
                      >
                        Próxima Página
                      </Button>
                    </Box>
                  </Box>
                )}
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
