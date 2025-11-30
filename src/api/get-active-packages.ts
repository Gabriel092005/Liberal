export interface HistoricoResponse {
  success: boolean;
  historico: HistoricoCarteira;
}

interface HistoricoCarteira {
  carteira: CarteiraInfo;
  pacotes_ativos: PacoteAtivo[];
  totalAtivo: number;
  saldo_livre: number;
}

export interface CarteiraInfo {
  id: number;
  saldo_atual: number;
}

export interface PacoteAtivo {
  nome: string;
  validade: string | null;
  total: number;
}
import { api } from "@/lib/axios";


export async function useHistoricoCarteira() {
      const { data } = await api.get<HistoricoResponse>('/get-active-packages');
      return data.historico;

}
