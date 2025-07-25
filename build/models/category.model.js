"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Please enter a category name."],
    },
    icon: {
        type: String,
    },
    image: {
        public_id: String,
        url: String,
    },
});
const categoryModel = mongoose_1.default.model("Category", categorySchema);
exports.default = categoryModel;
