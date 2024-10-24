import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import PropTypes from "prop-types";

const ProductForm = ({
  open,
  handleClose,
  handleSave,
  currentProduct = {},
  editMode,
  handleChange,
  currentSupplier = {},
}) => {
  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {editMode ? "Editar Produto" : "Criar Produto"} para{" "}
        {currentSupplier.name}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="name"
          label="Nome"
          type="text"
          fullWidth
          value={currentProduct.name}
          onChange={handleChange}
        />

        <TextField
          margin="dense"
          name="value"
          label="Valor"
          type="number"
          fullWidth
          value={currentProduct.value}
          onChange={handleChange}
        />

        <TextField
          margin="dense"
          name="quantity"
          label="Quantidade"
          type="number"
          fullWidth
          value={currentProduct.quantity}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSave} color="primary">
          {editMode ? "Salvar" : "Criar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ProductForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  currentProduct: PropTypes.shape({
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  editMode: PropTypes.bool,
  handleChange: PropTypes.func.isRequired,
  currentSupplier: PropTypes.shape({
    name: PropTypes.string,
  }),
};

export default ProductForm;
