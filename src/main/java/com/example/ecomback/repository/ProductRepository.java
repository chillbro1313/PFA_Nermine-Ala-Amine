package com.example.ecomback.repository;

import com.example.ecomback.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryAndActiveTrue(String category);
    List<Product> findByNameContainingIgnoreCaseAndActiveTrue(String name);
    Page<Product> findByNameContainingIgnoreCaseAndActiveTrue(String name, Pageable pageable);
    Page<Product> findByActiveTrue(Pageable pageable);
    List<Product> findByActiveTrue();
}
