const Post = require("../models/post");
const User = require("../models/user");
const { JWT_SECRET } = require("../../config");
const jwt = require("jsonwebtoken");
const UserController = require("../controller/user");

module.exports = {
  createPost: async (req, res, next) => {
    let date = new Date().getTime();
    const {
      size,
      rooms,
      photoBase64,
      latitude,
      longitude,
      price,
    } = req.value.body;
    console.log(JSON.stringify(req.headers));
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization.split(" ")[1],
        decoded;
      console.log(authorization);
      try {
        decoded = jwt.verify(authorization, JWT_SECRET);
        console.log(decoded);
      } catch (e) {
        return res.status(401).send("unauthorized pitong");
      }
      var user = decoded.id;
      console.log(user);
      let foundUser = await User.findOne({ _id: user });
      if (!foundUser) {
        return res.status(403).send("User not found.");
      }
      const newPost = new Post({
        size,
        rooms,
        photoBase64,
        latitude,
        longitude,
        date,
        price,
        user,
      });
      await newPost.save();
      return res.status(200).send("Post created succesfully.");
    }
  },
  getAllPosts: async (req, res, next) => {
    const posts = await Post.find();
    posts.reverse();
    res.status(200).json({ posts });
  },
  LocationBasedPosts: async (req, res) => {
    if (!UserController.checkIfLogged(req))
      return res.status(401).send("unauthorized pitong");
    const radius = 0.03;
    let posts = await Post.find({}, { _id: 1, longitude: 1, latitude: 1 });
    posts = await posts.filter(
      (item) =>
        parseFloat(radius) >=
        parseFloat(
          Math.sqrt(
            (item.longitude - req.body.longitude) ** 2 +
              (item.latitude - req.body.latitude) ** 2
          )
        )
    );
    console.log(posts.length);
    if (posts.length > 0) return res.status(200).json({ posts });
    else return res.status(404);
  },
  getPost: async (req, res) => {
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization.split(" ")[1],
        decoded;
      console.log(authorization);
      try {
        decoded = jwt.verify(authorization, JWT_SECRET);
        console.log(decoded);
      } catch (e) {
        return res.status(401).send("unauthorized pitong");
      }
      const user = decoded.id;
      let posts = await Post.find({ user: user });
      return res.status(200).json({ posts });
    }
  },
  editPost: async (req, res) => {
    if (!UserController.checkIfLogged(req))
      return res.status(401).send("unauthorized pitong");
    const user = decoded.id;
    const post = await Post.findById({ _id: id });
    if (user == post.user) {
      post.title = title;
      post.description = description;
      post.photoBase64 = photoBase64;
      post.location = location;
      await post.save();
      return res.status(200).send("Post has been succesfully updated.");
    }
    return res.status(401).send("Current user can not edit this post.");
  },
  getPostById: async (req, res) => {
    let postId = req.params.id;
    let foundPost = await Post.findOne({ _id: postId });
    if (!foundPost) {
      return res.status(403).send("Post not found.");
    }
    return res.status(200).send({ foundPost });
  },
  deletePost: async (req, res) => {
    let postId = req.params.id;
    if (!postId) {
      return res.status(404).send("No id passed");
    }
    await Post.deleteOne({ _id: postId });
    return res.status(200).send("Successfuly deleted post " + this.postId);
  },
};
