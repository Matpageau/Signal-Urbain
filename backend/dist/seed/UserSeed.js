"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultUsers = void 0;
const User_1 = require("../models/User");
const User_2 = __importDefault(require("../models/User"));
const createDefaultUsers = async () => {
    const defaultAdmin = {
        username: 'admin',
        email: 'admin@example.com',
        password: '12345',
        createdAt: new Date(),
        role: User_1.UserRoleEnum.ADMIN
    };
    const defaultCityAdmin = {
        username: 'cityadmin',
        email: 'cityadmin@example.com',
        password: '12345',
        createdAt: new Date(),
        role: User_1.UserRoleEnum.CITYADMIN
    };
    const isAdminExisting = await User_2.default.findByUsername(defaultAdmin.username);
    const isManagerExisting = await User_2.default.findByUsername(defaultCityAdmin.username);
    if (!isAdminExisting) {
        await User_2.default.registerUser(defaultAdmin);
    }
    if (!isManagerExisting) {
        await User_2.default.registerUser(defaultCityAdmin);
    }
    if (isAdminExisting && isManagerExisting) {
        console.log(`Default user already exists, skipping creation.`);
        console.log(`Admin: ${defaultAdmin.email}, City Admin: ${defaultCityAdmin.email}`);
    }
};
exports.createDefaultUsers = createDefaultUsers;
