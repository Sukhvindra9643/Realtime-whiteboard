import React, { useState, useEffect } from "react";
import "./App.css";
import io from "socket.io-client";
import Forms from "./Components/forms/Forms";
import RoomPage from "./Pages/RoomPage/RoomPage";
import {Route, Routes, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const server = "http://localhost:5000";
const connectionOptions = {
  "force new connection": true,
  reconnectionAttempts: "Infinity",
  timeout: 10000,
  transports: ["websocket"],
};

const socket = io(server, connectionOptions);

const App = () => {
  const [user, setUser] = useState({});
  const [users, setUsers] = useState([]);
  
  
  useEffect(() => {
    socket.on("userIsJoined", (data) => {
      if (data.success) {
        console.log("userjoined");
        setUsers(data.users);
      } else {
        console.log("error");
      }
    });
    socket.on("allUsers", (data) => {
      setUsers(data);
    });

    socket.on("userJoinedMessageBroadcasted", (data) => {
      toast.info(`${data} joined the room`);
    });
    
    socket.on("userLeftMessageBroadcasted", (data) => {
      toast.info(`${data.name} left the room`);
    });

  }, []);

  const uuid = () => {
    var S4 = () => {
      return (((1 + Math.random()) * 0x1000) | 0).toString(16).substring(1);
    };
    return (
      S4() +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      "-" +
      S4() +
      S4() +
      S4()
    );
  };
  return (
    <div className="container">
      <ToastContainer />
      <Routes>
        <Route
          path="/"
          element={<Forms uuid={uuid} socket={socket} setUser={setUser} />}
        ></Route>
        <Route
          path="/:roomId"
          element={<RoomPage user={user} socket={socket} users={users} />}
        ></Route>
      </Routes>
    </div>
  );
};

export default App;
//yarn dev to run server
