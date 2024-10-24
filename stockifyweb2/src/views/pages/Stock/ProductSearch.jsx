import { useAutocomplete } from "@mui/base";
import { CircularProgress, TextField, Box } from "@mui/material";
import PropTypes from "prop-types";
import { useRef, useState, useCallback } from "react";
import productService from "../../../services/productService";

const ProductSearch = ({ setSelectedProduct, setStock }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [hasMoreProducts, setHasMoreProducts] = useState(true);
  const debounceTimeout = useRef(null);
  const [page, setPage] = useState(0);

  const uniqueProducts = (existingProducts, newProducts) => {
    const combinedProducts = [...existingProducts, ...newProducts];
    return Array.from(
      new Map(combinedProducts.map((product) => [product.id, product])).values()
    );
  };

  const loadProducts = useCallback(
    async (searchTerm = "", reset = false) => {
      if (!hasMoreProducts && !reset) return;
      setLoading(true);
      try {
        const newPage = reset ? 0 : page;
        const newProducts = await productService.searchProducts(
          searchTerm,
          newPage,
          10
        );
        if (newProducts.length === 0) {
          setHasMoreProducts(false);
        } else {
          setProducts((prevProducts) =>
            reset ? newProducts : uniqueProducts(prevProducts, newProducts)
          );
          setPage((prevPage) => (reset ? 1 : prevPage + 1));
        }
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    },
    [page, hasMoreProducts]
  );

  const {
    getRootProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    popupOpen,
  } = useAutocomplete({
    id: "product-autocomplete",
    options: products,
    getOptionLabel: (option) => `${option.name} - ${option.supplierName}`,
    onInputChange: (event, newInputValue) => {
      setInputValue(newInputValue);
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
      debounceTimeout.current = setTimeout(() => {
        setHasMoreProducts(true);
        loadProducts(newInputValue, true);
      }, 300);
    },
    onChange: (event, newValue) => {
      if (newValue) {
        setSelectedProduct(newValue);
        setStock((prev) => ({
          ...prev,
          productId: newValue.id,
        }));
        setInputValue(newValue.name);
      }
    },
  });

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    if (scrollTop + clientHeight >= scrollHeight - 10 && !loading) {
      loadProducts(inputValue);
    }
  };

  return (
    <Box {...getRootProps()}>
      <TextField
        label="Buscar Produto"
        fullWidth
        variant="outlined"
        margin="normal"
        autoComplete="off"
        value={inputValue}
        slotProps={{
          input: {
            ...getInputProps(),
          },
          endAdornment: loading ? (
            <CircularProgress size={20} aria-label="Carregando" />
          ) : null,
        }}
      />
      {popupOpen && groupedOptions.length > 0 ? (
        <ul
          {...getListboxProps()}
          onScroll={handleScroll}
          style={{
            maxHeight: 200,
            overflowY: "auto",
            border: "1px solid #ccc",
            borderRadius: "4px",
            marginTop: "10px",
            padding: "5px",
            listStyle: "none",
          }}
        >
          {groupedOptions.map((option, index) => (
            <li
              key={option.id}
              {...getOptionProps({ option, index })}
              style={{
                padding: "10px",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
                backgroundColor:
                  option.id === setSelectedProduct?.id
                    ? "#f0f0f0"
                    : "transparent",
              }}
            >
              {`${option.name} - ${option.supplierName}`}
            </li>
          ))}
        </ul>
      ) : null}
    </Box>
  );
};

ProductSearch.propTypes = {
  setSelectedProduct: PropTypes.func.isRequired,
  setStock: PropTypes.func.isRequired,
};

export default ProductSearch;
