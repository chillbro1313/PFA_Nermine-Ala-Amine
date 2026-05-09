package com.example.ecomback.service;

import com.example.ecomback.entity.Cart;
import com.example.ecomback.entity.CartItem;
import com.example.ecomback.entity.Product;
import com.example.ecomback.entity.User;
import com.example.ecomback.repository.CartRepository;
import com.example.ecomback.repository.ProductRepository;
import com.example.ecomback.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public CartService(CartRepository cartRepository, ProductRepository productRepository, UserRepository userRepository) {
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser() {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    private Cart getOrCreateCart(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(new Cart(user)));
    }

    public Cart getCart() {
        User user = getCurrentUser();
        return getOrCreateCart(user);
    }

    @Transactional
    public Cart addToCart(Long productId, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0");
        }

        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        if (product.getStock() <= 0) {
            throw new RuntimeException("Product is out of stock");
        }

        // Check if product already in cart
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst();

        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            int newQty = item.getQuantity() + quantity;
            if (newQty > product.getStock()) {
                throw new RuntimeException("Not enough stock. Available: " + product.getStock());
            }
            item.setQuantity(newQty);
        } else {
            if (quantity > product.getStock()) {
                throw new RuntimeException("Not enough stock. Available: " + product.getStock());
            }
            CartItem newItem = new CartItem(cart, product, quantity);
            cart.getItems().add(newItem);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateItemQuantity(Long itemId, int quantity) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);

        CartItem item = cart.getItems().stream()
                .filter(i -> i.getId().equals(itemId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (quantity <= 0) {
            cart.getItems().remove(item);
        } else {
            if (quantity > item.getProduct().getStock()) {
                throw new RuntimeException("Not enough stock. Available: " + item.getProduct().getStock());
            }
            item.setQuantity(quantity);
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart removeItem(Long itemId) {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);

        boolean removed = cart.getItems().removeIf(item -> item.getId().equals(itemId));
        if (!removed) {
            throw new RuntimeException("Cart item not found");
        }

        return cartRepository.save(cart);
    }

    @Transactional
    public Cart clearCart() {
        User user = getCurrentUser();
        Cart cart = getOrCreateCart(user);
        cart.getItems().clear();
        return cartRepository.save(cart);
    }
}
