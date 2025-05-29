import { Express } from "express";
import productRoutes from "./productRoutes";
import authRoutes from "./authRoutes";
import userRoutes from "./userRoutes";
import categoryRoutes from "./categoryRoutes";
import brandRoutes from "./brandRoutes";
import colorRoutes from "./colorRoutes";
import cartRoutes from "./cartRoutes";
import orderRoutes from "./orderRoutes";
import imageRoutes from "./imageRoutes"
import roleRoutes from "./roleRoutes"

const router = (app: Express) => {
    const version = "/api/v1";
    app.use(version + "/products", productRoutes);
    app.use(version + "/auth", authRoutes);
    app.use(version + "/users", userRoutes);
    app.use(version + "/categories", categoryRoutes);
    app.use(version + "/brands", brandRoutes)
    app.use(version + "/colors", colorRoutes)
    app.use(version + "/carts", cartRoutes)
    app.use(version + "/orders", orderRoutes)
    app.use(version + "/images", imageRoutes)
    app.use(version + "/roles", roleRoutes)
};

export default router;