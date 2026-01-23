import { io } from "socket.io-client";

console.log(localStorage.getItem("@liberal:userId"))


export const socket = io("https://liberalconnect.org/api", {
  transports: ["polling", "websocket"], 
  reconnectionAttempts: 5,
  withCredentials: true,
autoConnect: false,

  query: {
    userId:localStorage.getItem("@liberal:userId"), // Substitua pela sua chave real
  }
});

export const connectSocket = (userId: string) => {
  if (socket.connected) socket.disconnect();
  
  socket.io.opts.query = { userId };
  socket.connect();
  console.log(`🔌 Tentando conectar socket para o usuário: ${userId}`);
};

// Log simples de depuração (fora de hooks)
socket.on("connect", () => {
  console.log("✅ Conectado ao servidor Socket ID:", socket.id);
});