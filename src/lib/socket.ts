import { io } from "socket.io-client";

export const socket = io("https://liberalconnect.org", {
  path: "/api/socket.io/", // <--- OBRIGATÓRIO ser igual ao backend
  transports: ["websocket"], 
  reconnectionAttempts: 5,
  withCredentials:true
});