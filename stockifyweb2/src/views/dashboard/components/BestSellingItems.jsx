import {
  Typography,
  Fab,
  Box,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Skeleton,
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
  const {
    data: bestSellingItems = [],
    isLoading,
    isError,
  } = useQuery("bestSellingItems", fetchBestSellingItems, {
    staleTime: 60000,
    cacheTime: 300000,
  });

  const renderTableBody = useMemo(() => {
    if (bestSellingItems.length > 0) {
      return (
        <TableBody>
          {bestSellingItems.map((item, index) => (
            <TableRow key={index}>
              <TableCell>
                <Typography sx={{ fontSize: "16px", fontWeight: "500" }}>
                  {item.productName}
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="h6">{item.totalQuantitySold}</Typography>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      );
    } else {
      return (
        <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
          Nenhum Produto Vendido.
        </Typography>
      );
    }
  }, [bestSellingItems]);

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
        height: "100%",
        width: "100%",
        minWidth: "157%",
        maxWidth: "155%",
        ...sx,
      }}
    >
      <Box sx={{ overflowX: "auto", width: "100%", height: "100%" }}>
        {isLoading ? (
          <Box sx={{ mt: 2, p: 2 }}>
            {Array.from(new Array(6)).map((_, index) => (
              <Box
                key={index}
                sx={{
                  mb: 2,
                  padding: "10px",
                  width: "100%",
                  minWidth: "300px",
                }}
              >
                <Skeleton variant="text" width="60%" />
                <Skeleton variant="text" width="40%" />
              </Box>
            ))}
          </Box>
        ) : isError ? (
          <Typography variant="subtitle1" sx={{ mt: 2, textAlign: "center" }}>
            Falha ao carregar produtos mais vendidos.
          </Typography>
        ) : bestSellingItems.length > 0 ? (
          <Table
            aria-label="best selling items table"
            sx={{
              width: "100%",
              maxWidth: "600px",
              whiteSpace: "nowrap",
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
                    Quantitidade Vendida
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            {renderTableBody}
          </Table>
        ) : (
          <Typography variant="body2" sx={{ mt: 2, textAlign: "center" }}>
            Nenhum Produto Vendido.
          </Typography>
        )}
      </Box>
    </DashboardCard>
  );
};

BestSellingItems.propTypes = {
  sx: PropTypes.object,
};
export default BestSellingItems;
