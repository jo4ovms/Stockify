package com.jo4ovms.StockifyAPI.specification;

import com.jo4ovms.StockifyAPI.model.Stock;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.ArrayList;
import java.util.List;

public class StockSpecifications {
    @EntityGraph(attributePaths = {"product", "product.supplier"})
    public static Specification<Stock> withFilters(
            String query, Long supplierId, Integer minQuantity, Integer maxQuantity, Double minValue, Double maxValue) {
        return (root, cq, cb) -> {
            List<Predicate> predicates = new ArrayList<>();


            if (query != null && !query.isEmpty()) {
                String likePattern = "%" + query.toLowerCase() + "%";
                Predicate namePredicate = cb.like(cb.lower(root.get("product").get("name")), likePattern);
                predicates.add(namePredicate);
            }


            if (supplierId != null) {
                predicates.add(cb.equal(root.get("product").get("supplier").get("id"), supplierId));
            }


            if (minQuantity != null && maxQuantity != null) {
                predicates.add(cb.between(root.get("quantity"), minQuantity, maxQuantity));
            }


            if (minValue != null && maxValue != null) {
                predicates.add(cb.between(root.get("value"), minValue, maxValue));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
