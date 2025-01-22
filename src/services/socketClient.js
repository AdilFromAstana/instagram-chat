import { io } from "socket.io-client";

const socket = io("wss://www.melek-crm.kz", {
  path: "/socket.io/",
  transports: ["websocket"],
});

socket.on("connect", () => {
  console.log("Connected to WebSocket server:", socket.id);
});

export const joinRoom = (roomId) => {
  socket.emit("joinRoom", roomId);
};

const listeners = new Map();

export const onNewMessage = (callback) => {
  const id = Symbol("listenerId");
  listeners.set(id, callback);

  socket.on("newMessage", (data) => {
    listeners.forEach((listener) => listener(data));
  });

  return () => {
    listeners.delete(id);
  };
};

export const onClientUpdate = (callback) => {
  socket.on("clientUpdate", callback);
};

export default socket;
