package com.authentication.backend.service;

import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class OtpService {

    private final SecureRandom secureRandom = new SecureRandom();

    // Generate a secure 6-digit OTP
    public String generateOtp() {

        int otp = secureRandom.nextInt(1_000_000);

        return String.format("%06d", otp);
    }

    // OTP expires after 10 minutes
    public long getExpiryTime() {

        return System.currentTimeMillis()
                + (10 * 60 * 1000);
    }

    // Check whether OTP has expired
    public boolean isExpired(Long expiryTime) {

        return expiryTime == null ||
                System.currentTimeMillis() > expiryTime;
    }
}