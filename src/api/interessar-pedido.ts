import { api } from "@/lib/axios";

interface InteressarPedidosResponse{
    id: number;
    prestadorId: number;
    pedidoId: number;
    status: 'PENDING'|'INTERRUPTED'|'ACEPTED'
}

interface InteressarPedidosRequest{
    pedidoId:number
}

export async function InteressarPedidos({pedidoId}:InteressarPedidosRequest){
      const response = await api.post<InteressarPedidosResponse>("/interesse", {pedidoId})
      return response.data
    
}