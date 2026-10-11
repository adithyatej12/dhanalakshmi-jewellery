
package com.authentication.backend.controller;

import com.authentication.backend.entity.Product;
import com.authentication.backend.repository.ProductRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminProductController {

    private final ProductRepository productRepository;

    public AdminProductController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // GET all products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productRepository.findAll());
    }

    // GET one product
    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id).orElse(null);

        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(product);
    }

    // ADD product
    @PostMapping
    public ResponseEntity<?> createProduct(
            @RequestBody ProductRequest request) {

        String validationError = validateProduct(request);

        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }

        Product product = new Product();

        product.setName(request.getName().trim());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());

        Product savedProduct = productRepository.save(product);

        return ResponseEntity.ok(savedProduct);
    }

    // UPDATE product
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest request) {

        Product product = productRepository.findById(id).orElse(null);

        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        String validationError = validateProduct(request);

        if (validationError != null) {
            return ResponseEntity.badRequest().body(validationError);
        }

        product.setName(request.getName().trim());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());

        Product updatedProduct = productRepository.save(product);

        return ResponseEntity.ok(updatedProduct);
    }

    // Validate product input
    private String validateProduct(ProductRequest request) {

        if (request.getName() == null ||
                request.getName().isBlank() ||
                request.getPrice() == null ||
                request.getStock() == null) {
            return "Name, price and stock are required";
        }

        BigDecimal price = request.getPrice();

        if (price.compareTo(BigDecimal.ZERO) < 0) {
            return "Price cannot be negative";
        }

        if (price.scale() > 2) {
            return "Price cannot have more than two decimal places";
        }

        if (price.precision() > 12) {
            return "Price exceeds the maximum allowed amount";
        }

        if (request.getStock() < 0) {
            return "Stock cannot be negative";
        }

        return null;
    }

    // DELETE product
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        Product product = productRepository.findById(id).orElse(null);

        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        productRepository.delete(product);

        return ResponseEntity.ok("Product deleted successfully");
    }
}
