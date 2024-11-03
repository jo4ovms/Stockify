package com.jo4ovms.StockifyAPI.repository;

import com.jo4ovms.StockifyAPI.model.AggregatedSale;
import com.jo4ovms.StockifyAPI.model.DTO.SaleSummaryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;

public interface AggregatedSaleRepository extends JpaRepository<AggregatedSale, Long> {

    @Query("SELECT new com.jo4ovms.StockifyAPI.model.DTO.SaleSummaryDTO(a.product.name, a.totalQuantitySold) " +
            "FROM AggregatedSale a " +
            "WHERE (:searchTerm IS NULL OR LOWER(a.product.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
            "AND (:supplierId IS NULL OR a.product.supplier.id = :supplierId)")
    Page<SaleSummaryDTO> findSalesGroupedByProductAndSupplier(
            @Param("searchTerm") String searchTerm,
            @Param("supplierId") Long supplierId,
            Pageable pageable);

    Optional<AggregatedSale> findByProductId(Long productId);

    @Query("SELECT new com.jo4ovms.StockifyAPI.model.DTO.SaleSummaryDTO(a.product.name, a.totalQuantitySold) " +
            "FROM AggregatedSale a " +
            "WHERE (:searchTerm IS NULL OR LOWER(a.product.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
            "AND (:supplierId IS NULL OR a.product.supplier.id = :supplierId) " +
            "AND (CAST(a.saleDate AS date) BETWEEN :startDate AND :endDate)")
    Page<SaleSummaryDTO> findSalesGroupedByProductAndSupplierAndDate(
            @Param("searchTerm") String searchTerm,
            @Param("supplierId") Long supplierId,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable);
}

