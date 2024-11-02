package com.jo4ovms.StockifyAPI.repository;

import com.jo4ovms.StockifyAPI.model.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @EntityGraph(attributePaths = "roles")
    Optional<User> findByUsername(String username);

    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);

}
