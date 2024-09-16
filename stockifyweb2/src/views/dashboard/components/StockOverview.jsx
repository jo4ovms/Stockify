import React, { useState, useEffect } from "react";
import { Stack, Typography, Avatar, Fab, Box } from "@mui/material";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { IconAlertTriangle, IconCheck, IconBox } from "@tabler/icons-react";
import DashboardCard from "../../../components/shared/DashboardCard";

const StockOverview = () => {
  const [totalItems, setTotalItems] = useState(0);
  const [lowStockItems, setLowStockItems] = useState(0);
  const [outOfStockitems, setOutOfStockitems] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    setTotalItems(10);
    setLowStockItems(5);
    setOutOfStockitems(3);
  }, []);

  const handleNavigate = (path) => {
    navigate(path);
  };

  const theme = useTheme();
  const errorlight = "#fdede8";
  const warninglight = "#fff8e1";
  const successlight = "#e8f5e9";

  return (
    <DashboardCard
      title="Visão Geral do Estoque"
      action={
        <Fab
          color="secondary"
          size="medium"
          sx={{ color: "#ffffff" }}
          onClick={() => handleNavigate("/products")}
        >
          <IconBox width={24} />
        </Fab>
      }
      sx={{ height: "240px", width: "125%", maxWidth: "600px" }}
    >
      <>
        <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
          <Typography variant="h4" fontWeight="700" mt="-10px">
            {totalItems} Itens
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            Total em Estoque
          </Typography>
        </Box>
        <Stack
          direction="row"
          spacing={3}
          justifyContent="space-between"
          alignItems="center"
        >
          <Box
            display="flex"
            alignItems="center"
            onClick={() => handleNavigate("/products/under-safety")}
            style={{ cursor: "pointer" }}
          >
            <Avatar
              sx={{ bgcolor: warninglight, width: 40, height: 40, mr: 2 }}
            >
              <IconAlertTriangle
                width={24}
                color={theme.palette.warning.main}
              />
            </Avatar>
            <Box>
              <Typography variant="h5">{lowStockItems}</Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Baixo Estoque
              </Typography>
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            onClick={() => handleNavigate("/products/out-of-stock")}
            style={{ cursor: "pointer" }}
          >
            <Avatar sx={{ bgcolor: errorlight, width: 40, height: 40, mr: 2 }}>
              <IconAlertTriangle width={24} color={theme.palette.error.main} />
            </Avatar>
            <Box>
              <Typography variant="h5">{outOfStockitems}</Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Fora de Estoque
              </Typography>
            </Box>
          </Box>
          <Box
            display="flex"
            alignItems="center"
            onClick={() => handleNavigate("/products/over-safety")}
            style={{ cursor: "pointer" }}
          >
            <Avatar
              sx={{ bgcolor: successlight, width: 40, height: 40, mr: 2 }}
            >
              <IconCheck width={24} color={theme.palette.success.main} />
            </Avatar>
            <Box>
              <Typography variant="h5">
                {totalItems - lowStockItems + outOfStockitems}
              </Typography>
              <Typography variant="subtitle2" color="textSecondary">
                Estoque adequado
              </Typography>
            </Box>
          </Box>
        </Stack>
      </>
    </DashboardCard>
  );
};

export default StockOverview;
