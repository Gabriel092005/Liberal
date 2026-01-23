import { io } from "socket.io-client";

console.log(localStorage.getItem("@liberal:userId"))


export const socket = io("https://liberalconnect.org/api", {
  path: "/socket.io/",
  transports: ["websocket","polling"], 
  reconnectionAttempts: 5,
  withCredentials: true,
  autoConnect: false,
  query: {
    userId:'2', // Substitua pela sua chave real
  },
  secure:true
});

export const connectSocket = (userId: string) => {
  if (socket.connected) socket.disconnect();
  
  socket.io.opts.query = { userId };
  socket.connect();
  console.log(`🔌 Tentando conectar socket para o usuário: ${userId}`);

  // Digite isso no console do seu navegador onde o app está aberto
console.log("Status do Socket:", socket.connected);
console.log("ID do Usuário enviado:", socket.io.opts.query.userId);

socket.on("order_call", (data) => {
  alert("CHAMADA RECEBIDA COM SUCESSO!");
  console.log(data);
});
};

// Log simples de depuração (fora de hooks)
socket.on("connect", () => {
  console.log("✅ Conectado ao servidor Socket ID:", socket.id);
});