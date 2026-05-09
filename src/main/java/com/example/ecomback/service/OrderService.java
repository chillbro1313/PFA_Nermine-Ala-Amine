package com.example.ecomback.service;

import com.example.ecomback.entity.*;
import com.example.ecomback.repository.CartRepository;
import com.example.ecomback.repository.OrderRepository;
import com.example.ecomback.repository.ProductRepository;
import com.example.ecomback.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                        CartRepository cartRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // ─── Admin methods ───

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Page<Order> getOrdersPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return orderRepository.findAll(pageable);
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order updateOrderStatus(Long id, Map<String, String> statusMap) {
        Order order = getOrderById(id);
        if (statusMap.containsKey("status")) {
            String statusValue = statusMap.get("status");
            try {
                order.setStatus(OrderStatus.valueOf(statusValue));
            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException(
                    "Invalid order status: '" + statusValue + "'. Allowed values: " +
                    Arrays.toString(OrderStatus.values())
                );
            }
        }
        return orderRepository.save(order);
    }

    // ─── Client methods ───

    /**
     * Checkout: convert the current user's cart into an Order.
     * - Validates stock availability
     * - Decreases product stock
     * - Creates Order + OrderItems
     * - Clears the cart
     */
    @Transactional
    public Order checkout() {
        User user = getCurrentUser();

        Cart cart = cartRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Cart not found"));

        if (cart.getItems().isEmpty()) {
            throw new RuntimeException("Your cart is empty. Add items before checkout.");
        }

        // Validate stock for all items
        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();
            if (cartItem.getQuantity() > product.getStock()) {
                throw new RuntimeException(
                    "Insufficient stock for '" + product.getName() +
                    "'. Available: " + product.getStock() + ", Requested: " + cartItem.getQuantity()
                );
            }
        }

        // Create the order
        Order order = Order.builder()
                .user(user)
                .status(OrderStatus.PENDING)
                .createdAt(LocalDateTime.now())
                .totalAmount(0.0)
                .build();

        double totalAmount = 0.0;

        for (CartItem cartItem : cart.getItems()) {
            Product product = cartItem.getProduct();

            // Create order item
            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(cartItem.getQuantity())
                    .price(product.getPrice())
                    .build();

            order.getItems().add(orderItem);
            totalAmount += product.getPrice() * cartItem.getQuantity();

            // Decrease stock
            product.setStock(product.getStock() - cartItem.getQuantity());
            productRepository.save(product);
        }

        order.setTotalAmount(totalAmount);
        Order savedOrder = orderRepository.save(order);

        // Clear the cart
        cart.getItems().clear();
        cartRepository.save(cart);

        return savedOrder;
    }

    /**
     * Get all orders for the currently authenticated user.
     */
    public List<Order> getMyOrders() {
        User user = getCurrentUser();
        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }

    /**
     * Get a specific order for the current user (security: user can only see their own).
     */
    public Order getMyOrderById(Long orderId) {
        User user = getCurrentUser();
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Access denied: this order does not belong to you.");
        }
        return order;
    }
}
