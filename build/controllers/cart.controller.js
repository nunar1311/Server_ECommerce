"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCart = exports.getCart = exports.addToCart = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cart_model_1 = __importDefault(require("../models/cart.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const product_model_1 = __importDefault(require("../models/product.model"));
exports.addToCart = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const { quantity } = req.body;
        const userId = req.user?._id;
        let cart = await cart_model_1.default.findOne({ userId });
        if (!cart) {
            cart = new cart_model_1.default({ userId });
        }
        const existingItem = cart?.products.find((item) => item.product._id.toString() === id);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            const product = await product_model_1.default
                .findById(id)
                .select("-description -richDescription -images -initP -isFeatured -isFlashSale");
            cart.products.push({ product, quantity });
        }
        await cart.save();
        res.status(201).json({
            success: true,
            cart,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getCart = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = await user_model_1.default.findById(id);
        const cart = await cart_model_1.default.findOne({ userId });
        res.status(200).json({
            success: true,
            cart,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.deleteCart = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const userId = req.user?._id;
        let cart = await cart_model_1.default.findOne({ userId });
        if (!cart) {
            return;
        }
        const existingItem = cart?.products.findIndex((item) => item.product._id.toString() === id);
        if (existingItem === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in cart",
            });
        }
        cart.products.splice(existingItem, 1);
        await cart.save();
        res.status(200).json({
            success: true,
            message: "Product deleted from cart",
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
});
