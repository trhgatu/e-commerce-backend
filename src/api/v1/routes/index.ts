import { Express } from "express";
import productRoutes from "./productRoutes";
import authRoutes from "./authRoutes";

const router = (app: Express) => {
    const version = "/api/v1";
    app.use(version + "/products", productRoutes);
    app.use(version + "/auth", authRoutes);
};

export default router;