# 🛠️ E-Commerce Backend (Node.js + TypeScript + MongoDB)

[![Deploy to Render](https://img.shields.io/badge/render-live-success?logo=render&style=flat-square)](https://render.com)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/code-typescript-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/node.js-18+-brightgreen?style=flat-square&logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/mongoDB-atlas-success?style=flat-square&logo=mongodb)](https://www.mongodb.com/atlas)
[![Swagger](https://img.shields.io/badge/docs-swagger-yellow?style=flat-square&logo=swagger)](http://localhost:5000/api-docs)

A scalable, production-ready backend system for modern e-commerce platforms – built with **Express**, **TypeScript**, **MongoDB**, **Redis**, **JWT**, **Zod**, and **Swagger**. Designed with **modular architecture** for flexibility and long-term maintainability.

---

## 🚀 Features

- 🔐 **Authentication** – JWT-based login & register
- 🔑 **RBAC** – Role & permission management
- 🧾 **Order & Cart** – Checkout flow with VNPAY integration (IPN supported)
- 📦 **Inventory & Products** – Full CRUD with soft delete/restore
- 🎨 **Brand / Category / Color** modules
- 🧠 **Zod validation** – Input validation before hitting business logic
- ⚡ **Redis caching** – Boost performance for read-heavy operations
- ☁️ **Image upload** – Integrated with Supabase Storage
- 📊 **Admin logs** – Audit trail for user actions via middleware
- 📘 **Swagger Docs** – Auto-generated & synced per module

---

## 🧱 Tech Stack

- **Express** + **TypeScript**
- **MongoDB** with **Mongoose**
- **Redis** (cache layer)
- **Zod** (validation)
- **JWT** (auth)
- **Swagger** (API docs)
- **Supabase** (file storage)
- **Modular Architecture** 🧩

---

## ⚙️ Getting Started

```bash
# Clone the repo
git clone https://github.com/trhgatu/e-commerce-backend.git
cd trhgatu-e-commerce-backend

# Install dependencies
npm install

# Setup environment
cp .env.example .env
```

---

## 🧪 Run in Development

```bash
# Start dev server with hot reload
npm run dev
```

## 🏗️ Run in Production

```bash
npm run build
npm start
```

---

## 📁 Folder Structure

```
src/
├── server.ts
├── config/              # DB, Redis, Swagger, env
├── routes/              # Main router entrypoint
├── middlewares/         # Auth, logging, validation
├── common/              # Shared utils, base services/models
├── shared/              # Services (Redis, Upload), usecases
├── modules/             # Feature-based modules (domain-driven)
│   └── <feature>/
│       ├── <feature>.controller.ts
│       ├── <feature>.service.ts
│       ├── <feature>.route.ts
│       ├── <feature>.model.ts
│       ├── <feature>.validator.ts
│       ├── docs/
│       │   └── <feature>.swagger.ts
│       └── dtos/
└── types/               # Custom type declarations
```

---

## 🔐 Auth & Security

- JWT Authentication (access & refresh)
- Role-based access control
- Input validation with Zod
- Secure headers via Helmet (optional)

---

## 💼 Major Modules

- `auth`, `user`, `role`, `permission`
- `product`, `category`, `brand`, `color`
- `cart`, `order`, `wishlist`
- `payment` (VNPAY + IPN webhook)
- `inventory`, `voucher`, `address`
- `upload-image` (Supabase)
- `log` (admin audit trail)

---

## 📚 API Documentation

Available at:
- 📎 Local: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)
- 📎 Public Docs: [https://e-commerce-backend-v4nu.onrender.com/api-docs](https://e-commerce-backend-v4nu.onrender.com/api-docs)

Powered by `swagger-jsdoc` & `swagger-ui-express`. Each module includes its own swagger spec inside `/docs`.

---

## 🛠️ CI/CD & Render Deployment

- 🔁 Auto-deploy on push via Render
- 🟢 No config needed – just push code to GitHub
- ✅ Status: LIVE — auto-builds & runs on push

---


## 🧠 Design Guidelines

- ✅ All business logic handled in `services/`
- ✅ Routes stay lean – only orchestrate controller logic
- ✅ Input validated before hitting services
- ✅ Redis used for list & detail caching
- ✅ Logs created via middleware (`log.middleware.ts`)

---

## 🌍 Environment Variables

```env
# General
PORT=5000
API_URL=http://localhost:5000/api/v1
JWT_SECRET=your_jwt_secret
MONGODB_URI=mongodb://localhost:27017/ecommerce

# Redis Cloud
REDIS_USERNAME=default
REDIS_HOST=your.redis.host
REDIS_PORT=12345
REDIS_PASSWORD=your_password

# Supabase
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key

# VNPAY
VNP_TMNCODE=your_code
VNP_HASH_SECRET=your_secret
VNP_URL=https://sandbox.vnpayment.vn/paymentv2/vpcpay.html
VNP_RETURN_URL=https://<your_ngrok_or_domain>/api/v1/payments/vnpay/return
```

---

## 📜 License

Licensed under [MIT](https://opensource.org/licenses/MIT) – free to use, extend, and build on.

---

> Built by [@trhgatu](https://github.com/trhgatu) – a fullstack developer crafting meaningful systems 🌌
