package com.example.ecomback.service;

import com.example.ecomback.entity.Product;
import com.example.ecomback.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findByActiveTrue();
    }

    public Page<Product> getProductsPaginated(String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        if (search != null && !search.isEmpty()) {
            return productRepository.findByNameContainingIgnoreCaseAndActiveTrue(search, pageable);
        }
        return productRepository.findByActiveTrue(pageable);
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    /**
     * Create a product and save the uploaded image to the filesystem.
     */
    public Product createProductWithImage(Product product, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            String imageUrl = saveImage(image);
            product.setImageUrl(imageUrl);
        }
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = getProductById(id);
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStock(productDetails.getStock());
        product.setImageUrl(productDetails.getImageUrl());
        product.setCategory(productDetails.getCategory());
        return productRepository.save(product);
    }

    /**
     * Update a product and optionally replace the image.
     */
    public Product updateProductWithImage(Long id, Product productDetails, MultipartFile image) {
        Product product = getProductById(id);
        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setStock(productDetails.getStock());
        product.setCategory(productDetails.getCategory());

        if (image != null && !image.isEmpty()) {
            // Delete old image if exists
            deleteOldImage(product.getImageUrl());
            String imageUrl = saveImage(image);
            product.setImageUrl(imageUrl);
        }
        // If no new image provided, keep the existing imageUrl

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        product.setActive(false);
        productRepository.save(product);
    }

    /**
     * Save image to filesystem and return the relative URL path.
     */
    private String saveImage(MultipartFile image) {
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Files.createDirectories(uploadPath);

            // Generate unique filename
            String originalFilename = image.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }
            String uniqueFilename = UUID.randomUUID().toString() + extension;

            Path targetPath = uploadPath.resolve(uniqueFilename);
            Files.copy(image.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            // Return the URL path that will be served by the static resource handler
            return "/uploads/" + uniqueFilename;
        } catch (IOException e) {
            throw new RuntimeException("Failed to save image: " + e.getMessage(), e);
        }
    }

    /**
     * Delete old image file from filesystem.
     */
    private void deleteOldImage(String imageUrl) {
        if (imageUrl != null && imageUrl.startsWith("/uploads/")) {
            try {
                String filename = imageUrl.replace("/uploads/", "");
                Path filePath = Paths.get(uploadDir).toAbsolutePath().normalize().resolve(filename);
                Files.deleteIfExists(filePath);
            } catch (IOException e) {
                // Log but don't fail — old image cleanup is best-effort
                System.err.println("Failed to delete old image: " + e.getMessage());
            }
        }
    }
}
