import React, { useState, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  CssBaseline,
  ThemeProvider,
  Snackbar,
  Box,
  Typography,
} from "@mui/material";
import Router from "./routes/Router";
import { useRoutes } from "react-router-dom";
import { baselightTheme } from "./theme/DefaultColors";

const queryClient = new QueryClient();

function App() {
  const routing = useRoutes(Router);
  const theme = baselightTheme;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {routing}
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
