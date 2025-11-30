import { api } from "@/lib/axios";

// Tipos auxiliares para enums
; // ajuste o caminho conforme o seu projeto

export interface Prestador {
  id: number;
  nome: string;
  celular: string;
  image_path:string,
  profissao:string,
  estrelas: number | null;
  provincia: string;
  municipio: string;
}

export interface Interessado {
  id: number;
  prestadorId: number;
  pedidoId: number;
  status: 'PENDING'|'INTERRUPTED'|'ACEPTED';
  prestador: Prestador;
}[]

export interface Pedido {
  id: number;
  title: string;
  content: string;
  image_path: string | null;
  brevidade: 'MEDIO'|'URGENTE'|'BAIXO';
  status: 'PENDING'|'INTERRUPTED'|'ACEPTED';
  location: string;
  latitude: number;
  longitude: number;
  created_at: Date;
  usuarioId: number;
  interessados: Interessado[];
  _count: {
    interessados: number;
  };
}

    interface SearchOrdersByContentOrTitleReques{
        query:string|null
    }

// Tipagem final para orders
export type Orders = Pedido[];

export async  function CostumerOrders({query}:SearchOrdersByContentOrTitleReques){
   const response = await api.get<Orders>("/MyOrders/",{
    params:{
      query
    }
   })
   return response.data
}