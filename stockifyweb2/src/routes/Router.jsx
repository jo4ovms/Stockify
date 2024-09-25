import React, { lazy } from "react";
import { Navigate } from "react-router-dom";

const FullLayout = lazy(() => import("../layouts/full/FullLayout"));

const SupplierPage = lazy(() => import("../views/pages/Supplier/SupplierPage"));
const StockPage = lazy(() => import("../views/pages/Stock/StockPage"));
const Dashboard = lazy(() => import("../views/dashboard/Dashboard"));

const Router = [
  {
    path: "/",
    element: <FullLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/dashboard" />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/supplier",
        element: <SupplierPage />,
      },
      {
        path: "/stock",
        element: <StockPage />,
      },
    ],
  },
];

export default Router;
