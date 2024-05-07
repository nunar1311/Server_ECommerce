"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please enter a product name."],
    },
    description: {
        type: String,
        required: [true, "Please enter description."],
    },
    richDescription: {
        type: String,
        default: "",
    },
    image: {
        public_id: String,
        url: String,
    },
    images: [
        {
            image: {
                public_id: String,
                url: String,
            },
        },
    ],
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
        default: true,
    },
    price: {
        type: Number,
        default: 0,
    },
    initP: {
        type: String,
        required: true,
    },
    countInStock: {
        type: Number,
        min: 0,
        max: 255,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    isFlashSale: {
        type: Boolean,
        default: false,
    },
});
const productModel = mongoose_1.default.model("Product", productSchema);
exports.default = productModel;
