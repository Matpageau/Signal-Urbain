import express, { Request, Response, NextFunction } from "express";
import UserRoutes from "./UserRoutes";

const MainRouter = express.Router();

MainRouter.get("/api/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "API is connected and running" });
});

MainRouter.use("/api/user", UserRoutes);

export default MainRouter;