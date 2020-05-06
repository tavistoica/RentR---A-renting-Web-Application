const express = require("express");
//const app = express();

const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { mongoURL } = require("./config");
const userRoutes = require("./api/routes/users");
const postRoutes = require("./api/routes/post");
const messageRoutes = require("./api/routes/message");
const chatlistRoutes = require("./api/routes/chatlist");
const cors = require("cors");
const passport = require("passport");

const app = express();

mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use("/users", userRoutes);
app.use("/post", postRoutes);
app.use("/messages", messageRoutes);
app.use("/chatlist", chatlistRoutes);
//app.use(passport.initialize());

module.exports = app;
