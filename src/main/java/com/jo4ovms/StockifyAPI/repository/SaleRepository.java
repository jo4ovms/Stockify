package com.jo4ovms.StockifyAPI.repository;

import com.jo4ovms.StockifyAPI.model.DTO.BestSellingItemDTO;
import com.jo4ovms.StockifyAPI.model.DTO.SaleSummaryDTO;
import com.jo4ovms.StockifyAPI.model.Sale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    @Query("SELECT new com.jo4ovms.StockifyAPI.model.DTO.BestSellingItemDTO(s.product.name, SUM(s.quantity)) " +
            "FROM Sale s GROUP BY s.product.name ORDER BY SUM(s.quantity) DESC")
    List<BestSellingItemDTO> findBestSellingItems();


    @Query("SELECT new com.jo4ovms.StockifyAPI.model.DTO.SaleSummaryDTO(s.product.name, SUM(s.quantity)) " +
            "FROM Sale s " +
            "WHERE (:searchTerm IS NULL OR LOWER(s.product.name) LIKE LOWER(CONCAT('%', :searchTerm, '%'))) " +
            "GROUP BY s.product.name")
    List<SaleSummaryDTO> findSalesGroupedByProduct(@Param("searchTerm") String searchTerm);



}
