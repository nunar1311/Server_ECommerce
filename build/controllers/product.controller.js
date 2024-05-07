"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProduct = exports.getSingleProduct = exports.getProduct = exports.uploadProduct = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const cloudinary_1 = __importDefault(require("cloudinary"));
const product_service_1 = require("../services/product.service");
const product_model_1 = __importDefault(require("../models/product.model"));
const redis_1 = require("../utils/redis");
exports.uploadProduct = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const data = req.body;
        const image = data.image;
        const images = data.images;
        if (image) {
            const myCloud = await cloudinary_1.default.v2.uploader.upload(image, {
                folder: "product",
            });
            data.image = {
                public_id: myCloud.public_id,
                url: myCloud.secure_url,
            };
        }
        if (images) {
            let uploadedImages = [];
            for (const imageObject of images) {
                if (imageObject && imageObject.image) {
                    const myCloud = await cloudinary_1.default.v2.uploader.upload(imageObject.image, {
                        folder: "productItem",
                    });
                    uploadedImages.push({
                        image: {
                            public_id: myCloud.public_id,
                            url: myCloud.secure_url,
                        },
                    });
                }
                else {
                    next(new ErrorHandler_1.default(imageObject, 400));
                }
            }
            data.images = uploadedImages;
        }
        (0, product_service_1.createProduct)(data, res, next);
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getProduct = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const product = await product_model_1.default
            .find()
            .select("-description -images -richDescription");
        res.status(200).json({
            success: true,
            product,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.getSingleProduct = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    const productId = req.params.id;
    const isCacheExist = await redis_1.redis.get(productId);
    if (isCacheExist) {
        const product = JSON.parse(isCacheExist);
        res.status(200).json({
            success: true,
            product,
        });
    }
    else {
        const product = await product_model_1.default.findById(req.params.id);
        await redis_1.redis.set(productId, JSON.stringify(product));
        res.status(200).json({
            success: true,
            product,
        });
    }
    try {
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
});
exports.searchProduct = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (req, res, next) => {
    try {
        const searchQuery = req.query.query;
        const searchResults = await product_model_1.default.find({
            name: { $regex: new RegExp(searchQuery, "i") },
            $text: { $search: searchQuery },
        });
        res.status(200).json({
            success: true,
            searchResults,
        });
    }
    catch (error) {
        next(new ErrorHandler_1.default(error.message, 500));
    }
});
