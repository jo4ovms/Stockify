import { styled, Container, Box, useMediaQuery, useTheme } from "@mui/material";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Footer from "./footer/Footer.jsx";
import Header from "./header/Header.jsx";
import Sidebar from "./sidebar/Sidebar.jsx";

const MainWrapper = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
  },
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

const ContentWrapper = styled("div")(() => ({
  flexGrow: 1,
}));

const FullLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const theme = useTheme();
  const isMediumUp = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <MainWrapper>
      {isMediumUp && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />
      )}
      <PageWrapper>
        <Header
          toggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
          toggleMobileSidebar={() => setMobileSidebarOpen(true)}
        />
        <ContentWrapper>
          <Container
            sx={{
              paddingTop: "20px",
              maxWidth: "1200px",
            }}
          >
            <Box sx={{ minHeight: "calc(100vh - 170px)" }}>
              <Outlet />
            </Box>
          </Container>
        </ContentWrapper>
        <Footer />
      </PageWrapper>
      {!isMediumUp && (
        <Sidebar
          isSidebarOpen={isSidebarOpen}
          isMobileSidebarOpen={isMobileSidebarOpen}
          onSidebarClose={() => setMobileSidebarOpen(false)}
        />
      )}
    </MainWrapper>
  );
};

export default FullLayout;
