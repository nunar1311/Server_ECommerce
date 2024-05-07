"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategory = exports.uploadCategory = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const category_service_1 = require("../services/category.service");
const category_model_1 = __importDefault(require("../models/category.model"));
const redis_1 = require("../utils/redis");
exports.uploadCategory = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const data = req.body;
        const image = data.image;
        if (image) {
            const myCloud = await cloudinary_1.default.v2.uploader.upload(image, {
                folder: "Category",
            });
            data.image = {
                public_id: myCloud.public_id,
                url: myCloud.url,
            };
        }
        (0, category_service_1.createCategory)(data, res, next);
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.getCategory = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const category = await category_model_1.default.find();
        res.status(200).json({
            success: true,
            category,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 400));
    }
});
exports.updateCategory = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const data = req.body;
        const image = data.image;
        if (image) {
            await cloudinary_1.default.v2.uploader.destroy(image.public_id);
            const myCloud = await cloudinary_1.default.v2.uploader.upload(image, {
                folder: "Category",
            });
            data.image = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        const categoryId = req.params.id;
        const category = await category_model_1.default.findByIdAndUpdate(categoryId, {
            $set: data,
        }, { new: true });
        res.status(201).json({
            success: true,
            category,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.deleteCategory = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const { id } = req.params;
        const category = await category_model_1.default.findById(id);
        if (!category) {
            next(new ErrorHandler_1.default("The category not found", 404));
        }
        await category?.deleteOne({ id });
        await redis_1.redis.del(id);
        res.status(200).json({
            success: true,
            message: "The category is deleted",
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
});
