import { CssBaseline, ThemeProvider } from "@mui/material";
import { AnimatePresence } from "framer-motion";
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
        <AnimatePresence mode="wait" initial={false}>
          <div key={location.pathname}>{routing}</div>
        </AnimatePresence>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
