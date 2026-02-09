import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { connectSocket, socket } from "@/lib/socket";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Ban, Check, Loader2, MessageSquare, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// --- Funções de API ---
interface OrderActionRequest {
  pedidoId: number;
  prestadorId: number;
}

export async function AcceptOrders({ pedidoId, prestadorId }: OrderActionRequest) {
  await api.put("/fechar", { pedidoId, prestadorId });
}

export async function InterruptOrders({ pedidoId, prestadorId }: OrderActionRequest) {
  await api.put("/interromper", { pedidoId, prestadorId });
}

const notificationSound = new Audio("https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3");

export function NegotiationPopUp() {
  const [negotiator, setNegotiator] = useState<any>(null);

  const closeNegotiation = useCallback(() => {
    notificationSound.pause();
    notificationSound.currentTime = 0;
    setNegotiator(null);
    localStorage.removeItem("@liberal:active_negotiation");
  }, []);

  // --- Mutations ---
  
  // 1. Confirmar/Aceitar Pedido
  const { mutateAsync: handleAccept, isPending: isAccepting } = useMutation({
    mutationFn: () => AcceptOrders({ 
      pedidoId: negotiator?.pedidoId, 
      prestadorId: negotiator?.prestadorId 
    }),
    onSuccess: () => {
      toast.success("Negociação confirmada.Aguarde que o profissional entre em contacto");
      closeNegotiation();
    },
    onError: () => toast.error("Erro ao confirmar negociação.")
  });

  // 2. Interromper/Recusar Proposta
  const { mutateAsync: handleInterrupt, isPending: isInterrupting } = useMutation({
    mutationFn: () => InterruptOrders({ 
      pedidoId: negotiator?.pedidoId, 
      prestadorId: negotiator?.prestadorId 
    }),
    onSuccess: () => {
      toast.info("Proposta interrompida.");
      closeNegotiation();
    },
    onError: () => toast.error("Erro ao interromper.")
  });

  useEffect(() => {
    const savedNegotiation = localStorage.getItem("@liberal:active_negotiation");
    if (savedNegotiation) {
      try {
        setNegotiator(JSON.parse(savedNegotiation));
      } catch (e) {
        localStorage.removeItem("@liberal:active_negotiation");
      }
    }

    const userId = localStorage.getItem("@liberal:userId");
    if (userId) connectSocket(userId);

    const handleNovoInteressado = (data: any) => {
      setNegotiator(data);
      localStorage.setItem("@liberal:active_negotiation", JSON.stringify(data));
      notificationSound.play().catch(() => {});
    };

    socket.on("novo_interessado", handleNovoInteressado);
    return () => { socket.off("novo_interessado", handleNovoInteressado); };
  }, []);

  if (!negotiator) return null;

  const isProcessing = isAccepting || isInterrupting;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="fixed bottom-6 right-6 z-[10000] w-[92vw] max-w-[360px] bg-white dark:bg-zinc-950 shadow-[0_20px_60px_rgba(0,0,0,0.5)] rounded-[2.5rem] border border-zinc-100 dark:border-zinc-800 p-6"
      >
        <div className="flex justify-between items-start mb-4">
          <div className="bg-orange-500/10 px-3 py-1 rounded-full flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-orange-500 text-[9px] font-black uppercase tracking-widest">Proposta Recebida</span>
          </div>
          <button onClick={closeNegotiation} disabled={isProcessing} className="text-zinc-400 hover:text-zinc-200">
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-4 mb-5">
          <Avatar className="w-14 h-14 rounded-2xl border-2 border-orange-500">
            <AvatarImage src={negotiator.foto ? `${api.defaults.baseURL}/uploads/${negotiator.foto}` : ""} />
            <AvatarFallback>{negotiator.nome?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-black text-zinc-800 dark:text-zinc-100 text-sm">{negotiator.nome}</h4>
            <p className="text-[10px] text-orange-500 font-bold uppercase">{negotiator.profissao || "Prestador"}</p>
          </div>
        </div>

        {/* Botões de Ação Principal */}
        <div className="grid grid-cols-2 gap-3 mb-3">
          <Button 
            variant="outline"
            disabled={isProcessing}
            onClick={() => handleInterrupt()}
            className="rounded-2xl h-14 border-zinc-200 dark:border-zinc-800 font-bold text-xs gap-2 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500"
          >
            {isInterrupting ? <Loader2 className="animate-spin" size={16} /> : <Ban size={16} />}
            Cancelar
          </Button>

          <Button 
            disabled={isProcessing}
            onClick={() => handleAccept()}
            className="rounded-2xl h-14 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs gap-2 shadow-lg"
          >
            {isAccepting ? <Loader2 className="animate-spin" size={16} /> : <Check size={18} strokeWidth={3} />}
            Confirmar
          </Button>
        </div>

        {/* Botão Secundário para abrir Chat */}
        <Button 
          variant="ghost"
          disabled={isProcessing}
          className="w-full rounded-2xl h-12 text-zinc-500 font-bold text-xs gap-2"
          onClick={() => {
             // Lógica para abrir o chat específico
             console.log("Abrir chat com:", negotiator.prestadorId);
          }}
        >
          <MessageSquare size={16} />
          Conversar Primeiro
        </Button>
      </motion.div>
    </AnimatePresence>
  );
}