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
    .test("cnpj", "CNPJ deve ter 14 dígitos.", (value) => {
      const cleanedValue = value ? value.replace(/\D/g, "") : "";
      return cleanedValue.length === 14;
    })
    .required("É obrigatório informar o CNPJ."),
  phone: Yup.string()
    .matches(
      /^\(\d{2}\) \d{5}-\d{4}$/,
      "Telefone inválido. Use o formato (99) 99999-9999."
    )
    .required("É obrigatório informar o telefone."),
  productType: Yup.string().required(
    "É obrigatório informar o tipo de produto."
  ),
});
const formatPhoneNumber = (value) => {
  if (!value) return value;
  const cleaned = value.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{5})(\d{4})$/);
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  return value;
};

const formatCNPJ = (value) => {
  if (!value) return value;
  const cleaned = value.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/);
  if (match) {
    return `${match[1]}.${match[2]}.${match[3]}/${match[4]}-${match[5]}`;
  }
  return value;
};
const SupplierForm = ({
  open,
  handleClose,
  handleSave,
  supplier = {},
  editMode,
}) => {
  const [loading, setLoading] = useState(false);

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
          setLoading(true);
          const cleanedValues = {
            ...values,
            cnpj: values.cnpj.replace(/\D/g, ""),
            phone: values.phone.replace(/\D/g, ""),
          };

          handleSave(cleanedValues);
          setLoading(false);
          resetForm();
          handleClose();
        }}
        enableReinitialize
      >
        {({
          values,
          handleChange,
          handleBlur,
          errors,
          touched,
          setFieldValue,
        }) => (
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

              <TextField
                name="cnpj"
                label="CNPJ"
                fullWidth
                margin="dense"
                value={values.cnpj}
                onChange={(e) => {
                  const formattedCNPJ = formatCNPJ(e.target.value);
                  setFieldValue("cnpj", formattedCNPJ);
                }}
                onBlur={handleBlur}
                error={touched.cnpj && Boolean(errors.cnpj)}
                helperText={<ErrorMessage name="cnpj" />}
                disabled={editMode}
                slotProps={{
                  htmlInput: {
                    maxLength: 18,
                  },
                }}
              />
              <TextField
                name="phone"
                label="Telefone"
                fullWidth
                margin="dense"
                value={formatPhoneNumber(values.phone)}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  setFieldValue("phone", formatted);
                }}
                onBlur={handleBlur}
                error={touched.phone && Boolean(errors.phone)}
                helperText={<ErrorMessage name="phone" />}
                slotProps={{
                  htmlInput: {
                    maxLength: 15,
                  },
                }}
              />

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
