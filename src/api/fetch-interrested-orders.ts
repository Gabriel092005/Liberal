import { api } from "@/lib/axios";

export interface PedidoComDetalhes {
  id: number;
  created_at: Date;
  status: 'PENDING'|'INTERRUPTED'|'ACEPTED';
  title: string;
  content: string;
  accepted:boolean
  image_path: string | null;
  brevidade: 'BAIXO'|'URGENTE'|'NORMAL';
  location: string;
  autor:{
    id:number;
    celular:string
    provincia:string
    nome:string
    municipio:string
    image_path:string|null
  }
  latitude: number;
  longitude: number;
  usuarioId: number;
}
export interface InteresseComPedidoResponse {
  id: number;
  prestadorId: number;
  pedidoId: number;
  status: 'PENDING'|'INTERRUPTED'|'ACEPTED';
  pedido: PedidoComDetalhes;
}

export async function  InterestedOrdersPrestadores(){
     const response = await api.get<InteresseComPedidoResponse[]>('/interrested-orders')
     return response.data
}



