import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Handshake,XCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent,  } from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/axios";
import { getInialts } from "@/lib/utils";
import { CallButton } from "@/pages/Buscar/callButton";

interface BotaoNegociarProps {
  onClick: () => Promise<any>;
  status: 'PENDING'|'INTERRUPTED'|'ACEPTED'|'CONFIRMED';
  isSucess: boolean;
  nome: string;
  celular: string;
  image_path: string | null;
}

export function BotaoNegociar({ onClick, status, celular, isSucess,image_path, nome }: BotaoNegociarProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const handleAction = async () => {
    try {
      setIsLoading(true);
      await onClick();
      setOpenModal(true); // Abre o modal apenas após a execução
      if (status) {
        toast.success("Solicitação enviada!");
      }
    } catch (error) {
      setOpenModal(true); // Abre para mostrar o erro
      toast.error("Não foi possível processar.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={handleAction}
        disabled={isLoading}
        className={`relative overflow-hidden flex items-center gap-2 px-6 py-5 rounded-2xl font-bold transition-all duration-500 shadow-lg active:scale-95 group
          ${isLoading 
            ? "bg-zinc-100 text-zinc-400 dark:bg-zinc-800" 
            : "bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20"
          }`}
      >
        {isLoading ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="flex items-center gap-2"
          >
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>Validando...</span>
          </motion.div>
        ) : (
          <>
            <Handshake className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Negociar</span>
          </>
        )}
      </Button>

      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="max-w-[320px] p-0 overflow-hidden border-none bg-white dark:bg-zinc-950 rounded-[2.5rem] shadow-2xl">
          <AnimatePresence mode="wait">
            {isSucess? (
              <motion.div
                key="success-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center"
              >
                {/* Header do Modal com Gradiente */}
                <div className="w-full h-24 bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center relative">
                  <div className="absolute -bottom-10">
                    <Avatar className="w-20 h-20 border-4 border-white dark:border-zinc-950 shadow-xl">
                      <AvatarImage src={`${api.defaults.baseURL}/uploads/${image_path}`} className="object-cover" />
                      <AvatarFallback className="text-xl font-bold bg-zinc-100">{getInialts(nome)}</AvatarFallback>
                    </Avatar>
                  </div>
                  <CheckCircle2 className="absolute top-4 right-4 text-white/50 w-6 h-6" />
                </div>

                {/* Conteúdo do Contato */}
                <div className="pt-12 pb-8 px-6 text-center w-full">
                  <h3 className="text-xl font-black text-zinc-800 dark:text-zinc-100 uppercase tracking-tighter">
                    {nome}
                  </h3>
                  <p className="text-sm text-zinc-500 font-medium mb-6">Cliente Verificado</p>
                  
                  {status==='ACEPTED'?(
                        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 mb-6 border border-zinc-100 dark:border-zinc-800">
                    <span className="text-xs text-zinc-400 uppercase font-bold tracking-widest block mb-1">Telemóvel</span>
                    <p className="text-lg font-mono font-bold text-zinc-700 dark:text-zinc-300 tracking-wider">
                      +244 {celular}
                    </p>
                     <div className="w-full">
                    <CallButton phoneNumber={celular} />
                  </div>
                  </div>
                  ):(
                     <div>
                             <div className="bg-zinc-50 dark:bg-zinc-900 rounded-2xl p-4 mb-6 border border-zinc-100 dark:border-zinc-800">
                    <span className="text-xs text-zinc-400 uppercase font-bold tracking-widest block mb-1">Telemóvel</span>
                    <p className="text-lg font-mono font-bold text-zinc-700 dark:text-zinc-300 tracking-wider">
                      Número Indisponivél, aguarde o cliente confirmar
                    </p>
                  </div>
                     </div>
                  )}

                 
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="error-content"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-8 flex flex-col items-center text-center"
              >
                <div className="w-16 h-16 bg-red-50 dark:bg-red-950/30 rounded-full flex items-center justify-center mb-4">
                  <XCircle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="font-bold text-lg text-zinc-800 dark:text-zinc-200">Ops! Algo falhou</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2 leading-relaxed">
                  Verifique se possui <span className="text-orange-600 font-bold">créditos suficientes</span> ou se já enviou uma proposta para este pedido.
                </p>
                <Button 
                  onClick={() => setOpenModal(false)}
                  variant="outline" 
                  className="mt-6 w-full rounded-xl border-zinc-200 dark:border-zinc-800"
                >
                  Entendi
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </DialogContent>
      </Dialog>
    </>
  );
}