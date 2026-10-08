package com.authentication.backend.controller;

import com.authentication.backend.entity.Order;
import com.authentication.backend.entity.Product;
import com.authentication.backend.entity.User;
import com.authentication.backend.repository.OrderRepository;
import com.authentication.backend.repository.ProductRepository;
import com.authentication.backend.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5173")
public class OrderController {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public OrderController(
            OrderRepository orderRepository,
            UserRepository userRepository,
            ProductRepository productRepository) {

        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
    }

    @PostMapping
    @Transactional
    public ResponseEntity<?> createOrder(
            @RequestBody CreateOrderRequest request,
            Authentication authentication) {

        // Find logged-in user
        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {
            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        // Validate request
        if (request.getProductId() == null ||
                request.getQuantity() == null ||
                request.getAddress() == null ||
                request.getPhone() == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Product, quantity, address and phone are required");
        }

        // Validate quantity
        if (request.getQuantity() <= 0) {

            return ResponseEntity
                    .badRequest()
                    .body("Quantity must be greater than zero");
        }

        // Find actual product from database
        Product product = productRepository
                .findById(request.getProductId())
                .orElse(null);

        if (product == null) {

            return ResponseEntity
                    .badRequest()
                    .body("Product not found");
        }

        // Check stock
        if (product.getStock() <= 0) {

            return ResponseEntity
                    .badRequest()
                    .body("Product is out of stock");
        }

        if (request.getQuantity() > product.getStock()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            "Only " +
                            product.getStock() +
                            " item(s) available in stock"
                    );
        }

        // Get actual price from database
        double actualPrice =
                product.getPrice().doubleValue();

        double totalAmount =
                actualPrice * request.getQuantity();

        // Create order
        Order order = new Order();

        order.setUser(user);

        order.setProductName(
                product.getName()
        );

        order.setQuantity(
                request.getQuantity()
        );

        order.setPrice(
                actualPrice
        );

        order.setTotalAmount(
                totalAmount
        );

        order.setAddress(
                request.getAddress()
        );

        order.setPhone(
                request.getPhone()
        );

        order.setStatus("PLACED");

        // Save order
        Order savedOrder =
                orderRepository.save(order);

        // Reduce product stock
        product.setStock(
                product.getStock() -
                request.getQuantity()
        );

        productRepository.save(product);

        return ResponseEntity.ok(savedOrder);
    }


    @GetMapping
    public ResponseEntity<?> getMyOrders(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {

            return ResponseEntity
                    .badRequest()
                    .body("User not found");
        }

        List<Order> orders =
                orderRepository
                        .findByUserOrderByOrderDateDesc(user);

        return ResponseEntity.ok(orders);
    }
}