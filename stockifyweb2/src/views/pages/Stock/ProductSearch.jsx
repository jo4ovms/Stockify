import { CircularProgress, TextField, Box, Autocomplete } from "@mui/material";
import PropTypes from "prop-types";
import { useRef, useState, useEffect } from "react";
import productService from "../../../services/productService";

const ProductSearch = ({
  setSelectedProduct,
  setStock,
  inputRef,
  selectedProduct,
}) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [scrollPosition, setScrollPosition] = useState(0);
  const listboxRef = useRef(null);

  const fetchProducts = async (search = "", newPage = 0) => {
    setLoading(true);
    try {
      const newProducts = await productService.searchProducts(
        search,
        newPage,
        10
      );

      const allProducts = [...products, ...newProducts];
      const uniqueProducts = Array.from(
        new Map(allProducts.map((product) => [product.id, product])).values()
      );

      setProducts(newPage === 0 ? newProducts : uniqueProducts);
      setHasMore(newProducts.length === 10);
    } catch (error) {
      console.error("Error loading products:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (selectedProduct && !searchTerm) {
      setProducts([selectedProduct]);
    }
    fetchProducts(searchTerm, 0);
  }, [searchTerm, selectedProduct]);

  const handleScroll = (event) => {
    const { scrollTop, scrollHeight, clientHeight } = event.target;
    const bottomReached = scrollHeight - scrollTop <= clientHeight + 5;

    setScrollPosition(scrollTop);

    if (bottomReached && hasMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchProducts(searchTerm, nextPage);
    }
  };

  return (
    <Box>
      <Autocomplete
        disablePortal
        id="product-autocomplete"
        options={products}
        getOptionLabel={(option) => `${option.name} - ${option.supplierName}`}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        value={selectedProduct}
        onInputChange={(e, newInputValue) => {
          setSearchTerm(newInputValue);
          setPage(0);
          fetchProducts(newInputValue, 0);
        }}
        onChange={(e, newValue) => {
          setSelectedProduct(newValue);
          setStock((prev) => ({ ...prev, productId: newValue?.id }));
        }}
        ListboxProps={{
          ref: listboxRef,
          onScroll: handleScroll,
          style: { maxHeight: 200, overflowY: "auto" },
        }}
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            {`${option.name} - ${option.supplierName}`}
          </li>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Buscar Produto"
            fullWidth
            variant="outlined"
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
  selectedProduct: PropTypes.object,
};

export default ProductSearch;
