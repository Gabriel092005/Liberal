// src/api/get-pedidos-status.ts
import { api } from "@/lib/axios";
export interface PrestadorInfo {
    nome: string;
    foto: string | null;
  }
  
  export interface PedidoPendenteInfo {
    id: number;
    titulo: string;
    totalInteressados: number;
    mensagem: string;
    statusPedido: 'CONFIRMED' | 'INTERRUPTED'|'PENDING';
    prestadoresEncontrados: PrestadorInfo[];
  }
  
  export interface RespostaPedidosPendentes {
    quantidadeTotal: number;
    pedidos: PedidoPendenteInfo[];
  }

export async function getPedidosStatus() {
  const response = await api.get<RespostaPedidosPendentes>("/pedidos/status");
  return response.data;
}