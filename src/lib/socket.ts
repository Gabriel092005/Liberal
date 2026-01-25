import { io, Socket } from "socket.io-client";

interface OrderCallData {
  id: string;
  [key: string]: any;
}


// Mantenha sua URL, mas vamos tratar o objeto de conexão
const SOCKET_URL = "https://liberalconnect.org"; 

// O segredo está aqui: o path deve conter o /api/
const SOCKET_PATH = "/api/socket.io/"; 

export const socket: Socket = io(SOCKET_URL, {
  path: SOCKET_PATH,
  // Forçamos o namespace padrão '/' explicitamente
  // Isso evita que o Socket.io tente conectar em '/api'
  forceNew: true, 
  transports: ["websocket", "polling"],
  query: {
    userId: localStorage.getItem("@liberal:userId") || '7'
  },
  withCredentials: true,
  autoConnect: false,
});
/**
 * GERENCIADOR DE CONEXÃO
 * Resolve o problema de loops de reconexão e troca de usuário.
 */
export const connectSocket = (userId: string) => {
  if (!userId) {
    console.error("❌ Erro: userId é obrigatório para conectar o socket.");
    return;
  }

  // Se já estiver conectado ou conectando com o mesmo usuário, ignora
  const currentUserId = socket.io.opts.query?.userId;
  if (socket.connected && currentUserId === userId) {
    console.log("ℹ️ Socket já ativo para este usuário.");
    return;
  }

  // Se mudar o usuário, limpa a conexão anterior completamente
  if (socket.connected || socket.active) {
    console.log("🔄 Trocando usuário: Limpando conexão anterior...");
    socket.removeAllListeners(); // Remove listeners antigos para evitar vazamento de memória
    socket.disconnect();
  }

  // Atualiza credenciais e conecta
  socket.io.opts.query = { userId };
  setupSocketListeners(); // Reatribui os listeners essenciais após o reset
  
  console.log(`🔌 Conectando socket para o usuário: ${userId}`);
  socket.connect();
};

/**
 * LISTENERS ESSENCIAIS
 * Centralizado para garantir que nunca existam duplicatas.
 */
function setupSocketListeners() {
  // Remove todos para garantir que não haverá duplicados ao re-chamar a função
  socket.off(); 

  socket.on("connect", () => {
    console.log("%c✅ Socket Conectado!", "color: #2ecc71; font-weight: bold;", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("❌ Erro de Conexão:", err.message);
    // Tenta reconectar automaticamente se for erro de transporte
    if (err.message === "xhr poll error") {
       socket.connect();
    }
  });

  socket.on("order_call", (data: OrderCallData) => {
    console.log("📦 Nova ordem recebida:", data);
    // Aqui você pode disparar um evento global ou atualizar um store (Redux/Zustand)
  });

  socket.on("disconnect", (reason) => {
    console.warn(`🔌 Desconectado: ${reason}`);
    // Se o servidor forçar o fechamento, o socket.io não tenta reconectar por padrão
    if (reason === "io server disconnect") {
      socket.connect();
    }
  });
}

// Inicializa os listeners básicos
setupSocketListeners();