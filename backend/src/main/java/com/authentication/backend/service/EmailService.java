package com.authentication.backend.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtp(String to, String otp) {

        SimpleMailMessage message =
                new SimpleMailMessage();

        message.setTo(to);

        message.setSubject(
                "Dhanalakshmi Jewellery - OTP Verification"
        );

        message.setText(
                "Hello,\n\n" +
                "Your OTP for Dhanalakshmi Jewellery is: "
                + otp +
                "\n\n" +
                "This OTP is valid for 10 minutes.\n\n" +
                "If you did not request this OTP, " +
                "please ignore this email.\n\n" +
                "Regards,\n" +
                "Dhanalakshmi Jewellery"
        );

        mailSender.send(message);
    }
}