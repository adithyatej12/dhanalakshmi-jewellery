package com.authentication.backend.controller;

import com.authentication.backend.entity.Product;
import com.authentication.backend.repository.ProductRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/products")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminProductController {

    private final ProductRepository productRepository;

    public AdminProductController(
            ProductRepository productRepository) {

        this.productRepository = productRepository;
    }

    // GET all products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts() {

        return ResponseEntity.ok(
                productRepository.findAll()
        );
    }

    // GET one product
    @GetMapping("/{id}")
    public ResponseEntity<?> getProduct(
            @PathVariable Long id) {

        Product product = productRepository
                .findById(id)
                .orElse(null);

        if (product == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(product);
    }

    // ADD product
    @PostMapping
    public ResponseEntity<?> createProduct(
            @RequestBody ProductRequest request) {

        if (request.getName() == null ||
                request.getName().isBlank() ||
                request.getPrice() == null ||
                request.getStock() == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Name, price and stock are required");
        }

        Product product = new Product();

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());

        Product savedProduct =
                productRepository.save(product);

        return ResponseEntity.ok(savedProduct);
    }

    // UPDATE product
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @RequestBody ProductRequest request) {

        Product product = productRepository
                .findById(id)
                .orElse(null);

        if (product == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        if (request.getName() == null ||
                request.getName().isBlank() ||
                request.getPrice() == null ||
                request.getStock() == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Name, price and stock are required");
        }

        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategory(request.getCategory());
        product.setImageUrl(request.getImageUrl());

        Product updatedProduct =
                productRepository.save(product);

        return ResponseEntity.ok(updatedProduct);
    }

    // DELETE product
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(
            @PathVariable Long id) {

        Product product = productRepository
                .findById(id)
                .orElse(null);

        if (product == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        productRepository.delete(product);

        return ResponseEntity.ok(
                "Product deleted successfully"
        );
    }
}