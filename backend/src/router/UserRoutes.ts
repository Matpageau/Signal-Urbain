import express from "express";
import UserCrontroller from "../controllers/UserController";
// import AuthJWT from "../middlewares/AuthJWT";

const UserRoutes = express.Router();

// http://localhost:3000/api/user/all
UserRoutes.post("/register", UserCrontroller.createUser);

// http://localhost:3000/api/user/login
UserRoutes.post("/login", UserCrontroller.login);

// // http://localhost:3000/api/user/all
// UserRoutes.get("/", AuthJWT, UserCrontroller.getAllUsers);

// // http://localhost:3000/api/user/:id
// UserRoutes.get("/:id", AuthJWT, UserCrontroller.getUserById);

// // http://localhost:3000/api/user/:id
// UserRoutes.delete("/:id", AuthJWT, UserCrontroller.deleteUser);

export default UserRoutes;