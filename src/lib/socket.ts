import { io, Socket } from "socket.io-client";

// Tipagem básica para os dados (ajuste conforme seu contrato de backend)
interface OrderCallData {
  id: string;
  [key: string]: any;
}

const SOCKET_URL = "https://liberalconnect.org"; // Geralmente a URL base
const SOCKET_PATH = "/api/socket.io/"; // O path costuma incluir o prefixo da API se houver proxy

// Singleton do Socket para evitar múltiplas instâncias
export const socket: Socket = io(SOCKET_URL, {
  path: SOCKET_PATH,
  transports: ["websocket", "polling"], // Começa com polling por segurança e faz upgrade
  reconnectionAttempts: 10,
  reconnectionDelay: 2000,
  withCredentials: true,
  autoConnect: false,
  secure: true,
});

/**
 * Gerenciador de conexão robusto
 */
export const connectSocket = (userId: string) => {
  if (!userId) {
    console.warn("⚠️ Tentativa de conexão sem userId válida.");
    return;
  }

  // Se já estiver conectado com o mesmo usuário, não faz nada
  if (socket.connected && socket.io.opts.query?.userId === userId) {
    console.log("ℹ️ Socket já conectado para este usuário.");
    return;
  }

  // Limpa conexões pendentes antes de reiniciar
  if (socket.connected) {
    console.log("🔄 Reiniciando conexão para novo contexto de usuário...");
    socket.disconnect();
  }

  // Configurações dinâmicas
  socket.io.opts.query = { userId };
  
  console.log(`🔌 Iniciando conexão para o usuário: ${userId}`);
  socket.connect();
};

/**
 * Configuração de Listeners Globais 
 * (Evita duplicação de eventos usando .off() antes de .on())
 */
const setupSocketListeners = () => {
  socket.off("connect").on("connect", () => {
    console.log("%c✅ Socket Conectado!", "color: #2ecc71; font-weight: bold;", socket.id);
  });

  socket.off("connect_error").on("connect_error", (err) => {
    console.error("❌ Erro na Conexão Socket:", err.message);
    // Se o erro for 404, verifique se o 'path' no backend coincide com o do frontend
  });

  socket.off("order_call").on("order_call", (data: OrderCallData) => {
    console.log("📦 Chamada recebida:", data);
    alert(`CHAMADA RECEBIDA: ${data.id || 'Nova Ordem'}`);
  });

  socket.off("disconnect").on("disconnect", (reason) => {
    console.log(`🔌 Socket desconectado: ${reason}`);
    if (reason === "io server disconnect") {
      // O servidor forçou a desconexão, precisamos reconectar manualmente
      socket.connect();
    }
  });
};

// Inicializa os ouvintes uma única vez
setupSocketListeners();