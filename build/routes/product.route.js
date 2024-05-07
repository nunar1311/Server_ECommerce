"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
router.post("/create-product", product_controller_1.uploadProduct);
router.get("/get-product/:id", user_controller_1.updateAccessToken, product_controller_1.getSingleProduct);
router.get("/get-product", product_controller_1.getProduct);
router.get("/products/search", product_controller_1.searchProduct);
exports.default = router;
