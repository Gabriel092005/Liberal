import { io, Socket } from "socket.io-client";



const SOCKET_URL = window.location.hostname === "localhost" 
  ? "http://localhost:3333" 
  : "https://liberalconnect.org"; // Seu domínio real
const SOCKET_PATH = "/api/socket.io/"; // <--- IGUAL AO BACKEND

export const socket: Socket = io(SOCKET_URL, {
  path: SOCKET_PATH,
  autoConnect: false,
  withCredentials: true,
  query: {
    userId:  localStorage.getItem("@liberal:userId") || 3
  },
  // Permita polling para que o handshake inicial funcione sempre
  transports: ["polling"  , "websocket"], 
});
window.socket = socket;

export const connectSocket = (userId: string) => {
  if (!userId) return;

  // Atualiza a query de forma limpa
  socket.io.opts.query = { userId };

  if (socket.connected) {
    socket.disconnect();
  }

  setupSocketListeners();
  socket.connect();
};

function setupSocketListeners() {
  socket.off(); // Limpa listeners anteriores

  socket.on("connect", () => {
    console.log("%c✅ Conectado ao Servidor!", "color: #2ecc71", socket.id);
  });

  socket.on("connect_error", (error) => {
    console.error("❌ Erro de Protocolo:", error.message);
    // Se falhar websocket, ele tentará polling automaticamente se configurado
  });

  socket.on("order_call", (data) => {
    console.log("📦 Evento recebido:", data);
  });
}