import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Typography,
  Fab,
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  CircularProgress,
} from "@mui/material";
import { IconArrowRight } from "@tabler/icons-react";
import DashboardCard from "../../../components/shared/DashboardCard";
import saleService from "../../../services/saleService";

const BestSellingItems = ({ sx }) => {
  const [bestSellingItems, setBestSellingItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const fetchBestSellingItems = useCallback(async () => {
    try {
      const response = await saleService.getBestSellingItems();
      setBestSellingItems(response.slice(0, 8));
    } catch (error) {
      console.error("Failed to fetch best selling items:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBestSellingItems();
  }, [fetchBestSellingItems]);

  const handleViewAllClick = useCallback(() => {
    navigate("/sold-items");
  }, [navigate]);

  return (
    <DashboardCard
      title="Produtos Mais Vendidos"
      action={
        <Fab
          color="secondary"
          size="medium"
          sx={{ color: "#ffffff" }}
          onClick={handleViewAllClick}
        >
          <IconArrowRight width={24} />
        </Fab>
      }
      sx={{ height: "600px", width: "125%", maxWidth: "900px", ...sx }}
    >
      <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
        {isLoading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <CircularProgress />
          </Box>
        ) : isError ? (
          <Typography
            variant="body2"
            sx={{ mt: 2, textAlign: "center", color: "error.main" }}
          >
            Falha ao carregar produtos mais vendidos.
          </Typography>
        ) : bestSellingItems.length > 0 ? (
          <Table
            aria-label="best selling items table"
            sx={{ whiteSpace: "nowrap", mt: 0 }}
          >
            <TableHead>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" fontWeight={600}>
                    Produto
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="subtitle2" fontWeight={600}>
                    Quantitidade Vendida
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bestSellingItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Typography sx={{ fontSize: "16px", fontWeight: "500" }}>
                      {item.productName}{" "}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="h6">
                      {item.totalQuantitySold}
                    </Typography>{" "}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            Nenhum Produto Vendido.
          </Typography>
        )}
      </Box>
    </DashboardCard>
  );
};

export default BestSellingItems;
