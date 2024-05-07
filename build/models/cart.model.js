"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const cartSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    products: [
        {
            product: {
                type: Object,
            },
            quantity: {
                type: Number,
                required: true,
                default: 1,
            },
        },
    ],
});
const cartModel = mongoose_1.default.model("Cart", cartSchema);
exports.default = cartModel;
