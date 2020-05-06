const chatlist = require("../models/chatlist");

module.exports = {
  create: async (req, res) => {
    const user_id = req.params.id;
    const list = req.body.new_connection;
    let foundChatList = await chatlist.findOne({ user_id: user_id });
    if (!foundChatList && list != undefined) {
      const newChatList = new chatlist({
        user_id,
        list
      });
      await newChatList.save();
      return res.status(200).send("Created new chatlist!");
    } else {
      foundChatList.list.push(list);
      await foundChatList.save();
      return res.status(200).send("Succesfully added new connection.");
    }
  },
  getChatlist: async (req, res) => {
    const user_id = req.params.id;
    console.log(req.body);
    let foundChatList = await chatlist.findOne({ user_id: user_id });
    if (!foundChatList) return res.status(404).send("Can't find chatlist!");
    return res.status(200).send(foundChatList.list);
  },
  remote_create: async (req, res) => {
    const user_id = req.params.id;
    const list = req.body.new_connection;
    let foundChatList = await chatlist.findOne({ user_id: user_id });
    if (!foundChatList && list != undefined) {
      const newChatList = new chatlist({
        user_id,
        list
      });
      await newChatList.save();
    } else {
      foundChatList.list.push(list);
      await foundChatList.save();
    }
  }
};
