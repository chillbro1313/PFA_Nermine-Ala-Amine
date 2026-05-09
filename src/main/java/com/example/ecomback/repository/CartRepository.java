package com.example.ecomback.repository;

import com.example.ecomback.entity.Cart;
import com.example.ecomback.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUser(User user);
}
