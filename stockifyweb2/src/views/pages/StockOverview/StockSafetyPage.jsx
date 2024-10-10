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
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconShieldCheck, IconEye, IconChevronDown } from "@tabler/icons-react";
import PageContainer from "../../../components/container/PageContainer";
import DashboardCard from "../../../components/shared/DashboardCard";
import stockOverviewService from "../../../services/stockOverviewService";

const StockSafetyPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    retrieveSafetyStockProducts();
  }, []);

  const retrieveSafetyStockProducts = () => {
    stockOverviewService
      .getHighStockReport(5)
      .then((response) => {
        const productData = response.data.products || [];
        setProducts(productData);
      })
      .catch(console.log);
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
      </DashboardCard>
    </PageContainer>
  );
};

export default StockSafetyPage;
