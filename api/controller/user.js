const jwt = require("jsonwebtoken");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { JWT_SECRET } = require("../../config");
const mongoose = require("mongoose");
const { DEFAULT_PROFILE_AVATAR } = require("../../config");

signToken = (user) => {
  return jwt.sign(
    {
      iss: "RentR",
      id: user._id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getHours() + 1),
    },
    JWT_SECRET,
    {
      algorithm: "HS256",
    }
  );
};

module.exports = {
  signIn: async (req, res, next) => {
    const token = signToken(req.user);
    return res.status(200).json({ token });
  },
  signUp: async (req, res) => {
    const { firstName, lastName, email, password, avatar } = req.value.body;

    let foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(403).send("Email is in use.");
    }
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      avatar,
    });

    await newUser.save();
    const token = signToken(newUser);
    return res.status(200).json({ token });
  },
  getUser: async (req, res) => {
    const user = req.params.id;
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization.split(" ")[1],
        decoded;
      try {
        decoded = jwt.verify(authorization, JWT_SECRET);
        console.log(decoded);
      } catch (e) {
        return res.status(401).send("unauthorized user");
      }
      const userId = decoded.id;
      console.log(user);
      if (user == userId) {
        let foundUser = await User.findOne({ _id: user });
        return res.status(200).json({ response: foundUser });
      }
      return res.status(500).send("Unauthorized user");
    }
  },
  getUserDetails: async (req, res) => {
    const user = req.params.id;
    let foundUser = await User.findOne({ _id: user });
    if (foundUser.avatar == null || foundUser.avatar == "") {
      let usr = {
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        avatar: DEFAULT_PROFILE_AVATAR,
      };
      return res.status(200).json({ user: usr });
    }
    let usr = {
      firstName: foundUser.firstName,
      lastName: foundUser.lastName,
      avatar: foundUser.avatar,
    };
    return res.status(200).json({ user: usr });
  },
  changeAvatar: async (req, res) => {
    const { avatar } = req.value.body;
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization.split(" ")[1],
        decoded;
      try {
        decoded = jwt.verify(authorization, JWT_SECRET);
        console.log(decoded);
      } catch (e) {
        return res.status(401).send("unauthorized pitong");
      }
      var userId = decoded.id;
      // Fetch the user by id
      console.log(userId);
      let foundUser = await User.findOne({ _id: userId });
      foundUser.avatar = avatar;
      await foundUser.save();
      return res.send(200);
    }
  },
  getCurrentUser: async (req, res) => {
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization.split(" ")[1],
        decoded;
      try {
        decoded = jwt.verify(authorization, JWT_SECRET);
        console.log(decoded);
      } catch (e) {
        return res.status(401).send("unauthorized pitong");
      }
      const userId = decoded.id;
      // Fetch the user by id
      console.log(decoded);
      let foundUser = await User.findOne({ _id: userId });
      return res.status(200).json({ response: foundUser });
    }
    return res.send(500);
  },
  getAvatar: async (req, res) => {
    let userId = null;
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization.split(" ")[1],
        decoded;
      try {
        decoded = jwt.verify(authorization, JWT_SECRET);
        //console.log(decoded);
      } catch (e) {
        return res.status(401).send("unauthorized pitong");
      }
      const userId = decoded.id;

      let foundUser = await User.findOne({ _id: userId });
      let avatar = null;
      let firstName = null;
      if (foundUser.avatar != null) {
        avatar = foundUser.avatar;
        firstName = foundUser.firstName;
      } else {
        avatar = DEFAULT_PROFILE_AVATAR;
      }
      return res.status(200).json({ avatar, firstName });
    }
  },
  changeUser: async (req, res) => {
    const { firstName, lastName } = req.value.body;
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization.split(" ")[1],
        decoded;
      try {
        decoded = jwt.verify(authorization, JWT_SECRET);
        console.log(decoded);
      } catch (e) {
        return res.status(401).send("unauthorized pitong");
      }
      var userId = decoded.id;
      let foundUser = await User.findOne({ _id: userId });
      if (!foundUser) {
        return res.status(403).send("User not found.");
      }
      foundUser.firstName = firstName;
      foundUser.lastName = lastName;
      await foundUser.save();
      return res.send(200);
    }
  },
  changeEmail: async (req, res) => {
    const { email, newEmail } = req.value.body;
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization.split(" ")[1],
        decoded;
      try {
        decoded = jwt.verify(authorization, JWT_SECRET);
        console.log(decoded);
      } catch (e) {
        return res.status(401).send("unauthorized pitong");
      }
      var userId = decoded.id;
      let foundUser = await User.findOne({ _id: userId });
      if (!foundUser) {
        return res.status(403).send("User not found.");
      }
      if (email === foundUser.email) {
        foundUser.email = newEmail;
        //const token = signToken(req.user);
        await foundUser.save();
        //const token = signToken(foundUser);
        return res.send(200).json({ token });
      } else {
        return res.status(400).send("The old email is not correct!");
      }
    }
  },
  changePassword: async (req, res) => {
    const { password, newPassword, newPassword2 } = req.value.body;
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization.split(" ")[1],
        decoded;
      try {
        decoded = jwt.verify(authorization, JWT_SECRET);
        console.log(decoded);
      } catch (e) {
        return res.status(401).send("unauthorized pitong");
      }
      var userId = decoded.id;
      let foundUser = await User.findOne({ _id: userId });
      if (!foundUser) {
        return res.status(403).send("User not found.");
      }
      if (foundUser.passValid(password)) {
        if (newPassword === newPassword2) {
          foundUser.password = newPassword;
          await foundUser.save();
          return res.send(200);
        } else {
          return res.status(400).send("The new password does not match.");
        }
      } else {
        return res.status(400).send("The old password is not correct.");
      }
    }
  },
  checkIfLogged: async (req, res) => {
    if (req.headers && req.headers.authorization) {
      var authorization = req.headers.authorization.split(" ")[1],
        decoded;
      console.log(authorization);
      try {
        decoded = jwt.verify(authorization, JWT_SECRET);
        console.log(decoded);
        return true;
      } catch (e) {
        return false;
      }
    }
  },
};
