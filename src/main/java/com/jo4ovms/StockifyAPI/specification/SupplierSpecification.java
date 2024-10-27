package com.jo4ovms.StockifyAPI.specification;

import com.jo4ovms.StockifyAPI.model.Supplier;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.Root;
import org.springframework.data.jpa.domain.Specification;


public class SupplierSpecification {
    public static Specification<Supplier> hasName(String name) {
        return (Root<Supplier> root, jakarta.persistence.criteria.CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) -> {
            if (name == null || name.trim().isEmpty()) {
                return criteriaBuilder.conjunction();
            }

            String normalizedSearchTerm = name.toLowerCase();
            return criteriaBuilder.like(
                    criteriaBuilder.function("unaccent", String.class, criteriaBuilder.lower(root.get("name"))),
                    "%" + normalizedSearchTerm + "%"
            );
        };
    }

    public static Specification<Supplier> hasProductType(String productType) {
        return (root, query, criteriaBuilder) -> {

            if (productType == null || productType.isEmpty() || "All".equalsIgnoreCase(productType)) {
                return criteriaBuilder.conjunction();
            }
            return criteriaBuilder.equal(root.get("productType"), productType);
        };
    }


}

