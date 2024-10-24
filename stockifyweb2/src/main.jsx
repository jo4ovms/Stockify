import { StrictMode } from "react";
import React, { Suspense } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { CircularProgress } from "@mui/material";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Suspense
      fallback={
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "300px",
          }}
        >
          <CircularProgress />
        </div>
      }
    >
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Suspense>
  </StrictMode>
);
