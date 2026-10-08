package com.authentication.backend.controller;

import com.authentication.backend.entity.User;
import com.authentication.backend.repository.UserRepository;
import com.authentication.backend.security.JwtService;
import com.authentication.backend.service.EmailService;
import com.authentication.backend.service.OtpService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final OtpService otpService;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthController(
            UserRepository userRepository,
            BCryptPasswordEncoder passwordEncoder,
            OtpService otpService,
            EmailService emailService,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.otpService = otpService;
        this.emailService = emailService;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    // =========================
    // REGISTER
    // =========================

    @PostMapping("/register")
    public ResponseEntity<String> register(
            @RequestBody RegisterRequest request) {

        // Validate name
        if (request.getName() == null ||
                request.getName().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Name is required");
        }

        // Validate email
        if (request.getEmail() == null ||
                request.getEmail().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Email is required");
        }

        if (!request.getEmail().matches(
                "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {

            return ResponseEntity.badRequest()
                    .body("Please enter a valid email address");
        }

        // Strong password validation
        if (request.getPassword() == null ||
                !request.getPassword().matches(
                        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$")) {

            return ResponseEntity.badRequest()
                    .body(
                            "Password must contain at least 8 characters, " +
                            "one uppercase letter, one lowercase letter, " +
                            "one number and one special character"
                    );
        }

        // Normalize email
        String email = request.getEmail()
                .trim()
                .toLowerCase();

        // Check duplicate email
        if (userRepository.existsByEmail(email)) {

            return ResponseEntity.badRequest()
                    .body("Email already registered");
        }

        // Generate OTP
        String otp = otpService.generateOtp();
        long otpExpiry = otpService.getExpiryTime();
        long otpLastSentAt = System.currentTimeMillis();

        User user = new User();

        user.setName(request.getName().trim());
        user.setEmail(email);

        // Store password securely using BCrypt
        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        user.setOtp(otp);
        user.setOtpExpiry(otpExpiry);
        user.setOtpLastSentAt(otpLastSentAt);
        user.setVerified(false);

        userRepository.save(user);

        // Send OTP
        emailService.sendOtp(
                user.getEmail(),
                otp
        );

        return ResponseEntity.ok(
                "Registration successful. OTP sent to your email."
        );
    }

    // =========================
    // VERIFY OTP
    // =========================

    @PostMapping("/verify-otp")
    public ResponseEntity<String> verifyOtp(
            @RequestBody VerifyOtpRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {

            return ResponseEntity.badRequest()
                    .body("User not found");
        }

        if (user.isVerified()) {

            return ResponseEntity.badRequest()
                    .body("Email already verified");
        }

        if (otpService.isExpired(user.getOtpExpiry())) {

            return ResponseEntity.badRequest()
                    .body("OTP has expired");
        }

        if (user.getOtp() == null ||
                !user.getOtp().equals(request.getOtp())) {

            return ResponseEntity.badRequest()
                    .body("Invalid OTP");
        }

        // Mark email as verified
        user.setVerified(true);

        // OTP can only be used once
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setOtpLastSentAt(null);

        userRepository.save(user);

        return ResponseEntity.ok(
                "Email verified successfully"
        );
    }

    // =========================
    // RESEND OTP
    // =========================

    @PostMapping("/resend-otp")
    public ResponseEntity<String> resendOtp(
            @RequestBody VerifyOtpRequest request) {

        User user = userRepository
                .findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {

            return ResponseEntity.badRequest()
                    .body("User not found");
        }

        if (user.isVerified()) {

            return ResponseEntity.badRequest()
                    .body("Email already verified");
        }

        // 60-second OTP resend cooldown
        long now = System.currentTimeMillis();
        long cooldown = 60 * 1000L;

        if (user.getOtpLastSentAt() != null &&
                now - user.getOtpLastSentAt() < cooldown) {

            long remainingSeconds =
                    (cooldown - (now - user.getOtpLastSentAt())) / 1000;

            return ResponseEntity
                    .status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(
                            "Please wait " +
                            remainingSeconds +
                            " seconds before requesting another OTP"
                    );
        }

        String newOtp = otpService.generateOtp();
        long newOtpExpiry = otpService.getExpiryTime();

        user.setOtp(newOtp);
        user.setOtpExpiry(newOtpExpiry);
        user.setOtpLastSentAt(now);

        userRepository.save(user);

        emailService.sendOtp(
                user.getEmail(),
                newOtp
        );

        return ResponseEntity.ok(
                "New OTP sent to your email"
        );
    }

    // =========================
    // LOGIN
    // =========================

    @PostMapping("/login")
    public ResponseEntity<String> login(
            @RequestBody LoginRequest request) {

        try {

            Authentication authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    request.getEmail(),
                                    request.getPassword()
                            )
                    );

            String token = jwtService.generateToken(
                    request.getEmail()
            );

            return ResponseEntity.ok(token);

        } catch (Exception e) {

            return ResponseEntity
                    .badRequest()
                    .body("Invalid email or password");
        }
    }

    // =========================
    // FORGOT PASSWORD
    // =========================

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        if (request.getEmail() == null ||
                request.getEmail().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Email is required");
        }

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {

            return ResponseEntity.badRequest()
                    .body("No account found with this email");
        }

        String otp = otpService.generateOtp();
        long otpExpiry = otpService.getExpiryTime();

        user.setOtp(otp);
        user.setOtpExpiry(otpExpiry);

        userRepository.save(user);

        emailService.sendOtp(
                user.getEmail(),
                otp
        );

        return ResponseEntity.ok(
                "Password reset OTP sent to your email"
        );
    }

    // =========================
    // RESET PASSWORD
    // =========================

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        if (request.getEmail() == null ||
                request.getEmail().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("Email is required");
        }

        if (request.getOtp() == null ||
                request.getOtp().isBlank()) {

            return ResponseEntity.badRequest()
                    .body("OTP is required");
        }

        // Strong password validation
        if (request.getNewPassword() == null ||
                !request.getNewPassword().matches(
                        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&]).{8,}$")) {

            return ResponseEntity.badRequest()
                    .body(
                            "Password must contain at least 8 characters, " +
                            "one uppercase letter, one lowercase letter, " +
                            "one number and one special character"
                    );
        }

        String email = request.getEmail()
                .trim()
                .toLowerCase();

        User user = userRepository
                .findByEmail(email)
                .orElse(null);

        if (user == null) {

            return ResponseEntity.badRequest()
                    .body("User not found");
        }

        if (otpService.isExpired(user.getOtpExpiry())) {

            return ResponseEntity.badRequest()
                    .body("OTP has expired");
        }

        if (user.getOtp() == null ||
                !user.getOtp().equals(request.getOtp())) {

            return ResponseEntity.badRequest()
                    .body("Invalid OTP");
        }

        // Update password securely using BCrypt
        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()
                )
        );

        // OTP can only be used once
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setOtpLastSentAt(null);

        userRepository.save(user);

        return ResponseEntity.ok(
                "Password reset successfully"
        );
    }
}