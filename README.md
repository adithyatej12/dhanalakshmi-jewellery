# Dhanalakshmi Jewellery

A full-stack jewellery e-commerce application built with React, Spring Boot, and MySQL.

## Features

- Customer registration and email OTP verification
- JWT-based login and authentication
- Forgot password and password reset
- BCrypt password hashing
- Role-based customer and administrator access
- Jewellery product browsing and management
- Shopping cart and checkout
- Order management and status updates
- Stock validation and inventory updates
- Email notifications using SMTP

## Technology Stack

- **Frontend:** React, Vite, Bootstrap 5, Axios, React Router
- **Backend:** Java 17, Spring Boot, Spring Security
- **Authentication:** JWT, BCrypt
- **Database:** MySQL, Spring Data JPA, Hibernate
- **Email:** Spring Mail, Gmail SMTP
- **Version Control:** Git and GitHub

## Architecture

```text
Customer / Administrator
          |
          v
    React Frontend
          |
       REST API
          |
          v
    Spring Boot Backend
          |
    Spring Security + JWT
          |
          v
    Spring Data JPA
          |
          v
         MySQL
          |
          +---- Email OTP via SMTP
```

## Getting Started

### Prerequisites

- Java 17
- Maven
- Node.js and npm
- MySQL

### 1. Clone the repository

```bash
git clone https://github.com/adithyatej12/dhanalakshmi-jewellery.git
cd dhanalakshmi-jewellery
```

### 2. Create the database

```sql
CREATE DATABASE authentication_db;
```

### 3. Configure environment variables

Configure the following variables locally before starting the backend:

- `DB_PASSWORD` — MySQL password
- `MAIL_USERNAME` — Gmail account for sending email
- `MAIL_PASSWORD` — Gmail App Password
- `JWT_SECRET` — JWT signing secret

Never commit actual credentials to GitHub.

### 4. Start the backend

```bash
cd backend
mvn spring-boot:run
```

Backend URL: `http://localhost:8080`

### 5. Start the frontend

Open a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL printed by Vite, normally `http://localhost:5173`.

## Application Workflow

1. Register a customer account.
2. Verify the email using an OTP.
3. Log in securely.
4. Browse jewellery products and add items to the cart.
5. Place an order with delivery details.
6. Use the administrator dashboard to manage products and orders.
7. Reset a forgotten password through the OTP flow.

## Security

- Passwords are stored using BCrypt hashing.
- JWT is used for authenticated API requests.
- Administrative operations are protected by role-based authorization.
- OTP expiry and resend cooldown are implemented.
- Credentials are configured through environment variables.

## Testing

The following workflows have been manually tested:

- Registration and OTP verification
- Login
- Checkout and order creation
- Administrator order management
- Forgot-password and password-reset flow

## Future Enhancements

- Automated test coverage
- Online payment gateway
- Product image upload
- Cloud deployment and CI/CD

## Author

GitHub: [adithyatej12](https://github.com/adithyatej12)
