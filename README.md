# Dhanalakshmi Jewellery

A full-stack jewellery e-commerce portal — browse collections, manage a cart, place orders, and run the store from an admin dashboard. Built as a freelance-style project with React, Spring Boot, and MySQL.

> **Live demo:** coming soon — currently running locally. The app is deployment-ready (Dockerfile + Render blueprint included).

## What it does

**Shoppers**
- Register with email OTP verification, log in with JWT
- Browse the jewellery collection with search, category filters, and sorting
- Product detail pages with specs and related pieces
- Cart, checkout with delivery details, and order history
- Forgot-password flow with OTP reset

**Store owners (admin)**
- Dashboard with order stats and revenue overview
- Add, edit, and manage products in the catalogue
- Update order statuses

## Demo accounts

| Role     | Email                  | Password    |
|----------|------------------------|-------------|
| Customer | demo@dhanalakshmi.com  | TempPass123 |
| Admin    | admin@dhanalakshmi.com | TempPass123 |

If the admin account doesn't exist yet, create it:

```sql
INSERT INTO users (name, email, password, role, verified)
VALUES ('Store Admin', 'admin@dhanalakshmi.com',
'$2b$10$WXtsGMPKCW3cCBgE5.OuCuDvaXz12Y78C1Sy/QJc41uR4YDXY/PLy',
'ADMIN', 1);
```

(The password hash above is `TempPass123` encoded with BCrypt.)

## Tech stack

- **Frontend:** React 18, Vite, React Router, Axios, Bootstrap 5 — restyled with a luxury espresso/gold/ivory theme (Playfair Display + Jost)
- **Backend:** Java 17, Spring Boot, Spring Security, Spring Data JPA / Hibernate
- **Auth:** JWT (JJWT) + BCrypt password hashing + email OTP via Gmail SMTP
- **Database:** MySQL
- **Deploy:** Docker + `render.yaml` blueprint (Render free tier), static frontend (Cloudflare)

## Run it locally

### Prerequisites

Java 17, Maven, Node.js + npm, MySQL.

### 1. Clone and create the database

```bash
git clone https://github.com/adithyatej12/dhanalakshmi-jewellery.git
cd dhanalakshmi-jewellery
```

```sql
CREATE DATABASE authentication_db;
```

### 2. Set environment variables

The backend reads these from the environment (never committed to Git):

| Variable      | What it is                                    |
|---------------|-----------------------------------------------|
| `DB_PASSWORD` | Your local MySQL root password                |
| `DB_URL`      | Optional — defaults to `jdbc:mysql://localhost:3306/authentication_db` |
| `DB_USER`     | Optional — defaults to `root`                 |
| `JWT_SECRET`  | **Must be at least 32 characters.** Shorter secrets make every login fail (JJWT's `hmacShaKeyFor` throws `WeakKeyException` below 256 bits) |
| `MAIL_USERNAME` / `MAIL_PASSWORD` | Gmail address + [App Password](https://myaccount.google.com/apppasswords) for OTP emails |
| `FRONTEND_URL` | Optional — allowed CORS origin, defaults to `http://localhost:5173` |

Tip: put the exports in `~/.zshrc` (or `~/.bashrc`) so every terminal picks them up.

### 3. Start the backend

```bash
cd backend
mvn spring-boot:run
```

Wait for `Started BackendApplication` → API at `http://localhost:8080`.

### 4. Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`) and log in with a demo account.

## API overview

| Area     | Base path            | Notes                                    |
|----------|----------------------|------------------------------------------|
| Auth     | `/api/auth`          | register, login, verify-otp, resend-otp, forgot/reset-password |
| Products | `/api/products`      | Public browsing                          |
| Customer | `/api/customer`      | Profile, orders (authenticated)          |
| Orders   | `/api/orders`        | Order placement and lookup                |
| Admin    | `/api/admin/**`      | Products + order management — `ADMIN` role only |

## Security notes

- Passwords hashed with BCrypt; never stored or logged in plain text
- JWT signed with HS256; roles are reloaded from the database on every request, so client-side role tampering grants nothing
- `/api/admin/**` is enforced server-side with `hasRole("ADMIN")` — the React route guards are UX only
- Registration always creates `USER` accounts; there is no API path to self-promote to admin

## Deploying

- **Backend:** `backend/Dockerfile` (multi-stage Maven → JRE 17) + `render.yaml` for one-click Render deploys. Set the env vars above in the Render dashboard; `PORT` is picked up automatically.
- **Frontend:** build with `VITE_API_URL=https://<your-backend>/api npm run build`, then deploy `dist/` to Cloudflare Pages/Workers or any static host. Remember to add the frontend URL to the backend's `FRONTEND_URL`.

## Screenshots

_Coming soon — the storefront was recently restyled; screenshots to be added after deployment._

## Author

**Adithya Tej B M** — [github.com/adithyatej12](https://github.com/adithyatej12)
