import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import PropTypes from "prop-types";
import InputMask from "react-input-mask";
import * as Yup from "yup";

const SupplierSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .max(100, "O nome deve ter no máximo 100 caracteres.")
    .required("É obrigatório informar o nome."),
  email: Yup.string()
    .trim()
    .email("O email deve ser válido.")
    .max(100, "O email deve ter no máximo 100 caracteres.")
    .required("É obrigatório informar o email."),
  cnpj: Yup.string()
    .required("É obrigatório informar o CNPJ.")
    .matches(/^\d{14}$/, "CNPJ deve ter 14 dígitos."),
  phone: Yup.string().required("É obrigatório informar o telefone."),
  productType: Yup.string().required(
    "É obrigatório informar o tipo de produto."
  ),
});

const SupplierForm = ({
  open,
  handleClose,
  handleSave,
  supplier = {},
  editMode,
}) => {
  const initialValues = {
    name: supplier.name || "",
    email: supplier.email || "",
    cnpj: supplier.cnpj || "",
    phone: supplier.phone || "",
    productType: supplier.productType || "",
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>
        {editMode ? "Editar Fornecedor" : "Criar Fornecedor"}
      </DialogTitle>
      <Formik
        initialValues={initialValues}
        validationSchema={SupplierSchema}
        onSubmit={(values, { resetForm }) => {
          const cleanedValues = {
            ...values,
            cnpj: values.cnpj.replace(/\D/g, ""),
            phone: values.phone.replace(/\D/g, ""),
          };

          handleSave(cleanedValues);
          resetForm();
          handleClose();
        }}
        enableReinitialize
      >
        {({ values, handleChange, handleBlur, errors, touched }) => (
          <Form>
            <DialogContent>
              <Field
                as={TextField}
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
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={<ErrorMessage name="email" />}
              />

              <Field
                as={TextField}
                margin="dense"
                name="cnpj"
                label="CNPJ"
                type="text"
                fullWidth
                value={values.cnpj}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.cnpj && Boolean(errors.cnpj)}
                helperText={<ErrorMessage name="cnpj" />}
                disabled={editMode}
              />

              <InputMask
                mask="(99) 99999-9999"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              >
                {() => (
                  <Field
                    as={TextField}
                    margin="dense"
                    name="phone"
                    label="Número de Telefone"
                    type="text"
                    fullWidth
                    error={touched.phone && Boolean(errors.phone)}
                    helperText={<ErrorMessage name="phone" />}
                  />
                )}
              </InputMask>

              <Field
                as={TextField}
                margin="dense"
                name="productType"
                label="Tipo de Produto"
                type="text"
                fullWidth
                value={values.productType}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.productType && Boolean(errors.productType)}
                helperText={<ErrorMessage name="productType" />}
              />
            </DialogContent>

            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>
              <Button type="submit" color="primary">
                {editMode ? "Salvar" : "Criar"}
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

SupplierForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleSave: PropTypes.func.isRequired,
  supplier: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    cnpj: PropTypes.string,
    phone: PropTypes.string,
    productType: PropTypes.string,
  }),
  editMode: PropTypes.bool,
};

export default SupplierForm;
