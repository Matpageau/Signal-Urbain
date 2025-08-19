"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoleEnum = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const Error_1 = __importDefault(require("../utils/Error"));
const UserSchema_1 = __importDefault(require("./UserSchema"));
var UserRoleEnum;
(function (UserRoleEnum) {
    UserRoleEnum["USER"] = "user";
    UserRoleEnum["CITYADMIN"] = "cityadmin";
    UserRoleEnum["ADMIN"] = "admin";
})(UserRoleEnum || (exports.UserRoleEnum = UserRoleEnum = {}));
class User {
    constructor({ _id, username, email, password, role }) {
        this._id = _id || null;
        this.username = username;
        this.password = password;
        this.role = role;
        this.email = email;
        this.createdAt = new Date();
        this.avatar = undefined;
    }
    /**
     * This async function saves the user instance into the database.
     * @returns A promise of the saved user information as object
     */
    async save() {
        try {
            const userInfo = new UserSchema_1.default({
                username: this.username,
                password: this.password,
                role: this.role,
                email: this.email,
                createdAt: this.createdAt,
                avatar: this.avatar
            });
            await userInfo.save();
            console.log(`User ${this.username} saved successfully.`);
        }
        catch (error) {
            console.error("Error saving user:", error);
            throw error;
        }
    }
    /**
     * This async function verify if the email or username already exists,
     * then it hashes the password and it then saves the new user into the database.
     * @param data Object containing user information
     * @returns The newly created user information as object
     */
    static async registerUser(data) {
        // Check if user already exists
        const existingUsername = await mongoose_1.default.model('User').findOne({ username: data.username });
        const existingEmail = await mongoose_1.default.model('User').findOne({ email: data.email });
        const errorMessages = [];
        // Validation
        if (existingEmail) {
            errorMessages.push((0, Error_1.default)("Email you are have entered is already in use.", 401, "EMAIL_ALREADY_EXIST"));
        }
        if (existingUsername) {
            errorMessages.push((0, Error_1.default)("Username you are have entered is already in use.", 401, "USERNAME_ALREADY_EXIST"));
        }
        if (!data.username || !data.email || !data.password) {
            errorMessages.push((0, Error_1.default)("You must provide username, email and password.", 401, "INPUT_INVALID"));
        }
        if (errorMessages.length > 0) {
            throw errorMessages;
        }
        // Create new instance
        const newUser = new User(data);
        // Hash password
        newUser.password = await newUser.hashPassword();
        // Save to DB
        await newUser.save();
        return newUser;
    }
    /**
     * A static async function that logs in a user by verifying their credentials.
     * @param email The username of the user trying to log in.
     * @param password The password of the user trying to log in.
     * @returns A valid JWT token if the credentials are correct, or an error message if they are not.
     */
    static async loginUser(email, password) {
        try {
            // Find user by username
            const errorMessages = [];
            const user = await User.findByEmail(email);
            if (!user) {
                errorMessages.push((0, Error_1.default)("The email provided is not found.", 404, "EMAIL_NOT_FOUND"));
                throw errorMessages;
            }
            // Verify password
            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                errorMessages.push((0, Error_1.default)("The password provided is invalid.", 404, "PASSWORD_INVALID"));
                throw errorMessages;
            }
            // Generate JWT for 1 day
            const token = user.generateToken(false);
            return {
                token,
                user: {
                    _id: user._id,
                    username: user.username,
                    password: "",
                    email: user.email,
                    role: user.role,
                    createdAt: user.createdAt,
                    avatar: user.avatar,
                }
            };
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * This async function use bcrypt module to hash the raw password.
     * @returns A promise of an hashed password ready to save into the database.
     */
    async hashPassword() {
        const saltRounds = 10;
        const salt = await bcryptjs_1.default.genSalt(saltRounds);
        return await bcryptjs_1.default.hash(this.password, salt);
    }
    ;
    /**
     * @param rawPassword
     * This async function use bcrypt module to compare the raw password with the encrypted password.
     * It returns true if they match, false otherwise.
     * @returns A boolean
     */
    async comparePassword(rawPassword) {
        const errorMessages = [];
        if (!rawPassword || rawPassword.trim() === '') {
            errorMessages.push((0, Error_1.default)("The password provided is invalid.", 401, "PASSWORD_INVALID"));
            throw errorMessages;
        }
        return bcryptjs_1.default.compare(rawPassword, this.password);
    }
    ;
    /**
     * This function uses jwt.sign functions and generates a JWT token for the user.
     * @param rememberMe A boolean that manage the duration of the token by indicating if the user wants to be remembered (true, 7day) or not (false, 15min).
     * @returns A JWT token as a string
     */
    generateToken(rememberMe = false) {
        try {
            const userPayload = {
                _id: this._id,
                email: this.email,
                username: this.username,
                role: this.role,
                createdAt: this.createdAt,
                avatar: this.avatar
            };
            const secret = process.env.PRIV_JWT_CODE;
            const options = {
                // Ternary condition that set the expiration token based on @param: rememberMe<boolean> checkbox
                expiresIn: rememberMe ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 24
            };
            const token = jsonwebtoken_1.default.sign(userPayload, secret, options);
            return token;
        }
        catch (error) {
            throw (0, Error_1.default)("There was an error during token generation", 500, "GEN_TOKEN_ERROR");
        }
    }
    static async findById(id) {
        const user = await UserSchema_1.default.findById(id);
        if (user) {
            return new User({
                _id: user._id,
                username: user.username,
                password: user.password,
                role: user.role,
                email: user.email,
                createdAt: user.createdAt,
                avatar: user.avatar
            });
        }
        return null;
    }
    /**
     * This async function retrieves all users from the database.
     * @returns It returns an array of User instances.
     */
    static async findAll() {
        const databaseUsers = await mongoose_1.default.model('User').find();
        if (!databaseUsers || databaseUsers.length === 0) {
            return [];
        }
        return databaseUsers.map(user => new User({
            _id: user._id,
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role,
            createdAt: user.createdAt,
            avatar: user.avatar
        }));
    }
    /**
     * An async function that search for one user by their username in the database.
     * @param username The username of the user to search for.
     * @returns It returns the user object if found, or null if not found.
     */
    static async findByUsername(username) {
        const errorMessages = [];
        const user = await mongoose_1.default.model('User').findOne({ username });
        if (!user) {
            errorMessages.push((0, Error_1.default)("The id provided dit not match any user", 404, "USER_NOT_FOUND"));
            throw errorMessages;
        }
        return new User({
            _id: user._id,
            username: user.username,
            email: user.email,
            password: "",
            role: user.role,
            createdAt: user.createdAt,
            avatar: user.avatar
        });
    }
    /**
     * An async function that searches for a user by their ID in the database.
     * @param userId The ID of the user to search for.
     * @returns It returns the user object if found, or null if not found.
     */
    static async findUserById(userId) {
        const errorMessages = [];
        const user = await mongoose_1.default.model('User').findById(userId);
        if (!user) {
            errorMessages.push((0, Error_1.default)("The id provided dit not match any user", 404, "USER_NOT_FOUND"));
            throw errorMessages;
        }
        return new User({
            _id: user._id,
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role,
            createdAt: user.createdAt,
            avatar: user.avatar
        });
    }
    /**
     * An async function that searches for a user by their email in the database.
     * @param email The email of the user to search for.
     * @returns It returns the user object if found, or null if not found.
     */
    static async findByEmail(email) {
        const errorMessages = [];
        const user = await mongoose_1.default.model('User').findOne({ email });
        if (!user) {
            errorMessages.push((0, Error_1.default)("The id provided dit not match any user", 404, "USER_NOT_FOUND"));
            throw errorMessages;
        }
        return new User({
            _id: user._id,
            username: user.username,
            email: user.email,
            password: user.password,
            role: user.role,
            createdAt: user.createdAt,
            avatar: user.avatar
        });
    }
    /**
     * An async function that deletes a user by their ID from the database.
     * @param userId The ID of the user to delete.
     * @returns A message indicating the result of the deletion operation, or null if the user was not found.
     */
    static async deleteUserById(userId) {
        const errorMessages = [];
        const user = await mongoose_1.default.model('User').findByIdAndDelete(userId);
        if (!user) {
            errorMessages.push((0, Error_1.default)("The id provided dit not match any user", 404, "USER_NOT_FOUND"));
            throw errorMessages;
        }
        return true;
    }
}
exports.default = User;
;
