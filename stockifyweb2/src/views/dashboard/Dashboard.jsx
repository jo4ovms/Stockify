import React from "react";
import Grid from "@mui/material/Grid";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";
import StockOverview from "./components/StockOverview";
import StockUnderSafety from "./components/StockUnderSafety";
import SalesOverview from "./components/SalesOverview";

const Dashboard = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <PageContainer title="Dashboard" description="This is Dashboard">
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          padding: isSmallScreen ? theme.spacing(2) : theme.spacing(8),
        }}
      >
        <Grid container spacing={2} maxWidth={"100%"}>
          {/* Coluna esquerda com SalesOverview, ajustada para ocupar mais espaço */}
          <Grid item xs={12} lg={8}>
            <SalesOverview />
          </Grid>

          {/* Coluna direita com StockOverview e StockUnderSafety empilhados */}
          <Grid item xs={12} lg={4} container direction="column" spacing={2}>
            <Grid item>
              <StockOverview />
            </Grid>
            <Grid item>
              <StockUnderSafety />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
