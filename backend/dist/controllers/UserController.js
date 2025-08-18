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
        const { email, password } = req.body;
        const errorMessages = [];
        if (!email || !password) {
            errorMessages.push((0, Error_1.default)("You must provide a valid email and password", 401, "INPUT_INVALID"));
        }
        try {
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
            const users = await User_2.default.findAll();
            if (!users || users.length === 0) {
                return res.status(404).json({
                    ApiMessage: req.t('controllers.user.errors.no-user-found')
                });
            }
            res.status(200).json({
                ApiMessage: req.t('controllers.user.get-users-success'),
                return: users
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getUserById(req, res, next) {
        try {
            const user = await User_2.default.findUserById(req.params.id);
            if (!user) {
                return res.status(404).json({
                    ApiMessage: req.t('controllers.user.errors.invalid-id')
                });
            }
            res.status(200).json({
                ApiMessage: req.t('controllers.user.get-user-success'),
                return: user
            });
        }
        catch (error) {
            next(error);
        }
    },
    // TODO Implement that only admin can delete users
    async deleteUser(req, res, next) {
        try {
            const userId = req.params.id;
            const deletedUser = await User_2.default.deleteUserById(userId);
            if (!deletedUser) {
                return res.status(404).json({
                    ApiMessage: req.t('controllers.user.errors.invalid-id')
                });
            }
            res.status(200).json({
                ApiMessage: req.t('controllers.user.delete-success'),
                return: deletedUser
            });
        }
        catch (error) {
            next(error);
        }
    }
};
exports.default = userController;
