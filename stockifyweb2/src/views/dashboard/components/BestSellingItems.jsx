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
  Skeleton,
} from "@mui/material";
import { IconArrowRight } from "@tabler/icons-react";
import DashboardCard from "../../../components/shared/DashboardCard";
import saleService from "../../../services/saleService";
import { useQuery } from "react-query";

const fetchBestSellingItems = async () => {
  const response = await saleService.getBestSellingItems();
  return response.slice(0, 8);
};

const BestSellingItems = ({ sx }) => {
  const navigate = useNavigate();

  const {
    data: bestSellingItems = [],
    isLoading,
    isError,
  } = useQuery("bestSellingItems", fetchBestSellingItems);
  const handleViewAllClick = useCallback(() => {
    navigate("/sold-items");
    window.scrollTo(0, 0);
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
          <>
            {Array.from(new Array(6)).map((_, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  padding: "10px",
                  width: "100%",
                  minWidth: "300px",
                }}
              >
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            ))}
          </>
        ) : isError ? (
          <Typography variant="subtitle1" sx={{ mt: 2, textAlign: "center" }}>
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
