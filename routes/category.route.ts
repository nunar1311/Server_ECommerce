import express from "express";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";
import {
    deleteCategory,
    getCategory,
    updateCategory,
    uploadCategory,
} from "../controllers/category.controller";

const router = express.Router();

router.post("/create-category", uploadCategory);

router.put("/edit-category/:id", updateCategory);

router.get("/get-category", getCategory);

router.delete("/delete-category/:id", deleteCategory);

export default router;
