import React, { useState, useEffect } from "react";
import { Select, MenuItem, Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import DashboardCard from "../../../components/shared/DashboardCard";
import Chart from "react-apexcharts";

const SalesOverview = () => {
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [salesData, setSalesData] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    generateSalesData(month);
  }, [month]);

  const generateSalesData = (month) => {
    const daysInMonth = new Date(new Date().getFullYear(), month, 0).getDate();
    const salesPerDay = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      sales: Math.floor(Math.random() * 100),
    }));
    setSalesData(salesPerDay);
  };

  const handleChange = (event) => {
    setMonth(event.target.value);
  };

  const optionscolumnchart = {
    chart: {
      type: "bar",
      fontFamily: "'Plus Jakarta Sans', sans-serif;",
      foreColor: "#adb0bb",
      toolbar: {
        show: false,
      },
      height: 370,
    },
    colors: [theme.palette.primary.main, theme.palette.secondary.main],
    plotOptions: {
      bar: {
        horizontal: false,
        barHeight: "60%",
        columnWidth: "42%",
        borderRadius: [6],
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "all",
        dataLabels: {
          position: "top",
        },
      },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    dataLabels: {
      enabled: true,
      formatter: (val) => val,
      offsetY: -20,
      style: {
        fontSize: "12px",
        colors: ["#304758"],
      },
    },
    legend: {
      show: false,
    },
    grid: {
      borderColor: "rgba(0,0,0,0.1)",
      strokeDashArray: 3,
      xaxis: {
        lines: {
          show: false,
        },
      },
    },
    yaxis: {
      tickAmount: 4,
      labels: {
        formatter: (val) => val.toFixed(0),
      },
    },
    xaxis: {
      categories: salesData.map((data) => data.day),
      axisBorder: {
        show: false,
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary,
        },
      },
    },
    tooltip: {
      theme: theme.palette.mode === "dark" ? "dark" : "light",
      fillSeriesColor: false,
      x: {
        formatter: (val) => `Dia ${val}`,
      },
      y: {
        formatter: (val) => `${val} vendas`,
      },
    },
  };

  const seriescolumnchart = [
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
          <MenuItem value={3}>Março</MenuItem>
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
        <Chart
          options={optionscolumnchart}
          series={seriescolumnchart}
          type="bar"
          height="100%"
          width="100%"
        />
      </Box>
    </DashboardCard>
  );
};

export default SalesOverview;
