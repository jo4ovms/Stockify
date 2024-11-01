import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import PropTypes from "prop-types";
import { useState } from "react";
import * as Yup from "yup";

const ProductSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .matches(/^(?!\s*$).+/, "O nome não pode conter apenas espaços.")
    .max(100, "O nome deve ter no máximo 100 caracteres.")
    .required("É obrigatório informar o nome."),
  value: Yup.number()
    .typeError("O valor deve ser um número.")
    .min(0.01, "O valor deve ser maior que 0.")
    .required("É obrigatório informar o valor."),
  quantity: Yup.number()
    .typeError("A quantidade deve ser um número.")
    .min(1, "A quantidade deve ser maior que 0.")
    .required("É obrigatório informar a quantidade."),
});

const ProductForm = ({
  open,
  handleClose,
  handleSave,
  currentProduct = {},
  editMode,
  currentSupplier = {},
  setErrorMessage,
}) => {
  const [loading, setLoading] = useState(false);
  const initialValues = {
    name: currentProduct.name || "",
    value: currentProduct.value !== undefined ? currentProduct.value : "",
    quantity:
      currentProduct.quantity !== undefined ? currentProduct.quantity : "",
  };

  const handleSubmit = (values, { resetForm }) => {
    const productData = {
      id: editMode ? currentProduct.id : null,
      name: values.name?.trim() || null,
      value: values.value ? parseFloat(values.value) : null,
      quantity: values.quantity ? parseInt(values.quantity, 10) : null,
      supplierId: currentSupplier?.id || null,
      supplierName: currentSupplier?.name || "",
    };

    if (!productData.name || !productData.value || !productData.quantity) {
      setErrorMessage("Todos os campos são obrigatórios.");
      return;
    }
    setLoading(true);
    handleSave(productData);
    setLoading(false);
    resetForm();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {editMode ? "Editar Produto" : "Criar Produto"} para{" "}
        {currentSupplier?.name}
      </DialogTitle>

      <Formik
        initialValues={initialValues}
        validationSchema={ProductSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, errors, touched }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
                autoFocus
                margin="dense"
                name="name"
                label="Nome"
                type="text"
                fullWidth
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.name && Boolean(errors.name)}
                helperText={<ErrorMessage name="name" />}
              />

              <Field
                as={TextField}
                margin="dense"
                name="value"
                label="Valor"
                type="number"
                fullWidth
                value={values.value}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.value && Boolean(errors.value)}
                helperText={<ErrorMessage name="value" />}
              />

              <Field
                as={TextField}
                margin="dense"
                name="quantity"
                label="Quantidade"
                type="number"
                fullWidth
                value={values.quantity}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.quantity && Boolean(errors.quantity)}
                helperText={<ErrorMessage name="quantity" />}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>
              <Button type="submit" color="primary" disabled={loading}>
                {loading ? (
                  <CircularProgress size={24} />
                ) : editMode ? (
                  "Salvar"
                ) : (
                  "Criar"
                )}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
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
  currentSupplier: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  setErrorMessage: PropTypes.func.isRequired,
};

export default ProductForm;
