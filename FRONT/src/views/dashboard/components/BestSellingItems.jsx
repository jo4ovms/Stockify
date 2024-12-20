import {
  Typography,
  Fab,
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Card,
  Skeleton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { IconArrowRight } from "@tabler/icons-react";
import PropTypes from "prop-types";
import { useCallback, useMemo } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
import DashboardCard from "../../../components/shared/DashboardCard.jsx";
import saleService from "../../../services/saleService";

const fetchBestSellingItems = async () => {
  const response = await saleService.getBestSellingItems();
  return response.slice(0, 8);
};

const BestSellingItems = ({ sx }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    data: bestSellingItems = [],
    isLoading,
    isError,
  } = useQuery("bestSellingItems", fetchBestSellingItems, {
    staleTime: 0,
    cacheTime: 0,
  });

  const renderContent = useMemo(() => {
    if (isLoading) {
      return (
        <Box sx={{ mt: -5, p: 2 }}>
          {Array.from(new Array(8)).map((_, index) => (
            <Box
              key={index}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              sx={{
                flexDirection: "row",
                gap: 1,
                mb: -5,
                height: "105.5px",
                width: "100%",
              }}
            >
              <Skeleton variant="text" width="45%" />

              <Skeleton variant="text" width="10%" />
            </Box>
          ))}
        </Box>
      );
    }

    if (isError || bestSellingItems.length === 0) {
      return (
        <Box sx={{ height: "255.5px" }}>
          <Typography
            variant="body2"
            sx={{ mt: 4.6, textAlign: "center", fontWeight: "bold" }}
          >
            {isError
              ? "Falha ao carregar produtos mais vendidos."
              : "Nenhum produto vendido até o momento."}
          </Typography>
        </Box>
      );
    }

    if (isSmallScreen) {
      return (
        <Box sx={{ mt: 2, p: 1 }}>
          {bestSellingItems.map((item, index) => (
            <Card
              key={index}
              variant="outlined"
              sx={{
                mb: 1,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderRadius: "8px",
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 500,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  maxWidth: "90%",
                }}
              >
                {item.productName}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {item.totalQuantitySold}
              </Typography>
            </Card>
          ))}
        </Box>
      );
    }

    return (
      <Table
        aria-label="best selling items table"
        sx={{
          width: "100%",
          mt: 0,
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography variant="subtitle2" fontWeight={600}>
                Produto
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography variant="subtitle2" fontWeight={600}>
                Quantidade Vendida
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {bestSellingItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Typography
                  sx={{
                    fontSize: "16px",
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.productName}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h6">{item.totalQuantitySold}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  }, [bestSellingItems, isLoading, isError, isSmallScreen]);

  const handleViewAllClick = useCallback(() => {
    navigate("/sold-items");
    window.scrollTo(0, 0);
  }, [navigate]);

  return (
    <DashboardCard
      title="Produtos Mais Vendidos"
      action={
        <Fab
          color="secondary"
          size="medium"
          sx={{ color: "#ffffff" }}
          onClick={handleViewAllClick}
        >
          <IconArrowRight width={24} />
        </Fab>
      }
      sx={{
        minHeight: isSmallScreen ? "255.5px" : undefined,
        height: isSmallScreen ? "auto" : "660px",
        width: isSmallScreen ? "100%" : "124%",
        overflow: "hidden",
        ...sx,
      }}
    >
      <Box sx={{ px: isSmallScreen ? 0 : 0 }}>{renderContent}</Box>
    </DashboardCard>
  );
};

BestSellingItems.propTypes = {
  sx: PropTypes.object,
};

export default BestSellingItems;
