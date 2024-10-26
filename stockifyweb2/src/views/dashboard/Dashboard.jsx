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
  const isMediumScreen = useMediaQuery(theme.breakpoints.between("sm", "md"));

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          padding: isSmallScreen ? theme.spacing(1) : theme.spacing(4),
        }}
      >
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 7 }}>
            <SalesOverview />
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12 }}>
                <StockOverview />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <StockUnderSafety />
              </Grid>
            </Grid>
          </Grid>

          <Grid size={{ xs: 12, md: 7 }}>
            <RecentTransactions />
          </Grid>

          <Grid size={{ xs: 12, md: 5 }}>
            <BestSellingItems />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
