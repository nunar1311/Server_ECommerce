"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const cart_controller_1 = require("../controllers/cart.controller");
const router = express_1.default.Router();
router.post("/add-to-cart/:id", auth_1.isAuthenticated, cart_controller_1.addToCart);
router.get("/get-cart/:id", cart_controller_1.getCart);
router.delete("/delete-cart/:id", auth_1.isAuthenticated, cart_controller_1.deleteCart);
exports.default = router;
