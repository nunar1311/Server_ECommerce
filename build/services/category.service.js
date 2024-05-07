"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCategory = void 0;
const catchAsyncErrors_1 = require("../middleware/catchAsyncErrors");
const category_model_1 = __importDefault(require("../models/category.model"));
exports.createCategory = (0, catchAsyncErrors_1.CatchAsyncErrors)(async (data, res) => {
    const category = await category_model_1.default.create(data);
    res.status(201).json({
        success: true,
        category,
    });
});
