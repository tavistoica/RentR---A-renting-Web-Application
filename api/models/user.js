const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
});

UserSchema.methods.passValid = async function(inpassword) {
  try {
    return await bcrypt.compare(inpassword, this.password);
  } catch (error) {
    console.log(error);

    throw new Error(error);
  }
};

UserSchema.pre("save", async function(next) {
  try {
    const salt = await bcrypt.genSalt(10);
    const passHash = await bcrypt.hash(this.password, salt);
    this.password = passHash;
    next();
  } catch (error) {
    next(error);
  }
});
// Create model
const User = mongoose.model("user", UserSchema);

//Export model
module.exports = User;
