package com.authentication.backend.controller;

import com.authentication.backend.entity.Order;
import com.authentication.backend.repository.OrderRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final OrderRepository orderRepository;

    public AdminController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping("/orders")
    public ResponseEntity<List<Map<String, Object>>> getAllOrders() {

        List<Order> orders = orderRepository.findAll();

        List<Map<String, Object>> response = new ArrayList<>();

        for (Order order : orders) {

            Map<String, Object> orderData =
                    new LinkedHashMap<>();

            orderData.put("id", order.getId());
            orderData.put("userId", order.getUser().getId());
            orderData.put(
                    "customerName",
                    order.getUser().getName()
            );
            orderData.put(
                    "customerEmail",
                    order.getUser().getEmail()
            );
            orderData.put(
                    "productName",
                    order.getProductName()
            );
            orderData.put(
                    "quantity",
                    order.getQuantity()
            );
            orderData.put(
                    "price",
                    order.getPrice()
            );
            orderData.put(
                    "totalAmount",
                    order.getTotalAmount()
            );
            orderData.put(
                    "address",
                    order.getAddress()
            );
            orderData.put(
                    "phone",
                    order.getPhone()
            );
            orderData.put(
                    "status",
                    order.getStatus()
            );
            orderData.put(
                    "orderDate",
                    order.getOrderDate()
            );

            response.add(orderData);
        }

        return ResponseEntity.ok(response);
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @RequestBody UpdateOrderStatusRequest request) {

        Order order = orderRepository
                .findById(id)
                .orElse(null);

        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        if (request.getStatus() == null ||
                request.getStatus().isBlank()) {

            return ResponseEntity
                    .badRequest()
                    .body("Status is required");
        }

        String status =
                request.getStatus().toUpperCase();

        if (!status.equals("PLACED") &&
                !status.equals("CONFIRMED") &&
                !status.equals("SHIPPED") &&
                !status.equals("DELIVERED") &&
                !status.equals("CANCELLED")) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid order status");
        }

        order.setStatus(status);

        Order updatedOrder =
                orderRepository.save(order);

        return ResponseEntity.ok(
                Map.of(
                        "message",
                        "Order status updated successfully",
                        "orderId",
                        updatedOrder.getId(),
                        "status",
                        updatedOrder.getStatus()
                )
        );
    }
}