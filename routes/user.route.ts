import express from "express";
import {
    activateUser,
    deleteUser,
    getUserInfo,
    loginUser,
    logoutUser,
    registrationUser,
    socialAuth,
    updateAccessToken,
    updatePassword,
    updateProfilePicture,
    updateUserInfo,
} from "../controllers/user.controller";
import { isAuthenticated } from "../middleware/auth";

const router = express.Router();

router.post("/registration", registrationUser);

router.post("/activate-user", activateUser);

router.post("/login", loginUser);

router.get("/logout", isAuthenticated, logoutUser);

router.get("/refresh", updateAccessToken);

router.get("/me", isAuthenticated, getUserInfo);

router.post("/social", socialAuth);

router.put(
    "/update-user-info",
    updateAccessToken,
    isAuthenticated,
    updateUserInfo,
);

router.put(
    "/update-password",
    updateAccessToken,
    isAuthenticated,
    updatePassword,
);

router.put(
    "/update-avatar",
    updateAccessToken,
    isAuthenticated,
    updateProfilePicture,
);

router.delete("/delete-user/:id", deleteUser);

export default router;
