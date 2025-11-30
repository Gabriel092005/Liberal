import { api } from "@/lib/axios";

export interface CarteiraComUsuario {
  id: number;
  receita: number;
  created_at: Date;
  validade: string | null;
  usuarioId: number;

  usuario: {
    nome: string;
  };
}

export async function GetCarteira() {
     const response = await api.get<CarteiraComUsuario>("/get-carteira")
     localStorage.setItem("carteiraId", response.data.id.toString())
     return response.data
    
}