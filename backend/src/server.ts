import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { createDefaultUsers } from './seed/UserSeed';
import i18nMiddleware from './middlewares/I18n';
import MainRouter from './router/MainRouter';
import { ErrorData } from './utils/Error';
import cookieParser from 'cookie-parser';

dotenv.config();

const PORT = process.env.PORT || 3000;
const URL: string = process.env.DB_URL || "";

const app = express();
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(i18nMiddleware);
app.use("/", MainRouter);

// Simple error middleware
app.use((err: ErrorData, req: Request, res: Response, next: NextFunction): void => {
  console.error("An error has happened:", err);
  res.status(err.statusCode || 500).send(err);
});

// Connection to MongoDB 
// Change the URL to your MongoDB connection string
mongoose.connect(URL)
  .then(async () => {
    console.log("Connected to MongoDB");
    console.log("Attempting to create default users...");
    await createDefaultUsers();
    
    app.listen(PORT, () => {
      console.log(`Server is running on Port: ${PORT}`);
      console.log(`API is accessible at http://localhost:${PORT}/api/test`);
    });
  })
  .catch((err: Error) => {
    console.error("An error has happened:", err);
});

export default app;