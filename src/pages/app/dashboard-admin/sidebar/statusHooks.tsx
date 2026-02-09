// src/hooks/use-pedidos-status.ts
import { getPedidosStatus } from "@/api/get-pedidoStatus";
import { useQuery } from "@tanstack/react-query";

export function usePedidosStatus() {
  return useQuery({
    queryKey: ["pedidos-status"],
    queryFn: getPedidosStatus,
    // Opcional: Atualiza a cada 30 segundos se não quiser confiar apenas no Socket
    refetchInterval: 1000 * 30, 
  });
}