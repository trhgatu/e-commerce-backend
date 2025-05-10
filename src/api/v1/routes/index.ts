import { Express } from "express";
import productRoutes from "./productRoutes";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import categoryRoutes from "./categoryRoutes"
import brandRoutes from "./brandRoutes";

const router = (app: Express) => {
    const version = "/api/v1";
    app.use(version + "/products", productRoutes);
    app.use(version + "/auth", authRoutes);
    app.use(version + "/users", userRoutes);
    app.use(version + "/categories", categoryRoutes);
    app.use(version + "/brands", brandRoutes)
};

export default router;