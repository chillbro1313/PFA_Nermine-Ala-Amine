package com.example.ecomback.repository;

import com.example.ecomback.entity.Order;
import com.example.ecomback.entity.User;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Override
    @EntityGraph(attributePaths = {"user", "items", "items.product"})
    List<Order> findAll();

    @EntityGraph(attributePaths = {"user", "items", "items.product"})
    Page<Order> findAll(Pageable pageable);

    @EntityGraph(attributePaths = {"user", "items", "items.product"})
    List<Order> findByUserOrderByCreatedAtDesc(User user);

    @EntityGraph(attributePaths = {"user", "items", "items.product"})
    Optional<Order> findById(Long id);

    @Query("SELECT SUM(o.totalAmount) FROM Order o")
    Double calculateTotalRevenue();

    @Query("SELECT SUM(oi.quantity) FROM OrderItem oi")
    Long countTotalProductsSold();
}

