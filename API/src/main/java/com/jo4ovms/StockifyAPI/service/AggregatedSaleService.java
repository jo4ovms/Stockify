package com.jo4ovms.StockifyAPI.service;

import com.jo4ovms.StockifyAPI.model.AggregatedSale;
import com.jo4ovms.StockifyAPI.model.DTO.SaleSummaryDTO;
import com.jo4ovms.StockifyAPI.repository.AggregatedSaleRepository;
import com.jo4ovms.StockifyAPI.repository.ProductRepository;
import com.jo4ovms.StockifyAPI.repository.StockRepository;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class AggregatedSaleService {
    private final AggregatedSaleRepository aggregatedSaleRepository;
    private final ProductRepository productRepository;

    public AggregatedSaleService(AggregatedSaleRepository aggregatedSaleRepository, ProductRepository productRepository) {
        this.aggregatedSaleRepository = aggregatedSaleRepository;
        this.productRepository = productRepository;
    }

    @Transactional
    public void updateAggregatedSales(Long productId, Long quantitySold) {
        AggregatedSale aggregatedSale = aggregatedSaleRepository.findByProductId(productId)
                .orElse(new AggregatedSale());

        if (aggregatedSale.getId() == null) {
            aggregatedSale.setProduct(productRepository.findById(productId).orElseThrow());
            aggregatedSale.setTotalQuantitySold(0L);
        }
        aggregatedSale.setTotalQuantitySold(aggregatedSale.getTotalQuantitySold() + quantitySold);
        aggregatedSale.setSaleDate(LocalDate.now());

        aggregatedSaleRepository.save(aggregatedSale);
    }

    public Page<SaleSummaryDTO> getAllAggregatedSales(String searchTerm, Long supplierId, int page, int size, String sortDirection) {
        Sort sort = Sort.by("totalQuantitySold");
        sort = "asc".equalsIgnoreCase(sortDirection) ? sort.ascending() : sort.descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return aggregatedSaleRepository.findSalesGroupedByProductAndSupplier(searchTerm, supplierId, pageable);
    }
}
