import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  changeUserPassword,
  updateFullName,
  updateusername,
  updateAvatar,
  updatecoverImage,
  updateEmail,
  getUserDetials,
  getWatchHistory,
} from "../controllers/user.controller.js";
import { upload } from "../middleware/multer.middleware.js";
import { verifyJwt } from "../middleware/auth.middleware.js";
import multer from "multer";

const router = Router();
router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

router.route("/change-password").post(verifyJwt, changeUserPassword);
router.route("/update-fullname").patch(verifyJwt, updateFullName);
router.route("/update-username").patch(verifyJwt, updateusername);
router
  .route("/update-avatar")
  .patch(verifyJwt, upload.single("avatar"), updateAvatar);
router
  .route("/update-cover-image")
  .patch(verifyJwt, upload.single("coverImage"), updatecoverImage);
router.route("/update-email").patch(verifyJwt, updateEmail);
router.route("/c/:username").get(verifyJwt, getUserDetials);
router.route("/History").get(verifyJwt, getWatchHistory);

export default router;
