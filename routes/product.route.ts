import express from "express";
import { uploadCorse } from "../controllers/course.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import { createCategory } from "../services/category.service";
import {
    getProduct,
    getSingleProduct,
    searchProduct,
    uploadProduct,
} from "../controllers/product.controller";
import { updateAccessToken } from "../controllers/user.controller";

const router = express.Router();

router.post("/create-product", uploadProduct);

router.get("/get-product/:id", updateAccessToken, getSingleProduct);
router.get("/get-product", getProduct);

router.get("/products/search", searchProduct);

export default router;
