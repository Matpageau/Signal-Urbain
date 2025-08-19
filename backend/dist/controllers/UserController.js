"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const User_2 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Error_1 = __importDefault(require("../utils/Error"));
const userController = {
    async createUser(req, res, next) {
        try {
            const newUserData = req.body;
            newUserData.role = User_1.UserRoleEnum.USER;
            const newUser = await User_2.default.registerUser(newUserData);
            res.status(201).json(newUser);
        }
        catch (error) {
            next(error);
        }
    },
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const errorMessages = [];
            if (!email || !password) {
                errorMessages.push((0, Error_1.default)("You must provide a valid email and password", 401, "INPUT_INVALID"));
                throw errorMessages;
            }
            const userJsonWebToken = await User_2.default.loginUser(email, password);
            if (userJsonWebToken) {
                res.cookie('token', userJsonWebToken.token, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60 * 24
                });
            }
            res.status(200).json(userJsonWebToken.token);
        }
        catch (error) {
            next(error);
        }
    },
    async getByToken(req, res, next) {
        try {
            const errorMessages = [];
            const token = req.cookies.token;
            if (!token) {
                errorMessages.push((0, Error_1.default)("There is no token provided.", 401, "TOKEN_MISSING"));
            }
            const secret = process.env.PRIV_JWT_CODE;
            const decodedToken = jsonwebtoken_1.default.verify(token, secret);
            if (!decodedToken._id) {
                errorMessages.push((0, Error_1.default)("The token provided is invalid.", 401, "TOKEN_INVALID"));
            }
            const user = await User_2.default.findById(decodedToken._id);
            if (!user) {
                errorMessages.push((0, Error_1.default)("The user could not be found with this token.", 404, "USER_NOT_FOUND"));
            }
            if (errorMessages.length > 0) {
                throw errorMessages;
            }
            res.status(200).send(user);
        }
        catch (error) {
            next(error);
        }
    },
    async getAllUsers(req, res, next) {
        try {
            const errorMessages = [];
            const users = await User_2.default.findAll();
            // Validation
            if (!users || users.length === 0) {
                errorMessages.push((0, Error_1.default)("There was no user found.", 404, "NO_USER_FOUND"));
                throw errorMessages;
            }
            res.status(200).json(users);
        }
        catch (error) {
            next(error);
        }
    },
    async getUserById(req, res, next) {
        try {
            const errorMessages = [];
            const user = await User_2.default.findUserById(req.params.id);
            // Validation
            if (!user) {
                errorMessages.push((0, Error_1.default)("The id provided dit not match any user", 404, "USER_NOT_FOUND"));
                throw errorMessages;
            }
            res.status(200).json(user);
        }
        catch (error) {
            next(error);
        }
    },
    // TODO Put request updateUserById()
    async deleteUser(req, res, next) {
        try {
            const errorMessages = [];
            const id = req.params.id;
            const user = await User_2.default.findUserById(id);
            // Validation
            if (!user) {
                errorMessages.push((0, Error_1.default)("The id provided dit not match any user", 404, "USER_NOT_FOUND"));
                throw errorMessages;
            }
            // Admin validation
            if (user.role != 'admin') {
                errorMessages.push((0, Error_1.default)("You do not have the rights to delete a user.", 404, "RIGHTS_ERROR"));
                throw errorMessages;
            }
            await User_2.default.deleteUserById(req.params.id);
            res.status(200).json(`User with id of ${req.params.id} was found and successfully deleted.`);
        }
        catch (error) {
            next(error);
        }
    }
};
exports.default = userController;
