"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const UserSeed_1 = require("./seed/UserSeed");
const I18n_1 = __importDefault(require("./middlewares/I18n"));
const MainRouter_1 = __importDefault(require("./router/MainRouter"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const URL = process.env.DB_URL || "";
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(I18n_1.default);
app.use("/", MainRouter_1.default);
// Simple error middleware
app.use((err, req, res, next) => {
    console.error("An error has happened:", err);
    res.status(500).send("Internal Server Error");
});
// Connection to MongoDB 
// Change the URL to your MongoDB connection string
mongoose_1.default.connect(URL)
    .then(async () => {
    console.log("Connected to MongoDB");
    console.log("Attempting to create default users...");
    await (0, UserSeed_1.createDefaultUsers)();
    app.listen(PORT, () => {
        console.log(`Server is running on Port: ${PORT}`);
        console.log(`API is accessible at http://localhost:${PORT}/api/test`);
    });
})
    .catch((err) => {
    console.error("An error has happened:", err);
});
exports.default = app;
