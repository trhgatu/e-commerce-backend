import mongoose from 'mongoose';
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
export const connectMongoDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  console.log('Connected to MongoDB');
};
export const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE!,
  process.env.MYSQL_USER!,
  process.env.MYSQL_PASSWORD,
  { host: process.env.MYSQL_HOST, dialect: 'mysql' }
);
