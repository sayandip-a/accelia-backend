const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getMe);
router.put("/change-password", authMiddleware, authController.changePassword);
router.put("/profile", authMiddleware, authController.updateProfile);

module.exports = router;
