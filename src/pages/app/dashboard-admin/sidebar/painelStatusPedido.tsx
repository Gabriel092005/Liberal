
import { Loader2, Search } from "lucide-react";
import { usePedidosStatus } from "./statusHooks";

export function PainelStatusPedidos() {
  const { data, isLoading, isError } = usePedidosStatus();

  if (isLoading) return <Loader2 className="animate-spin" />;
  if (isError) return <p>Erro ao carregar pedidos.</p>;

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-xl font-bold">Seus Pedidos ({data?.quantidadeTotal})</h2>
      
      {data?.pedidos.map((pedido) => (
        <div key={pedido.id} className="border rounded-lg p-4 bg-white shadow-sm">
          <h3 className="font-semibold text-lg">{pedido.titulo}</h3>
          <p className="text-sm text-zinc-600 mb-4">{pedido.mensagem}</p>

          {pedido.totalInteressados === 0 ? (
            // ESTADO: PROCURANDO (Animação de Radar)
            <div className="flex flex-col items-center py-6 bg-zinc-50 rounded-md">
              <div className="relative">
                <Search className="h-8 w-8 text-orange-500 animate-bounce" />
                <span className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping" />
              </div>
              <p className="mt-4 text-xs font-medium text-orange-600">
                Analisando prestadores próximos...
              </p>
            </div>
          ) : (
            // ESTADO: ENCONTRADO (Lista de Fotos)
            <div className="flex gap-2 overflow-x-auto py-2">
              {pedido.prestadoresEncontrados.map((p, idx) => (
                <div key={idx} className="flex flex-col items-center min-w-[80px]">
                  <img 
                    src={p.foto ?? "/default-avatar.png"} 
                    className="h-12 w-12 rounded-full border-2 border-green-500"
                    alt={p.nome}
                  />
                  <span className="text-[10px] mt-1 font-bold">{p.nome}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}