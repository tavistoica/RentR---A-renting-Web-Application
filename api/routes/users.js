const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
const { validateBody, schemas } = require("../utils/utils_validators");
const UsersController = require("../controller/user");
const User = require("../models/user");
const passportConf = require("../../passport");

const passportJWT = passport.authenticate("jwt", { session: false });
const passportSignIn = passport.authenticate("local", { session: false });

router
  .route("/signup")
  .post(validateBody(schemas.registerSchema), UsersController.signUp);

router
  .route("/editProfile")
  .patch(validateBody(schemas.editSchema), UsersController.changeUser);

router
  .route("/editAvatar")
  .post(validateBody(schemas.changeAvatarSchema), UsersController.changeAvatar);

router
  .route("/editPassword")
  .patch(
    validateBody(schemas.editPasswordSchema),
    UsersController.changePassword
  );

router
  .route("/editEmail")
  .patch(validateBody(schemas.editEmailSchema), UsersController.changeEmail);

router
  .route("/signin")
  .post(
    validateBody(schemas.authSchema),
    passportSignIn,
    UsersController.signIn
  );

router.route("/profile").get(UsersController.getCurrentUser);
router.route("/profile/:id").get(UsersController.getUserDetails);
router.route("/avatar").get(UsersController.getAvatar);
router.route("/:id").get(UsersController.getUser);

module.exports = router;
