import { Router } from "express";
import validate from "../middleware/validateReqMiddleware";
import controller from "../controllers/authController";
import authValidations from "../validations/authValidations";

const router = Router();

router.post(
  "/register",
  validate(authValidations.registerUser),
  controller.registerUser
);
router.post(
  "/login",
  validate(authValidations.loginUser),
  controller.loginUser
);
router.post("/logout", controller.logoutUser);

export default router;
