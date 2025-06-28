import express from "express";
const { Router } = express;
import { 
    getUsers, 
    getUserById, 
    registerUser, 
    loginUser, 
    updateUser, 
    deleteUser, 
    logoutUser 
} from "../controllers/user.controller.mjs";
import authenticate from "../middlewares/auth.middlewares.mjs";

const router = Router();

router.get("/user", getUsers);
router.get("/user/:userId", getUserById);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/logout', logoutUser);
router.put("/user/:userId", updateUser);
router.delete("/user/:userId", deleteUser);

export default router;
