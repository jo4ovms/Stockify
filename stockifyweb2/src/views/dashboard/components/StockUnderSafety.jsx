import { useState, useEffect } from "react";
import { useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Typography, Avatar, Fab, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { IconAlertTriangle } from "@tabler/icons-react";
import DashboardCard from "../../../components/shared/DashboardCard";

const StockUnderSafety = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const errorlight = "#fdede8";
  const primary = theme.palette.primary.main;

  useEffect(() => {
    setProducts([]);
  }, []);

  const handleProductClick = () => {
    navigate("/products");
  };

  const handleViewAllClick = () => {
    navigate("/products");
  };

  return (
    <DashboardCard
      title="Produtos Acabando!"
      action={
        <Fab
          color="secondary"
          size="medium"
          sx={{ color: "#ffffff" }}
          onClick={handleViewAllClick}
        >
          <IconAlertTriangle width={24} />
        </Fab>
      }
      sx={{ width: "125%", height: "270px", maxWidth: "600px" }}
    >
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100%"
      >
        <Typography variant="h4" fontWeight="700" mb={1}>
          {/* {products.length} */}
        </Typography>
        <Grid
          container
          spacing={2}
          style={{ overflowY: "auto", maxHeight: "300px", width: "100%" }}
        >
          {/* {products.length === 0 ? ( */}
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="100%"
            width="85%"
          >
            <Typography
              variant="h7"
              color="textSecondary"
              sx={{ ml: 10, mt: 3, textAlign: "center" }}
            >
              Nenhum produto abaixo da quantidade segura.
            </Typography>
          </Box>
        </Grid>
      </Box>
    </DashboardCard>
  );
};
export default StockUnderSafety;
