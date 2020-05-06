const Message = require("../models/message");
const { JWT_SECRET } = require("../../config");
const jwt = require("jsonwebtoken");
const chatlist = require("./chatlist");

module.exports = {
  saveMessage: async msg => {
    let foundMessage = await Message.findOne({ socket_id: msg.chatId });
    if (!foundMessage) {
      let messageString = msg.message + ";" + msg.name;
      let init_user = msg.user1_id;
      let target_user = msg.user2_id;
      let socket_id = msg.chatId;
      const newMessages = new Message({
        messageString,
        init_user,
        socket_id
      });
      await newMessages.save();
      chatlist.remote_create({
        params: { id: init_user },
        body: { new_connection: target_user }
      });
      chatlist.remote_create({
        params: { id: target_user },
        body: { new_connection: init_user }
      });
    } else {
      let message =
        foundMessage.messageString + ";" + msg.message + ";" + msg.name;
      foundMessage.messageString = message;
      await foundMessage.save();
    }
  },
  getMessagesHistory: async (req, res) => {
    let historyId = req.params.id;
    let foundMessages = await Message.findOne({ socket_id: historyId });
    if (!foundMessages) {
      return res.status(403).send("Messages not found.");
    }
    let messages = foundMessages.messageString.split(";");
    let final = [];
    let obj = { name: "", message: "" };
    let j = 0;
    console.log(messages.length);
    for (var i = 0; i < messages.length; i += 2) {
      obj.message = messages[i];
      obj.name = messages[i + 1];
      final[j] = { message: obj };
      obj = { name: "", message: "" };
      j++;
    }
    return res.status(200).send(final);
  },
  ifMessage: async (req, res) => {
    let historyId = req.params.id;
    let isMsg = true;
    let foundMessages = await Message.findOne({ socket_id: historyId });
    if (!foundMessages) {
      isMsg = false;
      return res.status(200).send(isMsg);
    }
    return res.status(200).send(isMsg);
  }
};
