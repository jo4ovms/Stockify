import React, { useState, useEffect } from "react";
import { Select, MenuItem, Box, Skeleton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "../../../components/shared/DashboardCard";
import Chart from "react-apexcharts";
import saleService from "../../../services/saleService";

const SalesOverview = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

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

  const optionsLineChart = {
    chart: {
      type: "line",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 370,
    },

    plotOptions: {
      bar: {
        columnWidth: "50%",
        barHeight: "70%",
      },
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
        style: {
          fontSize: "11.9px",
          colors: theme.palette.text.secondary,
        },
        rotate: -45,
      },
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
      },
    },
  };

  const seriesLineChart = [
    {
      name: "Vendas",
      data: salesData.map((data) => data.sales),
    },
  ];

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
          <MenuItem value={1}>Janeiro</MenuItem>
          <MenuItem value={2}>Fevereiro</MenuItem>
          <MenuItem value={3}>Março</MenuItem>
          <MenuItem value={4}>Abril</MenuItem>
          <MenuItem value={5}>Maio</MenuItem>
          <MenuItem value={6}>Junho</MenuItem>
          <MenuItem value={7}>Julho</MenuItem>
          <MenuItem value={8}>Agosto</MenuItem>
          <MenuItem value={9}>Setembro</MenuItem>
          <MenuItem value={10}>Outubro</MenuItem>
          <MenuItem value={11}>Novembro</MenuItem>
          <MenuItem value={12}>Dezembro</MenuItem>
        </Select>
      }
      sx={{ height: "100%", width: "100%" }}
    >
      <Box sx={{ height: 400, width: "100%" }}>
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height="100%" />
        ) : (
          <Chart
            options={optionsLineChart}
            series={seriesLineChart}
            type="line"
            height="100%"
            width="100%"
          />
        )}
      </Box>
    </DashboardCard>
  );
};

export default SalesOverview;
