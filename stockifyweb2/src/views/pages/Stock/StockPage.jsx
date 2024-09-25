import React, { useState, useEffect } from "react";
import { Box, Button, Typography, IconButton } from "@mui/material";
import stockService from "../../../services/stockService";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import DashboardCard from "../../../components/shared/DashboardCard";
import StockForm from "./StockForm";

const StockPage = () => {
  const [stocks, setStocks] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentStock, setCurrentStock] = useState(null);
  const [page, setPage] = useState(0);
  const [size] = useState(10);

  useEffect(() => {
    retrieveStocks();
  }, [page]);

  const retrieveStocks = () => {
    stockService.getAllStock(page, size).then(setStocks);
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

  const handleDelete = (id) => {
    stockService.deleteStock(id).then(retrieveStocks);
  };

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePreviousPage = () => setPage((prev) => (prev > 0 ? prev - 1 : 0));

  return (
    <DashboardCard title="Gestão de Estoque">
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Button variant="contained" color="primary" onClick={handleClickOpen}>
          Adicionar ao Estoque
        </Button>
      </Box>

      <Box mt={2}>
        {stocks.length > 0 ? (
          stocks.map((stock) => (
            <Box
              key={stock.id}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              p={2}
              borderBottom="1px solid #ccc"
            >
              <Box>
                <Typography variant="h6">{stock.productName}</Typography>{" "}
                <Typography variant="body2">Valor: {stock.value}</Typography>
                <Typography variant="body2">
                  Quantidade: {stock.quantity}
                </Typography>
                <Typography variant="body2">
                  Fornecedor: {stock.supplierName}
                </Typography>{" "}
              </Box>
              <Box>
                <IconButton
                  color="primary"
                  onClick={() => handleClickEdit(stock)}
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="secondary"
                  onClick={() => handleDelete(stock.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          ))
        ) : (
          <Typography>Nenhum item no estoque ainda.</Typography>
        )}
      </Box>

      <Box display="flex" justifyContent="space-between" mt={2}>
        <Button
          variant="contained"
          onClick={handlePreviousPage}
          disabled={page === 0}
        >
          Página Anterior
        </Button>
        <Button variant="contained" onClick={handleNextPage}>
          Próxima Página
        </Button>
      </Box>

      <StockForm
        open={open}
        handleClose={() => setOpen(false)}
        editMode={editMode}
        currentStock={currentStock}
        retrieveStocks={retrieveStocks}
      />
    </DashboardCard>
  );
};

export default StockPage;
