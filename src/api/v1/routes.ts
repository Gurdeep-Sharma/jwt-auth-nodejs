import { Router } from "express";
import passport from "passport";
import userController from "./controllers/user.controller";

let router = Router();

router.get(
  "/auth/details",
  passport.authenticate("jwt", { session: false }),
  userController.getUserDetails
);
router.post("/auth/signup", userController.signUp);
router.post(
  "/auth/signin",

  userController.signIn
);

export default router;
