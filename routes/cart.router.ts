import express from "express";
import { isAuthenticated } from "../middleware/auth";
import {
    addToCart,
    deleteCart,
    getCart,
} from "../controllers/cart.controller";

const router = express.Router();

router.post("/add-to-cart/:id", isAuthenticated, addToCart);

router.get("/get-cart/:id", getCart);

router.delete("/delete-cart/:id", isAuthenticated, deleteCart);

export default router;
