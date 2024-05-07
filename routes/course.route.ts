import express from "express";
import { uploadCorse } from "../controllers/course.controller";
import { authorizeRoles, isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post(
    "/create-course",
    isAuthenticated,
    authorizeRoles("admin"),
    uploadCorse,
);

export default router;
