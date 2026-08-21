    const express = require("express");
    const {
    registerUser,
    loginUser,
    } = require("../controllers/authController");

    const router = express.Router();

    // ======================
    // Register User
    // POST /api/auth/register
    // ======================
    router.post("/register", registerUser);

    // ======================
    // Login User
    // POST /api/auth/login
    // ======================
    router.post("/login", loginUser);

    module.exports = router;