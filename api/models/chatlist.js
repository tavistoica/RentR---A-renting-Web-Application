const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ChatListSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  list: [
    {
      type: String,
      required: true
    }
  ]
});

// Create model
const ChatList = mongoose.model("chatlist", ChatListSchema);

//Export model
module.exports = ChatList;
