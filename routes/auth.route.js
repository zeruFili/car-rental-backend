const express = require("express");
const {
  signup,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  deleteUser,
  updateUserProfile,
  getMyProfile,
  getAllUsers,
  checkAuth, 
  refreshAccessToken, 
} = require("../controllers/auth.controller"); 

const {
  signupSchema,
  loginSchema,
  updateUserProfileSchema,
  deleteUserSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  refreshTokenSchema
} = require("../validations/auth.validation");
const { protect, adminValidator } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

const router = express.Router();


router.post("/signup", validate(signupSchema), signup);


router.post("/login", validate(loginSchema), login);


router.get("/check-auth", protect, checkAuth);


router.get("/profile", protect, getMyProfile);


router.put("/profile", protect, validate(updateUserProfileSchema), updateUserProfile);


router.delete("/:id", protect, adminValidator, validate(deleteUserSchema), deleteUser);


router.get("/", protect, adminValidator, getAllUsers);


router.post("/logout", logout);


router.post("/verify-email", validate(verifyEmailSchema), verifyEmail);

router.post("/forgot-password", validate(forgotPasswordSchema), forgotPassword);

router.post("/reset-password/:token", validate(resetPasswordSchema), resetPassword);

router.post("/refresh-token", validate(refreshTokenSchema), refreshAccessToken); 

module.exports = router;