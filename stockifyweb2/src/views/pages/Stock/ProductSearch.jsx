import { CircularProgress, TextField, Box, Autocomplete } from "@mui/material";
import PropTypes from "prop-types";
import { useRef, useState, useCallback, forwardRef } from "react";
import productService from "../../../services/productService";

const ProductSearch = ({ setSelectedProduct, setStock, inputRef }) => {
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

  const ListboxComponent = forwardRef((props, ref) => (
    <div
      ref={ref}
      {...props}
      onScroll={handleScroll}
      style={{ maxHeight: 200, overflowY: "auto" }}
    />
  ));

  const handleScroll = (event) => {
    const listboxNode = event.currentTarget;
    const bottomReached =
      listboxNode.scrollHeight - listboxNode.scrollTop ===
      listboxNode.clientHeight;
    if (bottomReached && !loading && hasMoreProducts) {
      loadProducts(inputValue);
    }
  };

  return (
    <Box>
      <Autocomplete
        id="product-autocomplete"
        options={products}
        value={products.find((product) => product.name === inputValue) || null}
        getOptionLabel={(option) => `${option.name} - ${option.supplierName}`}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
          if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
          debounceTimeout.current = setTimeout(() => {
            setHasMoreProducts(true);
            loadProducts(newInputValue, true);
          }, 300);
        }}
        onFocus={() => {
          if (products.length === 0) {
            loadProducts();
          }
        }}
        onChange={(event, newValue) => {
          if (newValue) {
            setSelectedProduct(newValue);
            setStock((prev) => ({
              ...prev,
              productId: newValue.id,
            }));
            setInputValue(newValue.name);
          }
        }}
        ListboxComponent={ListboxComponent}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Buscar Produto"
            fullWidth
            variant="outlined"
            margin="normal"
            autoComplete="off"
            inputRef={inputRef}
            slotProps={{
              input: {
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? <CircularProgress size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              },
            }}
          />
        )}
      />
    </Box>
  );
};

ProductSearch.propTypes = {
  setSelectedProduct: PropTypes.func.isRequired,
  setStock: PropTypes.func.isRequired,
};

export default ProductSearch;
