package com.example.ecomback.controller;

import com.example.ecomback.entity.Order;
import com.example.ecomback.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Client-facing order endpoints.
 * Authenticated users can checkout, view their orders, and view order details.
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * POST /api/orders/checkout — Convert cart to order
     */
    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout() {
        return ResponseEntity.ok(orderService.checkout());
    }

    /**
     * GET /api/orders/my-orders — Get current user's order history
     */
    @GetMapping("/my-orders")
    public ResponseEntity<List<Order>> getMyOrders() {
        return ResponseEntity.ok(orderService.getMyOrders());
    }

    /**
     * GET /api/orders/{id} — Get a specific order (only own orders)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getMyOrderById(id));
    }
}
