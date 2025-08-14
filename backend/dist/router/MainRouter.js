"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserRoutes_1 = __importDefault(require("./UserRoutes"));
const MainRouter = express_1.default.Router();
MainRouter.get("/api/test", (req, res, next) => {
    res.status(200).json({ message: "API is connected and running" });
});
MainRouter.use("/api/user", UserRoutes_1.default);
exports.default = MainRouter;
