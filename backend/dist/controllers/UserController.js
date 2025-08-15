"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = __importDefault(require("../models/User"));
const userController = {
    async createUser(req, res, next) {
        try {
            const newUser = req.body;
            const user = await User_1.default.registerUser(newUser);
            res.status(201).json({
                ApiMessage: ({
                    ApiMessage: req.t('controllers.user.new-user-success'),
                    return: user
                })
            });
        }
        catch (error) {
            next(error);
        }
    },
    async login(req, res, next) {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                ApiMessage: req.t('controllers.user.login-error')
            });
        }
        try {
            const result = await User_1.default.loginUser(email, password);
            if (typeof result === 'string') {
                return res.status(400).json({ ApiMessage: result });
            }
            res.cookie('token', result.token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24
            });
            res.status(200).json({
                ApiMessage: req.t('controllers.user.login-success'),
                return: result.user,
            });
        }
        catch (error) {
            next(error);
        }
    },
    async getAllUsers(req, res, next) {
        try {
            const users = await User_1.default.findAll();
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
            const user = await User_1.default.findUserById(req.params.id);
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
            const deletedUser = await User_1.default.deleteUserById(userId);
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
