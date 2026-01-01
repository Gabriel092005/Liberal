import { io } from "socket.io-client";

export const socket = io("https://liberalconnect.org", {
  path: "/api/socket.io/", 
  // Adicione 'polling' para garantir que ele conecte mesmo se o firewall/nginx barrar o WS
  transports: ["polling", "websocket"], 
  reconnectionAttempts: 5,
  withCredentials: true,
  autoConnect: true,
});