const express = require("express");
const app = express();

const server = require("http").createServer(app);
const { Server } = require("socket.io");

const {
  addUser,
  getUser,
  removeUser,
  getUsersInRoom,
} = require("./utils/users");

const io = new Server(server);

// routes
app.get("/", (req, res) => {
  res.send(
    "This is mern realtime board sharing app official server by fullyworld web tutorials"
  );
});

let roomIdGlobal, imgURLGlobal;

io.on("connection", (socket) => {
  socket.on("userJoined", (data) => {
    const { name, userId, roomId, host, presenter } = data;
    roomIdGlobal = roomId;
    socket.join(roomId);
    const users = addUser({
      name,
      userId,
      roomId,
      host,
      presenter,
      socketId: socket.id,
    });
    socket.emit("userIsJoined", { success: true, users });
    socket.broadcast.to(roomId).emit("userJoinedMessageBroadcasted",name);
    socket.broadcast.to(roomId).emit("allUsers", users);
    // socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
    //   imgURL: imgURLGlobal,
    // });
    setTimeout(() => {
      socket.broadcast.to(roomId).emit("whiteBoardDataResponse", {
        imgURL: imgURLGlobal,
      });
    }, 1000);
  });

  socket.on("whiteboardData", (data) => {
    imgURLGlobal = data;
    socket.broadcast.to(roomIdGlobal).emit("whiteBoardDataResponse", {
      imgURL: data,
    });
  });

  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    if (user) {
      removeUser(socket.id);
      const users = getUsersInRoom(roomIdGlobal)
      socket.broadcast.to(roomIdGlobal).emit("userLeftMessageBroadcasted", {
        name: user.name,
        userId: user.userId,
      });
      socket.broadcast.to(roomIdGlobal).emit("allUsers", users);
    }
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () =>
  console.log("server is running on http://localhost:5000")
);
