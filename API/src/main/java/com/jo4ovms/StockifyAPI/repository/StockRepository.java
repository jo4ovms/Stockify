package com.jo4ovms.StockifyAPI.repository;


import com.jo4ovms.StockifyAPI.model.Stock;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;


@Repository
public interface StockRepository extends JpaRepository<Stock, Long>, JpaSpecificationExecutor<Stock> {

    Page<Stock> findByProductSupplierId(Long supplierId, Pageable pageable);
    @Query("SELECT s FROM Stock s WHERE LOWER(s.product.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
            "OR LOWER(s.product.supplier.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    Page<Stock> searchByProductNameOrSupplier(@Param("query") String query, Pageable pageable);
    @Query("SELECT MAX(s.quantity) FROM Stock s")
    Object findMaxQuantity();
    @Query("SELECT MAX(s.value) FROM Stock s")
    Object findMaxValue();

    @Query("SELECT s FROM Stock s WHERE " +
            "(:query IS NULL OR LOWER(s.product.name) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
            "(:supplierId IS NULL OR s.product.supplier.id = :supplierId) AND " +
            "s.quantity <= :threshold")
    Page<Stock> searchCriticalStockByFilters(
            @Param("query") String query,
            @Param("supplierId") Long supplierId,
            @Param("threshold") int threshold,
            Pageable pageable);

    @Query("SELECT s FROM Stock s WHERE " +
            "(:query IS NULL OR LOWER(s.product.name) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
            "(:supplierId IS NULL OR s.product.supplier.id = :supplierId) AND " +
            "s.quantity >= :threshold")
    Page<Stock> searchAdequateStockByFilters(
            @Param("query") String query,
            @Param("supplierId") Long supplierId,
            @Param("threshold") int threshold,
            Pageable pageable);

    @Query("SELECT s FROM Stock s WHERE " +
            "(:query IS NULL OR LOWER(s.product.name) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
            "(:supplierId IS NULL OR s.product.supplier.id = :supplierId) AND " +
            "s.quantity BETWEEN :minQuantity AND :maxQuantity")
    Page<Stock> searchLowStockByFilters(
            @Param("query") String query,
            @Param("supplierId") Long supplierId,
            @Param("minQuantity") int minQuantity,
            @Param("maxQuantity") int maxQuantity,
            Pageable pageable);

    @Query("SELECT s FROM Stock s WHERE " +
            "(:query IS NULL OR LOWER(s.product.name) LIKE LOWER(CONCAT('%', :query, '%'))) AND " +
            "(:supplierId IS NULL OR s.product.supplier.id = :supplierId) AND " +
            "s.quantity = 0")
    Page<Stock> searchOutOfStockByFilters(
            @Param("query") String query,
            @Param("supplierId") Long supplierId,
            Pageable pageable);

    Optional<Stock> findByProductId(Long productId);
    boolean existsByProductId(Long productId);
}



