package com.jo4ovms.StockifyAPI.service.stock;

import com.jo4ovms.StockifyAPI.exception.ResourceNotFoundException;
import com.jo4ovms.StockifyAPI.exception.ValidationException;
import com.jo4ovms.StockifyAPI.mapper.StockMapper;
import com.jo4ovms.StockifyAPI.model.DTO.LogDTO;
import com.jo4ovms.StockifyAPI.model.DTO.StockDTO;
import com.jo4ovms.StockifyAPI.model.DTO.StockSummaryDTO;
import com.jo4ovms.StockifyAPI.model.Product;
import com.jo4ovms.StockifyAPI.model.Stock;
import com.jo4ovms.StockifyAPI.repository.ProductRepository;
import com.jo4ovms.StockifyAPI.repository.StockRepository;
import com.jo4ovms.StockifyAPI.service.LogService;
import com.jo4ovms.StockifyAPI.specification.StockSpecifications;
import com.jo4ovms.StockifyAPI.util.LogUtils;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import com.jo4ovms.StockifyAPI.model.Log.OperationType;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;


import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.function.Consumer;


@Service
public class StockService {

    private final StockRepository stockRepository;
    private final LogUtils logUtils;
    private final ProductRepository productRepository;
    private final StockMapper stockMapper;
    private final LogService logService;

    @Autowired
    public StockService(StockRepository stockRepository, LogUtils logUtils, ProductRepository productRepository, StockMapper stockMapper, LogService logService) {
        this.stockRepository = stockRepository;
        this.logUtils = logUtils;
        this.productRepository = productRepository;
        this.stockMapper = stockMapper;
        this.logService = logService;
    }

    private <T> boolean updateField(Stock stock, T newValue, T currentValue, Consumer<T> setter) {
        if (!Objects.equals(newValue, currentValue)) {
            setter.accept(newValue);
            return true;
        }
        return false;
    }

   @Transactional
   public StockDTO createStock(StockDTO stockDTO) {
       Product product = productRepository.findById(stockDTO.getProductId())
               .orElseThrow(() -> new ResourceNotFoundException("Product with id " + stockDTO.getProductId() + " not found"));

       if (product.getQuantity() < stockDTO.getQuantity()) {
           throw new ValidationException("Insufficient product quantity. Available: " + product.getQuantity());
       }

       product.setQuantity(product.getQuantity() - stockDTO.getQuantity());
       productRepository.save(product);

       Stock stock = stockMapper.toStock(stockDTO);
       stock.setProduct(product);
       stock.setAvailable(stockDTO.getQuantity() > 0);
       Stock savedStock = stockRepository.save(stock);

       LogDTO logDTO = new LogDTO();
       logDTO.setTimestamp(savedStock.getCreatedAt());
       logUtils.populateLog(logDTO, "Stock", savedStock.getId(), OperationType.CREATE.toString(),
               stockMapper.toStockDTO(savedStock), null, "Created new Stock" );

       logService.createLog(logDTO);
       return stockMapper.toStockDTO(savedStock);
   }

   @Transactional
   public StockDTO updateStock(Long id, StockDTO stockDTO) {
       Stock stock = stockRepository.findById(id)
               .orElseThrow(() -> new ResourceNotFoundException("Stock with id " + id + " not found"));

       Product product = productRepository.findById(stockDTO.getProductId())
               .orElseThrow(() -> new ResourceNotFoundException("Product with id " + stockDTO.getProductId() + " not found"));

       StockDTO oldStockDTO = stockMapper.toStockDTO(stock);

       int quantityDifference = stockDTO.getQuantity() - stock.getQuantity();

       if (quantityDifference > 0 && product.getQuantity() < quantityDifference) {
           throw new ValidationException("Insufficient product quantity. " + quantityDifference + ".");
       }

       product.setQuantity(product.getQuantity() - quantityDifference);
       productRepository.save(product);

       boolean hasChanges = false;
       hasChanges |= updateField(stock, stockDTO.getQuantity(), stock.getQuantity(), stock::setQuantity);
       hasChanges |= updateField(stock, stockDTO.getValue(), stock.getValue(), stock::setValue);
       hasChanges |= updateField(stock, product, stock.getProduct(), stock::setProduct);

       stock.setAvailable(stockDTO.getQuantity() > 0);

       if (!hasChanges) {
           return oldStockDTO;
       }

       Stock updatedStock = stockRepository.save(stock);

       LogDTO logDTO = new LogDTO();
       logDTO.setTimestamp(LocalDateTime.now());
       logUtils.populateLog(logDTO, "Stock", updatedStock.getId(), OperationType.UPDATE.toString(), stockMapper.toStockDTO(updatedStock), oldStockDTO, "Updated Stock");
       logService.createLog(logDTO);

       return stockMapper.toStockDTO(updatedStock);
   }

    public Page<StockDTO> getAllStocks(Pageable pageable) {
        return stockRepository.findAll(pageable).map(stock -> {
            StockDTO stockDTO = stockMapper.toStockDTO(stock);
            stockDTO.setAvailable(stockDTO.getQuantity() > 0);
            return stockDTO;
        });
    }

   public StockDTO getStockById(Long id) {
       Stock stock = stockRepository.findById(id)
               .orElseThrow(() -> new ResourceNotFoundException("Stock with id " + id + " not found"));

       StockDTO stockDTO = stockMapper.toStockDTO(stock);
       stockDTO.setAvailable(stockDTO.getQuantity() > 0);

       return stockDTO;
   }

   @Transactional
   public void deleteStock(Long id) {
       Stock stock = stockRepository.findById(id)
               .orElseThrow(() -> new ResourceNotFoundException("Stock with id " + id + " not found"));
       StockDTO oldStockDTO = stockMapper.toStockDTO(stock);
       stockRepository.delete(stock);
        stockRepository.flush();

        LogDTO logDTO = new LogDTO();
        logDTO.setTimestamp(stock.getUpdatedAt());
        logUtils.populateLog(logDTO, "Stock", stock.getId(), OperationType.DELETE.toString(), null, oldStockDTO, "Deleted stock");
        logService.createLog(logDTO);
   }

    public Page<StockDTO> getStocksBySupplier(Long supplierId, Pageable pageable) {
        return stockRepository.findByProductSupplierId(supplierId, pageable)
                .map(stockMapper::toStockDTO);
    }

    public Page<StockDTO> searchStocks(String query, Pageable pageable) {
        if (query == null || query.isEmpty()) {
            return stockRepository.findAll(pageable).map(stockMapper::toStockDTO);
        }
        return stockRepository.searchByProductNameOrSupplier(query, pageable)
                .map(stockMapper::toStockDTO);
    }

    public Page<StockDTO> getFilteredStocks(String query, Long supplierId, int minQuantity, int maxQuantity, double minValue, double maxValue, Pageable pageable) {
        return stockRepository.findAll(
                StockSpecifications.withFilters(query, supplierId, minQuantity, maxQuantity, minValue, maxValue),
                pageable
        ).map(stockMapper::toStockDTO);
    }


    public Integer getMaxQuantity() {
        Object maxQuantity = stockRepository.findMaxQuantity();
        return (maxQuantity != null) ? (Integer) maxQuantity : 0;
    }

    public Double getMaxValue() {
        Object maxValue = stockRepository.findMaxValue();
        return (maxValue != null) ? (Double) maxValue : 0.0;
    }

    public StockSummaryDTO getStockSummary() {
        List<Stock> stocks = stockRepository.findAll();
        long totalProducts = stocks.size();
        long zeroQuantity = stocks.stream().filter(s -> s.getQuantity() == 0).count();
        long aboveThreshold = stocks.stream().filter(s -> s.getQuantity() >= 5).count();
        long betweenThreshold = stocks.stream().filter(s -> s.getQuantity() > 0 && s.getQuantity() < 5).count();

        return new StockSummaryDTO(totalProducts, zeroQuantity, aboveThreshold, betweenThreshold);
    }

}
