import { InteressarPedidos } from "@/api/interessar-pedido";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { connectSocket, socket } from "@/lib/socket";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, MapPin, Phone, PhoneOff, ShieldCheck } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

const ringtone = new Audio("https://assets.mixkit.co/active_storage/sfx/2357/2357-preview.mp3");
export function OrderCallSystem() {
  const [incomingOrder, setIncomingOrder] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Função para parar chamada e limpar persistência
  const stopCall = useCallback(() => {
    ringtone.pause();
    ringtone.currentTime = 0;
    setIncomingOrder(null);
    setIsProcessing(false);
    localStorage.removeItem("@liberal:active_call"); // Limpa o "cache" da chamada
  }, []);

  // 1. Persistência: Recupera do localStorage ao montar o componente
  useEffect(() => {
    const savedOrder = localStorage.getItem("@liberal:active_call");
    if (savedOrder) {
      try {
        setIncomingOrder(JSON.parse(savedOrder));
        // Tenta tocar o som (navegadores podem bloquear sem interação prévia)
        ringtone.loop = true;
        ringtone.play().catch(() => console.log("Som aguardando interação do usuário."));
      } catch (e) {
        localStorage.removeItem("@liberal:active_call");
      }
    }

    const userId = localStorage.getItem("@liberal:userId");
    if (userId) connectSocket(userId);

    socket.on("order_call", (order: any) => {
      setIncomingOrder(order);
      localStorage.setItem("@liberal:active_call", JSON.stringify(order)); // Salva para o F5
      ringtone.loop = true;
      ringtone.play().catch(() => console.log("Interação necessária para áudio"));
    });

    socket.on("order_taken", (data: any) => {
      // Se o pedido que sumiu for o que estou vendo, fecho o modal
      const currentOrder = JSON.parse(localStorage.getItem("@liberal:active_call") || "{}");
      if (currentOrder?.id === data.orderId) {
        toast.info("Outro prestador foi mais rápido!");
        stopCall();
      }
    });

    return () => {
      socket.off("order_call");
      socket.off("order_taken");
    };
  }, [stopCall]);

  const { mutateAsync: SeInteressar } = useMutation({
    mutationFn: () => InteressarPedidos({ pedidoId: incomingOrder?.id }),
    onSuccess: () => {
      toast.success("Serviço atribuído a você com sucesso!");
      setTimeout(stopCall, 2000);
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Oops! Este pedido já foi aceito.";
      toast.error(message);
      stopCall();
    },
  });

  const handleDecision = async (status: 'accept' | 'reject') => {
    if (status === 'reject') {
      stopCall();
      return;
    }

    try {
      setIsProcessing(true);
      await SeInteressar();
      socket.emit("respond_to_order", { 
        orderId: incomingOrder.id, 
        status: 'accepted' 
      });
    } catch (err) {
      // Tratado no mutation
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={!!incomingOrder} onOpenChange={() => {}}>
      <DialogContent 
        // Responsividade aprimorada: w-[95vw] para mobile e max-w para desktop
        className="w-[92vw] max-w-[360px] p-0 overflow-hidden border-none dark:bg-zinc-950 rounded-[2.5rem] md:rounded-[3rem] shadow-[0_0_100px_rgba(249,115,22,0.3)] outline-none"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <AnimatePresence>
          {incomingOrder && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col"
            >
              {/* Header */}
              <div className="w-full h-36 md:h-40 bg-gradient-to-b from-orange-500/20 to-transparent flex flex-col items-center justify-center relative pt-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20" />
                  <div className="relative bg-orange-500 p-5 md:p-6 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.6)]">
                    <Phone className="text-white  animate-bounce" size={28} />
                  </div>
                </div>
                
                <div className="mt-4 text-center">
                   <div className="flex items-center gap-1.5 justify-center mb-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Oportunidade</span>
                   </div>
                   <h2 className="dark:text-white text-muted-foreground-black text-lg md:text-xl uppercase italic">Novo Pedido</h2>
                </div>
              </div>

              {/* Conteúdo */}
              <div className="px-5 pb-6 md:px-6 md:pb-8">
                <div className="bg-white/5 border border-white/10 rounded-[2rem] p-5 mb-6 backdrop-blur-md">
                   <h3 className="dark:text-white  text-center font-bold text-base md:text-lg mb-4 line-clamp-2 italic">
                     "{incomingOrder.title}"
                   </h3>

                   <div className="space-y-3">
                      <div className="flex items-center gap-3">
                         <div className="bg-orange-500/20 p-2 rounded-xl shrink-0">
                            <MapPin size={16} className="text-orange-500" />
                         </div>
                         <div className="min-w-0">
                            <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-tighter">Localização</p>
                            <p className="dark:text-white text-xs font-bold truncate">{incomingOrder.location}</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-3">
                         <div className="bg-emerald-500/20 p-2 rounded-xl shrink-0">
                            <ShieldCheck size={16} className="text-emerald-500" />
                         </div>
                         <div>
                            <p className="text-[8px] text-zinc-500 font-bold uppercase tracking-tighter">Status</p>
                            <p className="dark:text-white text-xs font-bold">Pagamento Seguro</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Botões */}
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  <button
                    disabled={isProcessing}
                    onClick={() => handleDecision('reject')}
                    className="h-16 md:h-20 rounded-[1.5rem] md:rounded-[2rem] bg-zinc-900 border border-white/5 flex flex-col items-center justify-center group active:scale-95 transition-all"
                  >
                    <PhoneOff size={20} className="text-zinc-500 group-hover:text-red-500" />
                    <span className="text-[9px] font-bold text-zinc-500 mt-1 uppercase">Recusar</span>
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={() => handleDecision('accept')}
                    className={`h-16 md:h-20 rounded-[1.5rem] md:rounded-[2rem] flex flex-col items-center justify-center transition-all active:scale-95
                      ${isProcessing ? 'bg-zinc-800' : 'bg-orange-500 hover:bg-orange-600'}`}
                  >
                    {isProcessing ? (
                      <Loader2 className="text-orange-500 animate-spin" size={20} />
                    ) : (
                      <>
                        <Check size={24} strokeWidth={4} className="text-white" />
                        <span className="text-[9px] font-bold text-white uppercase">Trabalhar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}