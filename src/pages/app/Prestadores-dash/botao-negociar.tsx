import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Handshake, BellRing } from "lucide-react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/axios";
import { getInialts } from "@/lib/utils";
import { CallButton } from "@/pages/Buscar/callButton";

interface BotaoNegociarProps {
  /** Função assíncrona executada ao clicar no botão */
  onClick: () => Promise<any>;
  isSuccess:boolean
  nome:string,
  celular:string,
  image_path:string | null,


  // profile :{
  //     usuario:Usuario
  // }

}

/**
 * Componente de botão para iniciar negociação.
 * Exibe feedback visual e desabilita apenas o botão clicado.
 */
export function BotaoNegociar({ onClick, isSuccess,celular,image_path,nome  }: BotaoNegociarProps) {

  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);


  const handleClick = async () => {
    try {
      setIsLoading(true);
      await onClick(); // executa a ação async passada pelo pai

      setShowConfirmDialog(true);
      setTimeout(() => setShowConfirmDialog(false), 1500);
      toast.success("Negociação enviada com sucesso!");
    } catch (error) {
      console.error("Erro ao negociar:", error);
      // toast.error("Erro ao negociar. Tente novamente.");
    } finally {
        
      setIsLoading(false);
    }
  };

  return (
   <>
 <Dialog>
    <DialogTrigger>
         <Button
      onClick={handleClick}
      disabled={isLoading}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 shadow-md
        ${isLoading 
          ? "opacity-70 cursor-not-allowed bg-yellow-500 hover:bg-yellow-500" 
          : "active:scale-[0.97]"
        } text-white`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Processando...</span>
        </>
      ) : (
        <>
          <Handshake className="w-4 h-4" />
          <span>Negociar</span>
        </>
      )}
    </Button>
    </DialogTrigger>

     <DialogContent className="max-w-[250px] bg-white/90 dark:bg-black backdrop-blur-md shadow-xl border border-orange-200 flex flex-col items-center justify-center py-6">
        {isSuccess && (
            <AnimatePresence>
 
              <motion.div
                key="confirm"

                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: [0.8, 1.2, 1] }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="flex flex-col items-center justify-center text-center"
              >
              <div className="flex flex-col justify-center items-center">
                  <Avatar>
                    <AvatarFallback>{getInialts(nome)}</AvatarFallback>
                      <AvatarImage src={`${api.defaults.baseURL}/uploads/${image_path}`}></AvatarImage>
                  </Avatar>
                  <div>
                       <p className="mt-3 text-sm font-semibold text-muted-foreground">
                     {nome}
                </p>
                  <div className="flex justify-center flex-col items-center">
                      <p> +244{celular}</p>
                <Button>
                  <CallButton phoneNumber={celular}></CallButton>
                </Button>
                  </div>
                  </div>
              </div>
            
             
              </motion.div>
       
          </AnimatePresence>
        )}
        {isSuccess === false  && (
           <div className="flex items-center flex-col">
               <BellRing className="text-red-500"></BellRing>
               <p className="text-muted-foreground">Alguma coisa deu errado!</p>
               <p className="text-xs text-red-400">Por favor verifique se tens saldo na sua conta ou se já não negociou neste pedido.</p>
           </div>

        )}
        </DialogContent>
 </Dialog>
  
    
            <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
       
        </Dialog>

     
    </>
  )
}
