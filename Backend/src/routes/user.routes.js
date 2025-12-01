import express from "express";
import { createUser, forgotpassword, loginUser, logoutUser, refreshAccessToken, resetPassword} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";



const router = express.Router();

// Create User
router.post("/create",upload.fields([{name:"profile_image",maxlength:1}]),createUser);
router.post("/login",loginUser);
router.route("/logout").post(verifyJWT,logoutUser)
router.route('/refresh-token').post(refreshAccessToken)
router.post('/forgot',forgotpassword)
router.post("/reset-password/:token",resetPassword);



export default router;


