import { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Box,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Add as AddIcon,
  List as ListIcon,
} from "@mui/icons-material";
import PageContainer from "../../components/container/PageContainer";
import PageCard from "../../components/shared/PageCard";
import supplierService from "../../services/supplier.service";
import SupplierForm from "./Supplier/SupplierForm";
import DashboardCard from "../../components/shared/PageCard";
import useSupplier from "../../hooks/useSupplier";

const SupplierPage = () => {
  const {
    suppliers,
    currentSupplier,
    open,
    editMode,
    handleClickOpen,
    handleClickEdit,
    handleClose,
    handleChange,
    saveSupplier,
    deleteSupplier,
  } = useSupplier();

  return (
    <PageContainer title="Suppliers" description="this is Suppliers page">
      <DashboardCard title="Fornecedores">
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" gap={2}>
            <FormControl sx={{ marginBottom: 2, minWidth: 200 }}>
              <InputLabel id="filter-tipo-produto-label">
                Tipo de Produto
              </InputLabel>
              <Select
                labelId="filter-tipo-produto-label"
                id="filter-tipo-produto"
                // value={currentFornecedor.typeProduct || ""}
                label="Tipo de Produto"
                // onChange={(e) => handleChange(e)}
              >
                <MenuItem value="">
                  <em>Todos</em>
                </MenuItem>
              </Select>
            </FormControl>
            <TextField
              label="Pesquisar Fornecedor"
              variant="outlined"
              // value={currentSupplier.name}
              // onChange={(e) => handleChange(e)}
              sx={{ minWidth: 200 }}
            />
          </Box>

          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            sx={{ marginLeft: "auto" }}
          >
            Criar Fornecedor
          </Button>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 4,
            }}
          >
            {/*} <ImportExportButtonsFornecedor
              iconSize={35}
              iconStyle={{ color: "green" }}
              containerStyle={{ display: "flex", justifyContent: "center" }}
            />
            */}
          </Box>
        </Box>

        <Box mt={2}>
          {suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <Box
                key={supplier.id}
                display="flex"
                flexDirection="column"
                borderBottom="1px solid #ccc"
                mb={2}
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
                      color="secondary"
                      onClick={() => deleteSupplier(supplier.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                    <IconButton
                      color="primary"
                      onClick={() => console.log("Show products")}
                    >
                      <ListIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            ))
          ) : (
            <Typography variant="h7">
              Nenhum Fornecedor registrado ainda.
            </Typography>
          )}
        </Box>
      </DashboardCard>

      <SupplierForm
        open={open}
        handleClose={handleClose}
        handleSave={saveSupplier}
        supplier={currentSupplier}
        editMode={editMode}
        handleChange={handleChange}
      />
    </PageContainer>
  );
};

export default SupplierPage;
