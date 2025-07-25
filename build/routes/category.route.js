"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const router = express_1.default.Router();
router.post("/create-category", category_controller_1.uploadCategory);
router.put("/edit-category/:id", category_controller_1.updateCategory);
router.get("/get-category", category_controller_1.getCategory);
router.delete("/delete-category/:id", category_controller_1.deleteCategory);
exports.default = router;
