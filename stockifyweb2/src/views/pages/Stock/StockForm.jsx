import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  DialogActions,
  Box,
} from "@mui/material";
import PropTypes from "prop-types";
import { useState, useEffect, useRef } from "react";
import stockService from "../../../services/stockService";
import ProductSearch from "./ProductSearch.jsx";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const StockSchema = Yup.object().shape({
  productId: Yup.string().required("É obrigatório selecionar um produto."),
  quantity: Yup.number()
    .min(1, "Quantidade deve ser maior que 0.")
    .required("É obrigatório informar a quantidade."),
  value: Yup.number()
    .min(0.01, "Valor deve ser maior que 0.")
    .required("É obrigatório informar o valor."),
});

const StockForm = ({
  open,
  handleClose,
  editMode,
  currentStock,
  retrieveStocks,
  setSuccessMessage,
  fetchLimits,
}) => {
  const [stock, setStock] = useState({
    productId: "",
    quantity: "",
    value: "",
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [originalProductName, setOriginalProductName] = useState("");
  const inputRef = useRef(null);

  const loadStockById = async (stockId) => {
    try {
      const stock = await stockService.getStockById(stockId);
      const productInfo = {
        id: stock.productId,
        name: stock.productName,
        supplierName: stock.supplierName,
      };
      setSelectedProduct(productInfo);
      setOriginalProductName(stock.productName);
      return stock;
    } catch (error) {
      console.error("Erro ao carregar o estoque:", error);
      return null;
    }
  };

  const resetForm = () => {
    setSelectedProduct(null);
    setOriginalProductName("");
  };

  useEffect(() => {
    if (open) {
      if (editMode && currentStock?.id) {
        loadStockById(currentStock.id);
      } else {
        resetForm();
      }
    }
  }, [open, editMode, currentStock]);

  useEffect(() => {
    if (selectedProduct) {
      setStock((prev) => ({
        ...prev,
        productId: selectedProduct.id,
      }));
    }
  }, [selectedProduct]);

  const handleSubmit = (values) => {
    const action = editMode
      ? stockService.updateStock(currentStock.id, values)
      : stockService.createStock(values);

    action
      .then(() => {
        retrieveStocks();
        fetchLimits();
        setSuccessMessage(
          `Estoque de ${selectedProduct?.name || originalProductName} ${
            editMode ? "atualizado" : "criado"
          } com sucesso.`
        );
        handleClose();
      })
      .catch((error) => {
        console.error("Erro ao salvar o estoque:", error);
      });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editMode
          ? `Editando ${selectedProduct?.name || originalProductName}`
          : "Adicionar ao Estoque"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 3 }}>
          <Formik
            enableReinitialize
            initialValues={{
              productId: selectedProduct?.id || "",
              quantity: currentStock?.quantity || "",
              value: currentStock?.value || "",
            }}
            validationSchema={StockSchema}
            onSubmit={handleSubmit}
          >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              setFieldValue,
            }) => (
              <Form>
                <ProductSearch
                  setSelectedProduct={(product) => {
                    setSelectedProduct(product);
                    setFieldValue("productId", product?.id || "");
                  }}
                  setStock={(stock) => {
                    setFieldValue("quantity", stock.quantity);
                    setFieldValue("value", stock.value);
                  }}
                  selectedProduct={selectedProduct}
                  inputRef={inputRef}
                />

                <Field
                  as={TextField}
                  margin="normal"
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

                <Field
                  as={TextField}
                  margin="normal"
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

                <DialogActions>
                  <Button onClick={handleClose} color="primary">
                    Cancelar
                  </Button>
                  <Button type="submit" color="primary">
                    {editMode ? "Salvar" : "Adicionar"}
                  </Button>
                </DialogActions>
              </Form>
            )}
          </Formik>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

StockForm.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  editMode: PropTypes.bool,
  currentStock: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    quantity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  retrieveStocks: PropTypes.func.isRequired,
  setSuccessMessage: PropTypes.func.isRequired,
  fetchLimits: PropTypes.func.isRequired,
};

export default StockForm;
