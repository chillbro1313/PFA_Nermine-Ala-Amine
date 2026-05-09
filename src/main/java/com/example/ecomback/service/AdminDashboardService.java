package com.example.ecomback.service;

import com.example.ecomback.repository.OrderRepository;
import com.example.ecomback.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class AdminDashboardService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;

    public AdminDashboardService(OrderRepository orderRepository, ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
    }

    public Map<String, Object> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        
        long totalOrders = orderRepository.count();
        Double totalRevenue = orderRepository.calculateTotalRevenue();
        Long totalProductsSold = orderRepository.countTotalProductsSold();
        
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);
        stats.put("totalProductsSold", totalProductsSold != null ? totalProductsSold : 0);
        stats.put("totalOrders", totalOrders);
        stats.put("totalProducts", productRepository.count());
        
        return stats;
    }
}
