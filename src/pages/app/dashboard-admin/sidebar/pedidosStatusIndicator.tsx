import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/axios";
import { socket } from "@/lib/socket";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, Check, Clock, Loader2, SearchX, X } from "lucide-react";
import { useEffect, useState } from "react";

// --- Interfaces ---
export interface PrestadorInfo {
  id: number;
  nome: string;
  foto: string | null;
}

export interface PedidoPendenteInfo {
  id: number;
  titulo: string;
  statusPedido: 'CONFIRMED' | 'INTERRUPTED' | 'PENDING';
  prestadoresEncontrados: PrestadorInfo[];
}

export interface RespostaPedidosPendentes {
  quantidadeTotal: number;
  pedidos: PedidoPendenteInfo[];
}

// --- Funções de API ---
const PedidoService = {
  getStatus: async (): Promise<RespostaPedidosPendentes> => {
    const response = await api.get("/pedidos/status");
    return response.data;
  },
  aceitar: async (pedidoId: number, prestadorId: number) => {
    return await api.put("/fechar", { pedidoId, prestadorId });
  },
  interromper: async (pedidoId: number, prestadorId: number) => {
    return await api.put("/interromper", { pedidoId, prestadorId });
  }
};

export function PedidoStatusIndicator() {
  const queryClient = useQueryClient();
  const [isSearchingLongTime, setIsSearchingLongTime] = useState(false);
  
  // Busca o status dos pedidos a cada 10 segundos
  const { data: orders, isLoading } = useQuery({
    queryKey: ["pedidos-status"],
    queryFn: PedidoService.getStatus,
    refetchInterval: 10000,
  });

  const temQualquerPedido = (orders?.quantidadeTotal ?? 0) > 0;
  const pedidosComProfissionais = orders?.pedidos.filter(p => p.prestadoresEncontrados?.length > 0) || [];
  const temInteressados = pedidosComProfissionais.length > 0;

  // Lógica de Timer para mensagens automáticasj
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (temQualquerPedido && !temInteressados) {
      timer = setTimeout(() => setIsSearchingLongTime(true), 12000); // 12 seg para trocar p/ Caso 2
    } else {
      setIsSearchingLongTime(false);
    }
    return () => clearTimeout(timer);
  }, [temQualquerPedido, temInteressados]);

  // Sockets para atualização em tempo real
  useEffect(() => {
    socket.on("novo_interessado", () => {
      queryClient.invalidateQueries({ queryKey: ["pedidos-status"] });
    });
    return () => { socket.off("novo_interessado"); };
  }, [queryClient]);

  // Mutações
  // const { mutate: handleAceitar, isPending: isAccepting } = useMutation({
  //   mutationFn: ({ pId, prId }: { pId: number; prId: number }) => PedidoService.aceitar(pId, prId),
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["pedidos-status"] });
  //     toast.success("Profissional contratado!");
  //   }
  // });

  const { mutate: handleInterromper} = useMutation({
    mutationFn: ({ pId, prId }: { pId: number; prId: number }) => PedidoService.interromper(pId, prId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["pedidos-status"] })
  });

  if (!temQualquerPedido && !isLoading) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <motion.div 
          whileHover={{ y: -2 }} 
          className="relative flex items-center gap-3 px-5 py-3 bg-white dark:bg-zinc-900 border dark:border-zinc-800 rounded-full shadow-lg cursor-pointer group"
        >
          {temInteressados && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-orange-500 border-2 border-white dark:border-zinc-950"></span>
            </span>
          )}
          <div className={`p-2 rounded-full text-white transition-colors ${temInteressados ? 'bg-green-500' : 'bg-orange-500'}`}>
            <Briefcase size={16} className={temInteressados ? "animate-bounce" : ""} />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-nowrap uppercase tracking-tighter">
              {temInteressados ? "Candidatos Encontrados" : "Procura Ativa"}
            </span>
            <span className="text-[9px] text-muted-foreground font-medium uppercase">
              {temInteressados ? "Clique para Ver" : "Rastreando..."}
            </span>
          </div>
        </motion.div>
      </DialogTrigger>

      <DialogPortal>
        <DialogOverlay className="fixed inset-0 z-[10000] bg-black/60 backdrop-blur-sm" />
        <DialogContent className="fixed left-[50%] top-[50%] z-[10001] w-[95%] max-w-[450px] translate-x-[-50%] translate-y-[-50%] rounded-[2.5rem] p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-zinc-950">
          
          <div className={`${temInteressados ? 'bg-green-600' : 'bg-orange-500'} p-6 text-white transition-colors duration-500`}>
            <DialogHeader>
              <DialogTitle className="text-xl font-black flex items-center gap-2 uppercase tracking-tight">
                {temInteressados ? <Check /> : <Loader2 className="animate-spin" />}
                Status do Pedido
              </DialogTitle>
              <p className="text-white/80 text-[11px] font-bold uppercase mt-1 tracking-wider">
                {temInteressados 
                  ? "Encontrámos profissionais disponíveis perto de si." 
                  : "Aguarde enquanto rastreamos a sua área."}
              </p>
            </DialogHeader>
          </div>

          <ScrollArea className="h-[400px] p-6">
            <AnimatePresence mode="wait">
              {temInteressados ? (
                // --- CASO 1: LISTA DE CANDIDATOS ---
                <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                  <div className="text-center p-3 bg-green-50 dark:bg-green-500/10 rounded-2xl border border-green-200 dark:border-green-500/20">
                    <p className="text-[10px] font-black text-green-600 uppercase">Aguarde as respostas dos profissionais abaixo.</p>
                  </div>
                  {pedidosComProfissionais.map((pedido) => (
                    <div key={pedido.id} className="space-y-3">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase ml-2">{pedido.titulo}</p>
                      {pedido.prestadoresEncontrados.map((prestador) => (
                        <div key={prestador.id} className="flex items-center justify-between p-3 bg-zinc-50 dark:bg-zinc-900 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                          <div className="flex items-center gap-3">
                            <img 
                              src={prestador.foto ? `${api.defaults.baseURL}/uploads/${prestador.foto}` : "/avatar.png"} 
                              className="w-10 h-10 rounded-full object-cover" 
                            />
                            <p className="text-sm font-bold">{prestador.nome}</p>
                          </div>
                           <div className="flex gap-2">
                            <Button size="icon" variant="ghost" onClick={() => handleInterromper({ pId: pedido.id, prId: prestador.id })} className="rounded-full hover:bg-red-50 hover:text-red-500">
                              <X size={18} />
                            </Button>
                            {/* <Button size="icon" onClick={() => handleAceitar({ pId: pedido.id, prId: prestador.id })} className="rounded-full bg-zinc-900 dark:bg-green-600">
                              <Check size={18} />
                            </Button> */}
                          </div> 
                        </div>
                      ))}
                    </div>
                  ))}
                </motion.div>
              ) : (
                // --- CASO 2: RADAR / NÃO ENCONTRADO ---
                <motion.div key="radar" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="relative w-20 h-20 mb-6">
                    <div className={`absolute inset-0 rounded-full animate-ping ${isSearchingLongTime ? 'bg-zinc-400/20' : 'bg-orange-500/20'}`} />
                    <div className={`relative w-full h-full rounded-full flex items-center justify-center border-4 border-white dark:border-zinc-900 shadow-lg ${isSearchingLongTime ? 'bg-zinc-100 dark:bg-zinc-800' : 'bg-orange-500'}`}>
                      {isSearchingLongTime ? <SearchX className="text-zinc-400" /> : <Briefcase className="text-white animate-pulse" />}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-black uppercase tracking-tight">
                      {isSearchingLongTime ? "Busca em Espera" : "Procurando..."}
                    </h3>
                    <p className="text-xs text-zinc-500 font-medium px-6 leading-relaxed">
                      {!isSearchingLongTime 
                        ? "Estamos a procurar profissionais disponíveis perto de si. Aguarde um momento."
                        : "Não encontrámos profissionais disponíveis de imediato. Vamos continuar a procurar, aguarde, por favor."}
                    </p>
                  </div>

                  {isSearchingLongTime && (
                    <div className="mt-6 flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-500/5 rounded-full text-orange-600 border border-orange-100 dark:border-orange-500/10 animate-pulse">
                      <Clock size={14} />
                      <span className="text-[9px] font-black uppercase">O sistema avisará assim que houver retorno</span>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </ScrollArea>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}