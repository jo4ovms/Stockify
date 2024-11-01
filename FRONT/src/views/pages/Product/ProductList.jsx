import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Button, Typography, IconButton } from "@mui/material";
import PropTypes from "prop-types";

const ProductList = ({
  products,
  productsPage,
  productsTotalPages,
  onPreviousPage,
  onNextPage,
  isSmallScreen,
  onEditProduct,
  onDeleteProduct,
}) => {
  return (
    <Box>
      {products.map((product) => (
        <Box
          key={product.id}
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          p={2}
          borderBottom="1px solid #ccc"
          mb={1}
        >
          <Box>
            <Typography variant="h6">{product?.name || "Sem nome"}</Typography>
            <Typography variant="body2">Preço: R$ {product.value}</Typography>
            <Typography variant="body2">
              Quantidade: {product.quantity}
            </Typography>
          </Box>
          <Box display="flex" gap={1} minWidth="60px" justifyContent="flex-end">
            <IconButton color="primary" onClick={() => onEditProduct(product)}>
              <EditIcon />
            </IconButton>
            <IconButton
              color="secondary"
              onClick={() => onDeleteProduct(product.id, product.name)}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      ))}

      <Box
        display="flex"
        flexDirection={isSmallScreen ? "column" : "row"}
        justifyContent="space-between"
        alignItems="center"
        mt={3}
      >
        <Button
          variant="contained"
          color="primary"
          fullWidth={isSmallScreen}
          sx={{ mt: isSmallScreen ? 1 : 0 }}
          onClick={onPreviousPage}
          disabled={productsPage <= 0}
        >
          Página Anterior
        </Button>

        <Typography>
          Página {productsPage + 1} de {productsTotalPages}
        </Typography>

        <Button
          variant="contained"
          color="primary"
          fullWidth={isSmallScreen}
          sx={{ mt: isSmallScreen ? 1 : 0 }}
          onClick={onNextPage}
          disabled={productsPage >= productsTotalPages - 1}
        >
          Próxima Página
        </Button>
      </Box>
    </Box>
  );
};

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
  productsPage: PropTypes.number.isRequired,
  productsTotalPages: PropTypes.number.isRequired,
  onPreviousPage: PropTypes.func.isRequired,
  onNextPage: PropTypes.func.isRequired,
  isSmallScreen: PropTypes.bool,
  onEditProduct: PropTypes.func.isRequired,
  onDeleteProduct: PropTypes.func.isRequired,
};

export default ProductList;
