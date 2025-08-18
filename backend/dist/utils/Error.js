"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createError;
function createError(message, statusCode, errorKey) {
    const err = new Error(message);
    err.statusCode = !isNaN(statusCode) ? statusCode : 500;
    err.errorKey = errorKey || "INTERNAL_SERVER_ERROR";
    return err;
}
