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
let clientActive = [];

io.on("connection", (socket) => {
  console.log(socket.id, "has joined");
  socket.on("signin", (id) => {
    clients[id] = socket;
    clientActive.push({
      id: id,
      socketId: socket.id
    });
    socket.broadcast.emit('clientActive', clientActive);
  });

  socket.on("message", (msg) => {
    console.log(msg);
    let targetId = msg.targetId;
    msg['time'] = Date.now();
    if (clients[targetId]) clients[targetId].emit("message", msg);
  });

  socket.on('disconnect', () => {
    // console.log('client disconnect...', socket);
    let filtered = clientActive.filter(function (value, index, arr) {
      return value.socketId != socket.id;
    });
    socket.broadcast.emit('clientActive', filtered);
  })
});

server.listen(port, "0.0.0.0", { perMessageDeflate: false });
