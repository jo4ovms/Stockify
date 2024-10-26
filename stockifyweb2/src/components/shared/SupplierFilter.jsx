import React, { useState, useEffect, useCallback, useRef } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { debounce } from "lodash";
import supplierService from "../../services/supplier.service";

const SupplierFilter = ({ value, onChange }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const hasMoreSuppliers = useRef(true);
  const suppliersPage = useRef(0);
  const supplierSearch = useRef("");

  const debouncedSupplierSearch = useCallback(
    debounce((searchTerm) => {
      supplierSearch.current = searchTerm;
      suppliersPage.current = 0;
      hasMoreSuppliers.current = true;
      fetchSuppliers(0, false, searchTerm);
    }, 250),
    []
  );

  const fetchSuppliers = useCallback(
    (currentPage, append = false, searchTerm = "") => {
      if (!hasMoreSuppliers.current) return;

      setLoadingMore(true);
      supplierService
        .getAll(currentPage, 10, searchTerm)
        .then((response) => {
          const suppliersList = response.data?._embedded?.supplierDTOList || [];
          const totalSupplierPages = response.data?.page?.totalPages || 1;

          setSuppliers((prevSuppliers) =>
            append ? [...prevSuppliers, ...suppliersList] : suppliersList
          );

          suppliersPage.current = currentPage + 1;
          hasMoreSuppliers.current = currentPage + 1 < totalSupplierPages;

          setLoadingMore(false);
        })
        .catch(() => {
          setLoadingMore(false);
        });
    },
    []
  );

  useEffect(() => {
    fetchSuppliers(0);
  }, [fetchSuppliers]);

  const handleScroll = (event) => {
    const listboxNode = event.currentTarget;
    if (
      listboxNode.scrollTop + listboxNode.clientHeight >=
        listboxNode.scrollHeight - 10 &&
      !loadingMore &&
      hasMoreSuppliers.current
    ) {
      fetchSuppliers(suppliersPage.current, true, supplierSearch.current);
    }
  };

  return (
    <Autocomplete
      options={suppliers}
      getOptionLabel={(option) => option.name || ""}
      value={suppliers.find((supplier) => supplier.id === value) || null}
      onChange={(event, newValue) => onChange(newValue ? newValue.id : null)}
      onInputChange={(event, newInputValue) => {
        if (newInputValue !== supplierSearch.current) {
          debouncedSupplierSearch(newInputValue);
        }
      }}
      isOptionEqualToValue={(option, value) => option.id === value}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Fornecedor"
          variant="outlined"
          fullWidth
          slotProps={{
            input: {
              ...params.InputProps,
              endAdornment: (
                <>
                  {loadingMore && (
                    <CircularProgress color="inherit" size={20} />
                  )}
                  {params.InputProps.endAdornment}
                </>
              ),
            },
          }}
        />
      )}
      ListboxProps={{
        sx: {
          maxHeight: 300,
          overflow: "auto",

          "&::-webkit-scrollbar": {
            width: "8px",
          },
          "&::-webkit-scrollbar-track": {
            backgroundColor: "#f0f0f0",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#adb5bd",
            borderRadius: "10px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "#adb5bd",
          },
        },
        onScroll: handleScroll,
      }}
      loading={loading}
      noOptionsText="Nenhum fornecedor encontrado"
    />
  );
};

export default SupplierFilter;
