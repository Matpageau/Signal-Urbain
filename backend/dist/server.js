"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const UserSeed_1 = require("./seed/UserSeed");
const MainRouter_1 = __importDefault(require("./router/MainRouter"));
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
const URL = process.env.DB_URL || "";
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use("/", MainRouter_1.default);
// Simple error middleware
app.use((err, req, res, next) => {
    console.error("An error has happened:", err);
    res.status(err.statusCode || 500).send(err);
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
    console.error("A server side error happened: ", err);
});
exports.default = app;
