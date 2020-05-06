const express = require("express");
const router = express.Router();
const ChatListController = require("../controller/chatlist");

router.route("/:id").post(ChatListController.create);
// router.route("/delete").delete(ChatListController.delete);
router.route("/get/:id").get(ChatListController.getChatlist);

module.exports = router;
