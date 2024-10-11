import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Box,
  Avatar,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconShieldCheck, IconEye, IconChevronDown } from "@tabler/icons-react";
import PageContainer from "../../../components/container/PageContainer";
import DashboardCard from "../../../components/shared/DashboardCard";
import stockOverviewService from "../../../services/stockOverviewService";

const StockSafetyPage = () => {
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    retrieveSafetyStockProducts(page);
  }, [page]);

  const retrieveSafetyStockProducts = (currentPage) => {
    stockOverviewService
      .getHighStockReport(5, currentPage, size)
      .then((response) => {
        const productData = response.data._embedded?.stockDTOList || [];
        setProducts(productData);
        setTotalPages(response.data.page.totalPages);
      })
      .catch(console.log);
  };
  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage(page - 1);
    }
  };

  const handleProductClick = (productId) => {
    navigate(`/stock/${productId}/edit`);
  };

  return (
    <PageContainer
      title="Produtos em Estoque Seguro"
      description="Página de produtos com estoque seguro (5 ou mais)"
    >
      <DashboardCard title="Produtos com Estoque Seguro">
        <Grid container spacing={-5}>
          {products.length === 0 ? (
            <Typography variant="body2" color="textSecondary">
              Nenhum produto com estoque seguro.
            </Typography>
          ) : (
            products.map((product) => (
              <Grid size={{ xs: 12 }} key={product.id}>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<IconChevronDown />}
                    aria-controls={`panel-${product.id}-content`}
                    id={`panel-${product.id}-header`}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      sx={{
                        width: "100%",
                        padding: "10px",
                        borderRadius: "8px",
                        backgroundColor: "#f9f9f9",
                        mb: 2,
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                        "&:hover": {
                          backgroundColor: "#f0f0f0",
                        },
                      }}
                    >
                      <Box display="flex" alignItems="center">
                        <Avatar
                          sx={{
                            bgcolor: "#e3f2fd",
                            width: 27,
                            height: 27,
                            mr: 2,
                          }}
                        >
                          <IconShieldCheck width={20} color="#1e88e5" />
                        </Avatar>
                        <Typography variant="subtitle2">
                          {product.productName}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Typography
                          variant="subtitle2"
                          color="success"
                          sx={{ mr: 2 }}
                        >
                          Quantidade: {product.quantity}
                        </Typography>
                        <IconButton
                          onClick={() => handleProductClick(product.id)}
                          aria-label="Edit product"
                        >
                          <IconEye width={20} />
                        </IconButton>
                      </Box>
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="textSecondary">
                      <strong>Disponível:</strong>{" "}
                      {product.available ? "Sim" : "Não"} <br />
                      <strong>Valor:</strong> R${product.value.toFixed(2)}{" "}
                      <br />
                      <strong>Fornecedor:</strong>{" "}
                      {product.supplierName || "Unknown"}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))
          )}
        </Grid>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button
            variant="contained"
            onClick={handlePreviousPage}
            disabled={page === 0}
          >
            Página Anterior
          </Button>
          <Button
            variant="contained"
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
          >
            Próxima Página
          </Button>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default StockSafetyPage;
