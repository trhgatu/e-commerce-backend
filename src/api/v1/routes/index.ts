import { Express } from "express";
import productRoutes from "./productRoutes";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";

const router = (app: Express) => {
    const version = "/api/v1";
    app.use(version + "/products", productRoutes);
    app.use(version + "/auth", authRoutes);
    app.use(version + "/users", userRoutes)
};

export default router;