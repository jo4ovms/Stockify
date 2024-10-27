import { ArrowBack, ArrowForward } from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  TextField,
  useMediaQuery,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState } from "react";

const Pagination = ({ page, totalPages, totalItems, onPageChange }) => {
  const [targetPage, setTargetPage] = useState(page + 1);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const handlePreviousPage = () => {
    const newPage = Math.max(page - 1, 0);
    onPageChange(newPage);
    window.scrollTo(0, 0);
  };

  const handleNextPage = () => {
    const newPage = Math.min(page + 1, totalPages - 1);
    onPageChange(newPage);
    window.scrollTo(0, 0);
  };

  const handleTargetPageChange = (event) => {
    const value = Number(event.target.value);
    setTargetPage(value);
  };

  const goToSpecificPage = () => {
    const newPage = Math.min(Math.max(targetPage - 1, 0), totalPages - 1);
    onPageChange(newPage);
    window.scrollTo(0, 0);
  };

  return (
    <Box mt={2}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        mb={2}
        width="100%"
      >
        <Button
          variant="contained"
          onClick={handlePreviousPage}
          disabled={page === 0}
          startIcon={isSmallScreen ? <ArrowBack /> : null}
          sx={{
            minWidth: "40px",
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!isSmallScreen && "Página Anterior"}
        </Button>

        <Typography
          variant="body2"
          textAlign="center"
          sx={{ flexGrow: 1, mx: 2 }}
        >
          Página {page + 1} de {totalPages}
          <br />
          (Total: {totalItems})
        </Typography>

        <Button
          variant="contained"
          onClick={handleNextPage}
          disabled={page >= totalPages - 1}
          endIcon={isSmallScreen ? <ArrowForward /> : null}
          sx={{
            minWidth: "40px",
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {!isSmallScreen && "Próxima Página"}
        </Button>
      </Box>

      <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
        <TextField
          type="number"
          label="Ir para página"
          variant="outlined"
          value={targetPage}
          onChange={handleTargetPageChange}
          sx={{ maxWidth: 100 }}
          fullWidth={isSmallScreen}
          slotProps={{
            htmlInput: { min: 1, max: totalPages },
          }}
        />
        <Button variant="contained" onClick={goToSpecificPage}>
          Ir
        </Button>
      </Box>
    </Box>
  );
};
Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
