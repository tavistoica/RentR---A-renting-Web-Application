const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  messageString: {
    type: String,
    required: true
  },
  init_user: {
    type: String,
    required: true
  },
  socket_id: {
    type: String,
    required: true
  }
});

// Create model
const Message = mongoose.model("message", MessageSchema);

//Export model
module.exports = Message;
