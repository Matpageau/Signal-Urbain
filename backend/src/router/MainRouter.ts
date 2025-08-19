import express, { Request, Response, NextFunction } from "express";
import UserRoutes from "./UserRoutes";
import ReportRoutes from "./ReportRoutes"

const MainRouter = express.Router();

MainRouter.get("/api/test", (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: "API is connected and running" });
});

MainRouter.use("/api/user", UserRoutes);
MainRouter.use("/api/report", ReportRoutes);

export default MainRouter;