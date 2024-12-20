import { Select, MenuItem, Box, Skeleton, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useState, useEffect, useMemo } from "react";
import Chart from "react-apexcharts";
import DashboardCard from "../../../components/shared/DashboardCard.jsx";
import saleService from "../../../services/saleService";

const SalesOverview = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    fetchSalesData(month);
  }, [month]);

  const fetchSalesData = async (month) => {
    setLoading(true);
    try {
      const daysInMonth = new Date(
        new Date().getFullYear(),
        month,
        0
      ).getDate();

      const response = await saleService.getSalesGroupedByDay(month);

      const salesPerDay = Array.from({ length: daysInMonth }, (_, index) => ({
        day: index + 1,
        sales: 0,
      }));

      response.forEach((item) => {
        const dayIndex = salesPerDay.findIndex(
          (dayData) => dayData.day === item.day
        );
        if (dayIndex !== -1) {
          salesPerDay[dayIndex].sales = item.totalSales;
        }
      });

      setSalesData(salesPerDay);
    } catch (error) {
      console.error("Erro ao buscar dados de vendas agrupados por dia", error);
      setSalesData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  const options = useMemo(
    () => ({
      chart: {
        type: isSmallScreen ? "bar" : "line",
        fontFamily: "'Plus Jakarta Sans', sans-serif;",
        foreColor: "#adb0bb",
        toolbar: {
          show: false,
        },
        height: isSmallScreen ? 350 : 400,
      },
      plotOptions: {
        bar: {
          horizontal: isSmallScreen,
          columnWidth: "50%",
          barHeight: "60%",
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: "14px",
          fontWeight: "bold",
          colors: ["#333"],
          background: {
            enabled: true,
            color: "#fff",
            opacity: 0.8,
            borderRadius: 2,
            padding: 2,
          },
        },
        formatter: (val) => (val > 0 ? val : ""),
        offsetY: isSmallScreen ? -1 : -5,
        offsetX: isSmallScreen ? 12 : 0,
        position: isSmallScreen ? "right" : "top",
      },
      colors: [theme.palette.primary.main, theme.palette.secondary.main],
      stroke: {
        curve: "smooth",
        width: 3,
      },
      markers: {
        size: 5,
      },
      grid: {
        borderColor: "rgba(0,0,0,0.1)",
        strokeDashArray: 3,
      },
      xaxis: {
        categories: salesData.map((data) => data.day),
        labels: {
          show: !isSmallScreen || salesData.length < 10,
          rotate: -45,
          style: {
            fontSize: isSmallScreen ? "10px" : "12px",
            colors: theme.palette.text.secondary,
          },
        },
        tickAmount: isSmallScreen ? 7 : undefined,
      },
      yaxis: {
        tickAmount: 5,
        min: 0,
        max: Math.max(...salesData.map((data) => data.sales)) + 1,
        labels: {
          formatter: (val) => val.toFixed(0),
        },
      },
      tooltip: {
        theme: theme.palette.mode === "dark" ? "dark" : "light",
        x: {
          formatter: (val) => `Dia ${val}`,
        },
        y: {
          formatter: (val) => `${val} vendas`,
          style: {
            fontSize: "14px",
          },
        },
      },
    }),
    [salesData, theme, isSmallScreen]
  );

  const series = useMemo(
    () => [
      {
        name: "Vendas",
        data: salesData.map((data) => data.sales),
      },
    ],
    [salesData]
  );

  return (
    <DashboardCard
      title="Visão Geral de Vendas"
      action={
        <Select
          labelId="month-dd"
          id="month-dd"
          value={month}
          size="small"
          onChange={handleChange}
          sx={{ minWidth: 120 }}
        >
          {Array.from({ length: 12 }, (_, index) => (
            <MenuItem key={index} value={index + 1}>
              {new Date(0, index).toLocaleString("default", { month: "long" })}
            </MenuItem>
          ))}
        </Select>
      }
      sx={{ height: isSmallScreen ? "100%" : "100%", width: "100%" }}
    >
      <Box sx={{ height: 460, width: "100%" }}>
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height="100%" />
        ) : (
          <Chart
            options={options}
            series={series}
            type={isSmallScreen ? "bar" : "line"}
            height="100%"
            width="100%"
          />
        )}
      </Box>
    </DashboardCard>
  );
};

export default SalesOverview;
