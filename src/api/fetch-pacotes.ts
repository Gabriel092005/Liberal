import { api } from "@/lib/axios";

interface FetchPacotesResponse{
    id: number;
    preco: number;
    title: string;
    validade: string;
    beneficio1: string | null;
    beneficio2: string | null;
    beneficio3: string | null;
    created_at: Date;
}


export async function FetchPacotes(){
      const response  = await api.get<FetchPacotesResponse[]>("/pacotes")
      return response.data
}