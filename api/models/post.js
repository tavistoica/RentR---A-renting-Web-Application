const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  rooms: {
    type: Number,
    required: true,
  },
  size: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  photoBase64: [
    {
      type: String,
      required: true,
    },
  ],
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

// Create model
const Post = mongoose.model("post", PostSchema);

//Export model
module.exports = Post;
