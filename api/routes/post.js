const express = require("express");
const router = express.Router();
const passport = require("passport");
const { validateBody, schemas } = require("../utils/utils_validators");
const PostsController = require("../controller/post");

router
  .route("/createPost")
  .post(validateBody(schemas.createPostSchema), PostsController.createPost);

router.route("/allPosts").get(PostsController.getAllPosts);

router.route("/getPost").get(PostsController.getPost);

router.route("/editPost").get(PostsController.editPost);

router.route("/:id").get(PostsController.getPostById);

router.route("/deletePost/:id").delete(PostsController.deletePost);

router.route("/LocationBasedPosts").post(PostsController.LocationBasedPosts);

module.exports = router;
