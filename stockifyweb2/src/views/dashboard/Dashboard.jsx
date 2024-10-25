import { Box, useMediaQuery, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid2";
import PageContainer from "../../components/container/PageContainer.jsx";
import BestSellingItems from "./components/BestSellingItems.jsx";
import RecentTransactions from "./components/RecentTransactions.jsx";
import SalesOverview from "./components/SalesOverview.jsx";
import StockOverview from "./components/StockOverview.jsx";
import StockUnderSafety from "./components/StockUnderSafety.jsx";

const Dashboard = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          padding: isSmallScreen ? theme.spacing(2) : theme.spacing(8),
        }}
      >
        <Grid container spacing={1}>
          <Grid size={{ xs: 12, md: 7 }}>
            <SalesOverview />
          </Grid>
          <Grid size={{ xs: 12, md: 5 }} container spacing={1}>
            <Grid size={{ xs: 12 }}>
              <StockOverview />
            </Grid>
            <Grid>
              <StockUnderSafety />
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <RecentTransactions />
          </Grid>
          <Grid size={{ xs: 12, md: 4 }}>
            <BestSellingItems />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
