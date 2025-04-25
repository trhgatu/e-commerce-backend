import { Express } from "express";
import productRoutes from "./productRoutes";

const router = (app: Express) => {
    const version = "/api/v1";
    app.use(version + "/products", productRoutes);
};

export default router;