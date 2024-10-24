import { lazy } from "react";
import { Navigate } from "react-router-dom";
import PrivateRoute from "../components/PrivateRoute.jsx";
import LogReportPage from "../views/pages/Log/LogReportPage.jsx";
import SalePage from "../views/pages/Sale/SalePage.jsx";
import SoldItemsPage from "../views/pages/Sale/SoldItemsPage.jsx";
import CriticalStockPage from "../views/pages/StockOverview/CriticalStockPage.jsx";
import OutOfStockPage from "../views/pages/StockOverview/OutOfStockPage.jsx";
import StockSafetyPage from "../views/pages/StockOverview/StockSafetyPage.jsx";
import StockUnderSafetyPage from "../views/pages/StockOverview/StockUnderSafetyPage.jsx";

const FullLayout = lazy(() => import("../layouts/full/FullLayout.jsx"));
const BlankLayout = lazy(() => import("../layouts/Blank/BlankLayout.jsx"));

const SupplierPage = lazy(
  () => import("../views/pages/Supplier/SupplierPage.jsx")
);
const StockPage = lazy(() => import("../views/pages/Stock/StockPage.jsx"));
const AboutUs = lazy(() => import("../views/pages/AboutUs/AboutUs.jsx"));
const Dashboard = lazy(() => import("../views/dashboard/Dashboard.jsx"));
const Login = lazy(() => import("../views/pages/Auth/Login.jsx"));
const Register = lazy(() => import("../views/pages/Auth/Register.jsx"));

const Router = [
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
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
          {
            path: "/about-us",
            element: <AboutUs />,
          },
          {
            path: "/stock/under-safety",
            element: <StockUnderSafetyPage />,
          },
          {
            path: "/stock/safety",
            element: <StockSafetyPage />,
          },
          {
            path: "/stock/out-of-stock",
            element: <OutOfStockPage />,
          },
          {
            path: "/stock/:id/edit",
            element: <StockPage />,
          },
          {
            path: "report-logs/:logId",
            element: <LogReportPage />,
          },
          {
            path: "/stock/critical-stock",
            element: <CriticalStockPage />,
          },
          {
            path: "/report-logs",
            element: <LogReportPage />,
          },
          {
            path: "/register-sale",
            element: <SalePage />,
          },
          {
            path: "/sold-items",
            element: <SoldItemsPage />,
          },
        ],
      },
    ],
  },
  {
    path: "/auth",
    element: <BlankLayout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
];

export default Router;
