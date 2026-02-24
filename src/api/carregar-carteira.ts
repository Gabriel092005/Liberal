import { api } from "@/lib/axios";

export interface CarregarCarteiraRequest {
  metodo:   string;
  valor:    number;
  walletId: number;
  planoId:  number;
}

/**
 * Única função que chama /pagar.
 * NÃO chamar api.post("/pagar") separadamente no componente — causaria duplo pedido.
 */
export async function assinarPacote(data: CarregarCarteiraRequest) {
  try {
    const response = await api.post("/pagar", data);
    // Garante que response e response.data existem antes de retornar
    return response?.data ?? null;
  } catch (err: any) {
    // Log completo para debug — aparece no DevTools Console
    console.error("[assinarPacote] status:", err?.response?.status);
    console.error("[assinarPacote] body:",   err?.response?.data);
    console.error("[assinarPacote] msg:",    err?.message);
    // Re-lança para o onError do useMutation tratar correctamente
    throw err;
  }
}