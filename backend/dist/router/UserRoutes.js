"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = __importDefault(require("../controllers/UserController"));
// import AuthJWT from "../middlewares/AuthJWT";
const UserRoutes = express_1.default.Router();
// http://localhost:3000/api/user/all
UserRoutes.post("/register", UserController_1.default.createUser);
// http://localhost:3000/api/user/login
UserRoutes.post("/login", UserController_1.default.login);
// http://localhost:3000/api/user/me
UserRoutes.get("/me", UserController_1.default.getByToken);
// // http://localhost:3000/api/user/all
// UserRoutes.get("/", AuthJWT, UserCrontroller.getAllUsers);
// // http://localhost:3000/api/user/:id
// UserRoutes.get("/:id", AuthJWT, UserCrontroller.getUserById);
// // http://localhost:3000/api/user/:id
// UserRoutes.delete("/:id", AuthJWT, UserCrontroller.deleteUser);
exports.default = UserRoutes;
