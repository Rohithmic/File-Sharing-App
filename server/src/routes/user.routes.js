const express = require("express");
const { Router } = express;
const { 
    getUsers, 
    getUserById, 
    registerUser, 
    loginUser, 
    updateUser, 
    deleteUser, 
    logoutUser 
} = require("../controllers/user.controller");
const authenticate = require("../middlewares/auth.middlewares");

const router = Router();

router.get("/user", getUsers);
router.get("/user/:userId", getUserById);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get('/logout', logoutUser);
router.put("/user/:userId", updateUser);
router.delete("/user/:userId", deleteUser);

module.exports = router;
