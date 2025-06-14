import express from 'express';
import { createServer } from 'http';
import { connectMongoDB } from './config/database';
import dotenv from 'dotenv';
import bodyParser from "body-parser";
import cors from 'cors';
import applyRoutes from './api/v1/routes';
import cookieParser from 'cookie-parser';
import redisClient from './config/redis';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

dotenv.config();

const app = express();
const port = process.env.PORT;

const startServer = async () => {
    try {
        await connectMongoDB();
         if (!redisClient.isOpen) {
            await redisClient.connect();
            console.log("✅ Connected to Redis Cloud");
        }

        const corsOptions = {
            origin: "*",
            credentials: true,
            allowedHeaders: ["Content-Type", "Authorization"],
        };
        app.use(cors(corsOptions));
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(express.json());
        app.use(cookieParser());

        //Swagger
        app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

        applyRoutes(app);

        const httpServer = createServer(app);

        httpServer.listen(port, () => {
            console.log(`Backend đang chạy trên cổng ${port}`);
        });

    } catch(error) {
        console.error('Lỗi khi kết nối cơ sở dữ liệu:', error);
    }
};

startServer();