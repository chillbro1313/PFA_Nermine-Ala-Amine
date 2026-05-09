package com.example.ecomback.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    @Size(max = 255, message = "Product name must not exceed 255 characters")
    @Column(nullable = false)
    private String name;

    @Size(max = 2000, message = "Description must not exceed 2000 characters")
    @Column(length = 2000)
    private String description;

    @NotNull(message = "Price is required")
    @Min(value = 0, message = "Price must be non-negative")
    @Column(nullable = false)
    private Double price;

    private String imageUrl;

    @Size(max = 100, message = "Category must not exceed 100 characters")
    @Column(length = 100)
    private String category;

    @NotNull(message = "Stock is required")
    @Min(value = 0, message = "Stock must be non-negative")
    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false, columnDefinition = "boolean default true")
    private boolean active = true;

    public Product() {}

    public Product(Long id, String name, String description, Double price, String imageUrl, String category, Integer stock, boolean active) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.imageUrl = imageUrl;
        this.category = category;
        this.stock = stock;
        this.active = active;
    }

    // Builder
    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name;
        private String description;
        private Double price;
        private String imageUrl;
        private String category;
        private Integer stock;
        private boolean active = true;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder description(String description) { this.description = description; return this; }
        public Builder price(Double price) { this.price = price; return this; }
        public Builder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }
        public Builder category(String category) { this.category = category; return this; }
        public Builder stock(Integer stock) { this.stock = stock; return this; }
        public Builder active(boolean active) { this.active = active; return this; }
        public Product build() { return new Product(id, name, description, price, imageUrl, category, stock, active); }
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Double getPrice() { return price; }
    public String getImageUrl() { return imageUrl; }
    public String getCategory() { return category; }
    public Integer getStock() { return stock; }
    public boolean isActive() { return active; }

    // Setters
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setPrice(Double price) { this.price = price; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public void setCategory(String category) { this.category = category; }
    public void setStock(Integer stock) { this.stock = stock; }
    public void setActive(boolean active) { this.active = active; }
}
