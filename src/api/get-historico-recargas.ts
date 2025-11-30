import { api } from "@/lib/axios";

export interface HistoricoRecarga {
  id: number;
  valor: string; // Prisma retorna Decimal como string
  pacoteId: number;
  carteiraId: number;
  catergoy : 'OUTCOME'|'INCOME'
  transacaoId: number | null;
  created_at: string;

  pacote: Pacote;
  transacao: Transacao | null;
}

export interface Pacote {
  id: number;
  preco: string;
  title: string;
  validade: string;
  beneficio1: string | null;
  beneficio2: string | null;
  beneficio3: string | null;
  created_at: string;
}

export interface Transacao {
  id: number;
  usuarioId: number;
  pacoteId: number;
  carteiraId: number;
  valor: string;
  metodo: string;
  status: string;
  referencia: string | null;
  created_at: string;
  atualizado_em: string;
}

export type HistoricoRecargasResponse = HistoricoRecarga[];
export async function GetHistorico({carteiraId}:{carteiraId:number}) {
     const response = await api.get<HistoricoRecargasResponse>("/historico/recargas/",{
        params:{
            carteiraId
        }
     })
     return response.data
    
}