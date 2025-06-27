# 🛠️ E-Commerce Backend – Modular, Scalable, Production-Ready

[![Render](https://img.shields.io/badge/render-live-success?logo=render&style=flat-square)](https://e-commerce-backend-develop.onrender.com/api-docs)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/code-typescript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/node.js-18+-brightgreen?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/mongoDB-atlas-success?style=flat-square&logo=mongodb)](https://www.mongodb.com/atlas)
[![Swagger](https://img.shields.io/badge/docs-swagger-yellow?style=flat-square&logo=swagger)](https://e-commerce-backend-develop.onrender.com/api-docs)

> A backend system for modern e-commerce platforms, built with **Node.js**, **TypeScript**, **MongoDB**, **Redis**, **Zod**, and **Swagger**, following **modular architecture** for long-term scalability.

---

## 🚀 Features

- 🔐 JWT Authentication with refresh token
- 🧑‍⚖️ RBAC – Role & Permission-based access
- 📦 Inventory-aware Cart & Order management
- 💰 Payment via **VNPAY** (IPN webhook supported)
- 🏷️ Voucher support & discount logic
- ☁️ Image uploads via **Supabase Storage**
- ⚡ Redis caching for performance
- 🔎 Full Swagger API documentation
- 🧾 Audit logs via middleware

---

## ⚙️ Tech Stack

| Layer         | Technology                          |
|---------------|--------------------------------------|
| Language      | Node.js (v18+) + TypeScript         |
| Framework     | Express.js                          |
| Database      | MongoDB (Mongoose ODM)              |
| Auth          | JWT + RBAC                          |
| Caching       | Redis Cloud                         |
| Validation    | Zod                                 |
| Docs          | Swagger (OpenAPI 3.0)               |
| Storage       | Supabase                            |
| Deployment    | Docker + Render                     |

---

## 🧱 Folder Structure

```
src/
├── config/              # DB, Redis, Swagger, env
├── routes/              # App route entrypoints
├── middlewares/         # Auth, logger, validation, etc
├── common/              # Utils, base models
├── shared/              # Services: redis, upload, usecases
├── modules/             # Feature-based modules (DDD)
│   └── <module>/
│       ├── controller.ts
│       ├── service.ts
│       ├── route.ts
│       ├── model.ts
│       ├── validator.ts
│       ├── dtos/
│       └── docs/
├── types/               # Global type declarations
└── server.ts            # App entry
```

---

## 🧪 Development Setup

```bash
# Clone repo
git clone https://github.com/trhgatu/e-commerce-backend.git
cd e-commerce-backend

# Install deps
npm install

# Setup env
cp .env.example .env
```

Start dev server:

```bash
npm run dev
```

Build & run production:

```bash
npm run build
npm start
```

---

## 🔐 Authentication & Security

- Access & Refresh token via JWT
- Secure route middleware with `requireAuth`, `requireRole`
- All inputs validated via `Zod`
- Middleware logging for audit & actions
- Redis prevents brute-force login (rate-limit ready)

---

## 💼 Major Modules

- **Core:** `auth`, `user`, `role`, `permission`, `log`
- **Product-related:** `product`, `category`, `brand`, `color`, `inventory`
- **Order-related:** `cart`, `order`, `voucher`, `payment (VNPAY)`
- **UX-enhancement:** `wishlist`, `notification`, `address`, `upload-image`

---

## 🧠 Design Guidelines

- Controller: thin layer to receive & respond
- Service: business logic lives here
- Zod Validator: input check before logic
- Middleware: logging, access control
- Redis: used for pagination cache, single-object cache, and invalidation by pattern

---

## 🛠️ CI/CD – Render Deployment

- 🎯 Push to GitHub → auto build & deploy via Render
- 🧱 Docker containerized (multi-env ready)
- 🧩 Supports environment secrets (via Render dashboard)
- 🔄 Auto restart on crash (PM2 inside Docker optional)

---

## 📘 API Documentation

- Develop: [`/api-docs`](https://e-commerce-backend-develop.onrender.com/api-docs)
- Production: [`/api-docs`](https://e-commerce-backend-prod-v1.onrender.com/api-docs)
- Built with `swagger-jsdoc` + `swagger-ui-express`
- Each module has `.swagger.ts` for documentation

---

## 🌍 Environment Variables

<details>
<summary>.env setup</summary>

```env
# Server
PORT=5000
NODE_ENV=development
API_URL=http://localhost:5000/api/v1

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Redis
REDIS_USERNAME=default
REDIS_HOST=your.redis.host
REDIS_PORT=12345
REDIS_PASSWORD=your_password

# JWT
JWT_SECRET=your_jwt_secret

# Supabase
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key

# VNPAY
VNP_TMNCODE=your_code
VNP_HASH_SECRET=your_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=https://yourdomain.com/api/v1/payments/vnpay/return
```

</details>

---

## 📜 License

MIT License – feel free to fork, learn, extend, and build your own system on top of it.

---

## ✨ Author

> Built with passion by [**@trhgatu**](https://github.com/trhgatu) –  
> *"Coding isn't just solving problems. It's telling the world who I am."*
