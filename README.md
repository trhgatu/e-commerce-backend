# 🛠️ E-Commerce Backend (Node.js + Express + MongoDB)

This is the backend API for an e-commerce/admin system, built with **Express**, **TypeScript**, **MongoDB**, **Redis**, **JWT**, and **Swagger**.

---

## 📁 Features

* ✅ User Authentication with JWT
* ✅ Role & Permission based access control
* ✅ Product, Category, Brand, Color, Order, Cart management
* ✅ Soft delete, restore logic
* ✅ Pagination, filtering, sorting
* ✅ Redis caching for improved performance
* ✅ Modular structure (service/controller separation)
* ✅ Swagger API docs at `/api-docs`
* ✅ File/image upload with Supabase

---

## 🚀 Tech Stack

* **Node.js**, **Express.js**
* **TypeScript**
* **MongoDB** with **Mongoose**
* **Redis**
* **Zod** for validation
* **JWT** for authentication
* **Swagger (OpenAPI 3.0)** for documentation
* **Supabase** for image handling

---

## ⚙️ Setup Instructions

```bash
# Clone the repository
git clone https://github.com/your-repo/backend.git
cd trhgatu-e-commerce-backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env
```

---

## 📦 Environment Variables (.env)

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
API_URL=http://localhost:5000/api/v1
SUPABASE_URL=https://xyz.supabase.co
SUPABASE_KEY=your_key
```

---

## 🧪 Development

```bash
# Start development server with auto-restart
npm run dev
```

## 🏗️ Production

```bash
# Build TypeScript and start production server
npm run build
npm run start
```

---

## 📚 API Documentation

📎 Available at: [http://localhost:5000/api-docs](http://localhost:5000/api-docs)

Generated using `swagger-jsdoc` and `swagger-ui-express`.

---

## 📂 Folder Structure

```
trhgatu-e-commerce-backend/
├── package.json
├── tsconfig.json
├── .nvmrc
└── src/
    ├── server.ts
    ├── api/
    │   └── v1/
    │       ├── controllers/         # Route handlers
    │       ├── docs/                # Swagger docs
    │       ├── middlewares/         # Auth, multer, validation
    │       ├── models/              # Mongoose schemas
    │       ├── routes/              # Route definitions
    │       ├── services/            # Business logic
    │       ├── utils/               # Helpers (jwt, error, query...)
    │       └── validators/          # Zod schemas
    ├── config/                      # DB, Redis, Swagger config
    └── types/express/              # Extended Express types
```

---

## 🔐 Authentication Endpoints

* `POST /auth/register` – Register a new user
* `POST /auth/login` – Login with email or username
* `POST /auth/logout` – Logout (client-side JWT clear)

---

## ✅ Example Modules

Each module includes:

* **Model** (MongoDB schema)
* **Validator** (Zod schema)
* **Service** (Business logic)
* **Controller** (Express handler)
* **Route** (Express route file)

Modules:

* `Auth`, `User`, `Role`, `Permission`
* `Product`, `Category`, `Brand`, `Color`
* `Cart`, `Order`, `Image`

---

## 🧠 Best Practices

* Use `Redis` in production for caching lists and detail views.
* Store Swagger docs modularly in `src/api/v1/docs/*.swagger.ts`
* Validate all inputs with `zod` before reaching service logic.
* Use `BaseResponseModel` structure for consistency.

---

## 📜 License

MIT License – Free to use for personal or commercial projects.

---

> Built with ❤️ by your team
