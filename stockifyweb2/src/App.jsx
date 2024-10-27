import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "react-query";
import { useRoutes } from "react-router-dom";
import Router from "./routes/Router.jsx";
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
