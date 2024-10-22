import React from "react";
import Grid from "@mui/material/Grid2";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";
import StockOverview from "./components/StockOverview";
import StockUnderSafety from "./components/StockUnderSafety";
import SalesOverview from "./components/SalesOverview";
import RecentTransactions from "./components/RecentTransactions";
import BestSellingItems from "./components/BestSellingItems";

const Dashboard = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box
        sx={{
          display: "flex",
          justifyContent: "left",
          alignItems: "center",
          minHeight: "100vh",
          padding: isSmallScreen ? theme.spacing(0) : theme.spacing(8),
        }}
      >
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, sm: 6, lg: 7 }}>
            <SalesOverview />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, lg: 5 }}>
            <Grid container spacing={1}>
              <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
                <StockOverview />
              </Grid>
              <Grid size={{ xs: 12, sm: 6, lg: 6 }}>
                <StockUnderSafety />
              </Grid>
            </Grid>
          </Grid>

          <Grid container spacing={1}>
            <Grid size={{ xs: 12, sm: 8, lg: 7 }}>
              <RecentTransactions />
            </Grid>
            <Grid size={{ xs: 12, sm: 4, lg: 4 }}>
              <BestSellingItems />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
