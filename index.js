const express = require("express");
var http = require("http");
const app = express();
const port = process.env.PORT || 3000;
var server = http.createServer(app);
var io = require("socket.io")(server, {
  cors: {
    // origin: "http://localhost:8080",
    origin: '*'
  },
});

//middlewre
app.use(express.json());
var clients = {};

io.on("connection", (socket) => {
  console.log(socket.id, "has joined");
  socket.on("signin", (id) => {
    clients[id] = socket;
  });

  socket.on("message", (msg) => {
    console.log(msg);
    let targetId = msg.targetId;
    msg['time'] = Date.now();
    if (clients[targetId]) clients[targetId].emit("message", msg);
  });

  socket.on('disconnect', () => {
    console.log('client disconnect...', socket)
  })
});

server.listen(port, "0.0.0.0", { perMessageDeflate: false });
