import { io, Socket } from "socket.io-client";

interface OrderCallData {
  id: string;
  [key: string]: any;
}


const SOCKET_URL = "https://liberalconnect.org/api"; // Removi a barra final
const SOCKET_PATH = "/api/socket.io/"; // <--- DEVE ser igual ao backend

export const socket: Socket = io(SOCKET_URL, {
  path: SOCKET_PATH, // <--- Adicione/Descomente esta linha
  transports: ["polling","websocket"], // Adicionado polling para maior compatibilidade
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  query: {
    userId: localStorage.getItem("@liberal:userId") || '7'
  },
  timeout: 20000,
  withCredentials: true,
  autoConnect: false,
  secure: false, // Mude para false enquanto estiver em localhost (sem HTTPS)
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