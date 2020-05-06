const express = require("express");
const router = express.Router();
const { validateBody, schemas } = require("../utils/utils_validators");
const MessageController = require("../controller/message");

//router.route("/deletePost/:id").delete(MessageController.ad);
router.route("/:id").get(MessageController.getMessagesHistory);
router.route("/checkMessage/:id").get(MessageController.ifMessage);

module.exports = router;
