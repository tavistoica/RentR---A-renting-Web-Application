const http = require("http");
const app = require("./app");
const socketIo = require("socket.io");
const { API_PRIVATE_PORT } = require("./config");
const { saveMessage } = require("./api/controller/message");

const port = 5001 || API_PRIVATE_PORT;

const server = http.createServer(app);

// server.listen(port);

const io = socketIo(server);

var clients = {};

io.on("connection", function(client) {
  // client.on("signin", e => {
  //   let user_id = e._id;
  //   if (!user_id) return;
  //   client.user_id = user_id;
  //   if (clients[user_id]) {
  //     clients[user_id].push(client);
  //   } else {
  //     client[user_id] = [client];
  //   }
  //   client.send("pitong");
  // });
  console.log("connected");

  let chId = "";

  client.on("join", function(roomId) {
    client.join(roomId);
    chId = roomId;
    console.log("joined " + roomId);
  });

  client.on("newChatMessage", data => {
    client.broadcast.to(chId).emit("newChatMessage", data);
    //io.to(chId).emit("newChatMessage", data);
    //io.sockets.in(chId).emit("newChatMessage", data);
    saveMessage(data.message);
    console.log(data);
  });

  // client.on("message", function(data) {
  //   console.log("message: " + data);
  // });

  client.on("disconnect", function() {
    console.log("user disconnected");
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
