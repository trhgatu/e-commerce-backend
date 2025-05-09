import { Express } from "express";
import productRoutes from "./productRoutes";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import categoryRoutes from "./categoryRoutes"

const router = (app: Express) => {
    const version = "/api/v1";
    app.use(version + "/products", productRoutes);
    app.use(version + "/auth", authRoutes);
    app.use(version + "/users", userRoutes);
    app.use(version + "/categories", categoryRoutes)
};

export default router;