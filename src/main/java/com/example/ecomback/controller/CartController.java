package com.example.ecomback.controller;

import com.example.ecomback.entity.Cart;
import com.example.ecomback.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    @GetMapping
    public ResponseEntity<Cart> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(@RequestBody Map<String, Object> body) {
        Long productId = Long.valueOf(body.get("productId").toString());
        int quantity = body.containsKey("quantity") ? Integer.parseInt(body.get("quantity").toString()) : 1;
        return ResponseEntity.ok(cartService.addToCart(productId, quantity));
    }

    @PutMapping("/item/{itemId}")
    public ResponseEntity<Cart> updateItemQuantity(
            @PathVariable Long itemId,
            @RequestBody Map<String, Integer> body
    ) {
        int quantity = body.getOrDefault("quantity", 1);
        return ResponseEntity.ok(cartService.updateItemQuantity(itemId, quantity));
    }

    @DeleteMapping("/item/{itemId}")
    public ResponseEntity<Cart> removeItem(@PathVariable Long itemId) {
        return ResponseEntity.ok(cartService.removeItem(itemId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Cart> clearCart() {
        return ResponseEntity.ok(cartService.clearCart());
    }
}
