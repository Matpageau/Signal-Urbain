"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDefaultUsers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const User_1 = require("../models/User");
const User_2 = __importDefault(require("../models/User"));
const createDefaultUsers = async () => {
    const defaultAdmin = {
        _id: new mongoose_1.default.Types.ObjectId("777000000000000000000011").toString(),
        username: 'admin',
        email: 'admin@example.com',
        password: '12345',
        createdAt: new Date(),
        role: User_1.UserRoleEnum.ADMIN
    };
    const defaultCityAdmin = {
        _id: new mongoose_1.default.Types.ObjectId("777000000000000000000012").toString(),
        username: 'cityadmin',
        email: 'cityadmin@example.com',
        password: '12345',
        createdAt: new Date(),
        role: User_1.UserRoleEnum.CITYADMIN
    };
    const defaultUser = {
        _id: new mongoose_1.default.Types.ObjectId("777000000000000000000013").toString(),
        username: "user",
        email: "user@example.com",
        password: "12345",
        createdAt: new Date(),
        role: User_1.UserRoleEnum.USER
    };
    const isAdminExisting = await User_2.default.findByUsername(defaultAdmin.username);
    const isManagerExisting = await User_2.default.findByUsername(defaultCityAdmin.username);
    const isUserExisting = await User_2.default.findByUsername(defaultUser.username);
    if (!isAdminExisting) {
        await User_2.default.registerUser(defaultAdmin);
    }
    if (!isManagerExisting) {
        await User_2.default.registerUser(defaultCityAdmin);
    }
    if (!isUserExisting) {
        await User_2.default.registerUser(defaultUser);
    }
    if (isAdminExisting && isManagerExisting && isUserExisting) {
        console.log(`Admin : ${defaultAdmin.email}`);
        console.log(`City Admin : ${defaultCityAdmin.email}`);
        console.log(`User: ${defaultUser.email}`);
    }
};
exports.createDefaultUsers = createDefaultUsers;
