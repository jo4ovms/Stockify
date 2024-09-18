import React, { lazy } from "react";
import { Navigate } from "react-router-dom";

const FullLayout = lazy(() => import("../layouts/full/FullLayout"));

const SupplierPage = lazy(() => import("../views/pages/SupplierPage"));
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
    ],
  },
];

export default Router;
