import { InteressarPedidos } from "@/api/interessar-pedido";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { connectSocket, socket } from "@/lib/socket";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, MapPin, Phone, PhoneOff, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

// Função de API para registrar o interesse/negociação


const ringtone = new Audio("https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3");

export function OrderCallSystem() {
  const [incomingOrder, setIncomingOrder] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  console.log(incomingOrder)

  // 1. Configuração da Mutação Real
  const { mutateAsync: SeInteressar } = useMutation({
    mutationFn: () => InteressarPedidos({pedidoId:incomingOrder.id}),
    onSuccess: () => {
      toast.success("Serviço atribuído a você com sucesso!");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Oops! Este pedido já foi aceito ou você não tem créditos.";
      toast.error(message);
      stopCall();
    },
  });

  useEffect(() => {
    const userId = localStorage.getItem("@liberal:userId");
    if (userId) connectSocket(userId);

    socket.on("order_call", (order: any) => {
      setIncomingOrder(order);
      ringtone.loop = true;
      ringtone.play().catch(() => console.log("Interação necessária para áudio"));
    });

    socket.on("order_taken", (data: any) => {
      if (incomingOrder?.id === data.orderId) {
        toast.info("Outro prestador foi mais rápido!");
        stopCall();
      }
    });

    return () => {
      socket.off("order_call");
      socket.off("order_taken");
    };
  }, [incomingOrder]);

  const stopCall = () => {
    ringtone.pause();
    ringtone.currentTime = 0;
    setIncomingOrder(null);
    setIsProcessing(false);
  };

  const handleDecision = async (status: 'accept' | 'reject') => {
    if (status === 'reject') {
      stopCall();
      return;
    }

    try {
      setIsProcessing(true);
      
      // 2. Executa a negociação real no Banco de Dados
      await SeInteressar(incomingOrder.id);

      // 3. Informa ao Socket que você aceitou (para remover dos outros)
      socket.emit("respond_to_order", { 
        orderId: incomingOrder.id, 
        status: 'accepted' 
      });

      // Pequeno delay para o usuário ver o feedback de sucesso
      setTimeout(stopCall, 2000);
      
    } catch (err) {
      // Erro já tratado no onError da mutation
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={!!incomingOrder} onOpenChange={() => {}}>
      <DialogContent 
        className="max-w-[340px] p-0 overflow-hidden border-none bg-zinc-950 rounded-[3rem] shadow-[0_0_100px_rgba(249,115,22,0.3)]"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <AnimatePresence>
          {incomingOrder && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col"
            >
              {/* Header com Efeito Radar */}
              <div className="w-full h-40 bg-gradient-to-b from-orange-500/20 to-transparent flex flex-col items-center justify-center relative pt-6">
                <div className="relative">
                  <div className="absolute inset-0 bg-orange-500 rounded-full animate-ping opacity-20" />
                  <div className="relative bg-orange-500 p-6 rounded-full shadow-[0_0_30px_rgba(249,115,22,0.6)]">
                    <Phone className="text-white animate-bounce" size={36} />
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                   <div className="flex items-center gap-1.5 justify-center mb-1">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Oportunidade Real</span>
                   </div>
                   <h2 className="text-white font-black text-xl uppercase tracking-tighter italic">Chamada de Serviço</h2>
                </div>
              </div>

              {/* Conteúdo do Pedido */}
              <div className="px-6 pb-8">
                <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-6 mb-8 backdrop-blur-md">
                   <h3 className="text-white text-center font-black text-lg mb-4 line-clamp-2 italic">
                      "{incomingOrder.title}"
                   </h3>

                   <div className="space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="bg-orange-500/20 p-2 rounded-xl">
                            <MapPin size={18} className="text-orange-500" />
                         </div>
                         <div>
                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Destino</p>
                            <p className="text-white text-xs font-bold">{incomingOrder.location}</p>
                         </div>
                      </div>

                      <div className="flex items-center gap-3">
                         <div className="bg-emerald-500/20 p-2 rounded-xl">
                            <ShieldCheck size={18} className="text-emerald-500" />
                         </div>
                         <div>
                            <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Segurança</p>
                            <p className="text-white text-xs font-bold">Pagamento Verificado</p>
                         </div>
                      </div>
                   </div>
                </div>

                {/* Botões de Ação */}
                <div className="grid grid-cols-2 gap-4">
                  <button
                    disabled={isProcessing}
                    onClick={() => handleDecision('reject')}
                    className="h-20 rounded-[2rem] bg-zinc-900 border border-white/5 hover:bg-zinc-800 transition-all flex flex-col items-center justify-center group active:scale-95"
                  >
                    <PhoneOff size={24} className="text-zinc-500 group-hover:text-red-500" />
                    <span className="text-[9px] font-bold text-zinc-500 mt-1 uppercase">Ignorar</span>
                  </button>

                  <button
                    disabled={isProcessing}
                    onClick={() => handleDecision('accept')}
                    className={`h-20 rounded-[2rem] flex flex-col items-center justify-center transition-all shadow-xl active:scale-95 overflow-hidden
                      ${isProcessing ? 'bg-zinc-800 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'}`}
                  >
                    {isProcessing ? (
                      <div className="flex flex-col items-center">
                        <Loader2 className="text-orange-500 animate-spin" size={24} />
                        <span className="text-[9px] font-bold text-zinc-400 mt-1 uppercase">Validando...</span>
                      </div>
                    ) : (
                      <>
                        <Check size={32} strokeWidth={4} className="text-white" />
                        <span className="text-[9px] font-bold text-white uppercase">Atender</span>
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