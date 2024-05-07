"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorMiddleware = void 0;
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const ErrorMiddleware = (error, req, res, next) => {
    error.statusCode = error.statusCode || 500;
    error.message = error.message || "Internal server error";
    // Wrong mongodb id error
    if (error.name === "CastError") {
        const message = `Resource not found. Invalid: ${error.path}`;
        error = new ErrorHandler_1.default(message, 400);
    }
    //Duplicate key error
    if (error.code === 1100) {
        const message = `Duplicate ${Object.keys(error.keyValue)} entered`;
        error = new ErrorHandler_1.default(message, 400);
    }
    //Wrong JWT error
    if (error.name === "JsonWebTokenError") {
        const message = "Json web token is invalid, try again";
        error = new ErrorHandler_1.default(message, 400);
    }
    //JWT expired error
    if (error.name === "TokenExpiredError") {
        const message = "Json web token is expired, try again";
        error = new ErrorHandler_1.default(message, 400);
    }
    res.status(error.statusCode).json({
        success: false,
        message: error.message,
    });
};
exports.ErrorMiddleware = ErrorMiddleware;
