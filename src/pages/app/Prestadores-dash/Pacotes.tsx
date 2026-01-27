import { assinarPacote } from "@/api/carregar-carteira";
import { FetchPacotes } from "@/api/fetch-pacotes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronRight, Loader, ShieldCheck, Timer, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
  }).format(value).replace("AOA", "Kz");
};

export function Package() {
  const { data: planos, isLoading } = useQuery({
    queryKey: ["pacotes"],
    queryFn: FetchPacotes,
  });

  const [selectedPlano, setSelectedPlano] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState<string>("");
  const [referenciaGerada, setReferenciaGerada] = useState<string | null>(null);

  const { mutateAsync: submeterPedido, isPending: isSubmitting } = useMutation({
    mutationFn: async ({ planoId, referencia, valor }: any) => {
      await assinarPacote({ metodo: "Referencia", pacoteId: planoId });
      return await api.post("/pagamentos/confirmar", { planoId, referencia, valor });
    },
    onSuccess: () => {
      toast.success("Pedido submetido com sucesso!");
      setDialogOpen(false);
      setReferenciaGerada(null);
    },
    onError: () => toast.error("Erro ao processar pagamento."),
  });

  if (isLoading) return <LoadingGrid />;

  return (
    <div className="fixed inset-0 flex flex-col w-full h-screen bg-zinc-50 dark:bg-zinc-950 overflow-hidden font-sans">
      {/* CONTAINER CENTRALIZADOR 
          Garante que o conteúdo nunca "escape" e fique sempre harmonioso 
      */}
      <main className="flex-1 flex flex-col w-full max-w-5xl mx-auto overflow-hidden">
        
        {/* HEADER DO CONTEÚDO */}
        <header className="px-6 pt-6 lg:mt-[2.5rem] pb-4 md:pt-10 md:pb-8 flex flex-col items-start text-left shrink-0">
    <motion.div
      initial={{ opacity: 0, x: -20 }} // Mudado de Y para X para um slide lateral elegante
      animate={{ opacity: 1, x: 0 }}
      className="space-y-1"
    >
      <div className="flex flex-col">
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase leading-none">
          Pacotes
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 text-xs md:text-sm font-medium mt-1">
          Turbine sua experiência com o melhor investimento.
        </p>
      </div>
    </motion.div>
  </header>

        {/* ÁREA DE SCROLL NATIVA (ESTILO APP) */}
        <ScrollArea className="flex-1 w-full px-4 md:px-6">
          <div className="flex flex-col gap-4 pb-32">
            
            {/* CABEÇALHO DESKTOP (STICKY) */}
            <div className="hidden md:grid grid-cols-4 gap-4 px-10 py-5 bg-zinc-100 dark:bg-zinc-900/50 backdrop-blur-md rounded-3xl border border-zinc-200 dark:border-zinc-800 sticky top-0 z-30 mb-2">
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Pacote</span>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Validade</span>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">Investimento</span>
              <span className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] text-right">Selecionar</span>
            </div>

            {/* LISTA DE CARDS */}
            {planos?.map((plano: any, i: number) => (
              <motion.div
                key={plano.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`
                  group relative bg-white dark:bg-zinc-900/80 md:grid md:grid-cols-4 items-center gap-4 
                  p-6 md:px-10 md:py-9 rounded-[2.5rem] border-2 transition-all duration-500
                  ${i === 1 
                    ? 'border-orange-500 shadow-2xl shadow-orange-500/10 md:scale-[1.03] z-10' 
                    : 'border-zinc-100 dark:border-zinc-800 hover:border-orange-500/30'}
                `}
              >
                {/* Info Principal */}
                <div className="flex items-center gap-5 mb-5 md:mb-0">
                  <div className={`
                    h-14 w-14 rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6
                    ${i === 1 ? 'bg-orange-500 text-white shadow-lg' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500'}
                  `}>
                    <Zap size={26} fill={i === 1 ? "currentColor" : "none"} />
                  </div>
                  <div>
                    <h3 className="font-black text-xl text-zinc-900 dark:text-zinc-100 uppercase tracking-tight leading-none">{plano.title}</h3>
                    {i === 1 && <span className="text-[10px] font-bold text-orange-500 uppercase tracking-widest mt-1 block">Mais Popular</span>}
                  </div>
                </div>

                {/* Duração */}
                <div className="flex items-center gap-2 mb-4 md:mb-0 bg-zinc-50 dark:bg-zinc-800/40 w-fit px-3 py-1.5 rounded-full md:bg-transparent md:p-0">
                  <Timer size={18} className="text-orange-500" />
                  <span className="text-sm font-bold text-zinc-600 dark:text-zinc-400">{plano.validade} dias de acesso</span>
                </div>

                {/* Preço */}
                <div className="mb-8 md:mb-0">
                  <div className="text-[10px] text-zinc-400 uppercase font-black md:hidden mb-1">Valor do Plano</div>
                  <span className="text-4xl font-black text-zinc-900 dark:text-white tracking-tighter">
                    {formatCurrency(plano.preco)}
                  </span>
                </div>

                {/* Ação */}
                <div className="flex justify-end">
                  <Button 
                    onClick={() => { setSelectedPlano(plano); setDialogOpen(true); }}
                    className={`
                      w-full md:w-auto h-14 px-10 rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl transition-all active:scale-90
                      ${i === 1 ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900'}
                    `}
                  >
                    Ativar Agora <ChevronRight size={18} className="ml-1" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </main>

      {/* DIALOG DE CHECKOUT (ESTILO MOBILE MODAL) */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="p-0 border-none sm:max-w-[440px] rounded-[3rem] overflow-hidden bg-white dark:bg-zinc-950 shadow-2xl">
          <div className="bg-zinc-900 dark:bg-orange-600 p-10 text-white relative">
            <ShieldCheck className="absolute top-8 right-8 opacity-20" size={50} />
            <DialogHeader>
              <DialogTitle className="text-3xl font-black italic tracking-tighter uppercase leading-none">Checkout</DialogTitle>
              <DialogDescription className="text-zinc-400 dark:text-orange-100 font-medium text-base">
                Assinando o plano <span className="text-white font-black">{selectedPlano?.title}</span>
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">Forma de Pagamento</label>
              <Select onValueChange={setMetodoPagamento}>
                <SelectTrigger className="h-16 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 text-lg font-black focus:ring-orange-500">
                  <SelectValue placeholder="Toque para escolher..." />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-zinc-100 dark:border-zinc-800 p-2">
                  <SelectItem value="multicaixa" className="py-4 font-bold rounded-xl cursor-pointer">Multicaixa Express</SelectItem>
                  <SelectItem value="referencia" className="py-4 font-bold rounded-xl cursor-pointer">Referência Bancária</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <AnimatePresence>
              {referenciaGerada && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8, y: 20 }} 
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="p-5 rounded-[2.5rem] bg-orange-500/5 border-2 border-dashed border-orange-500/30 text-center"
                >
                  <p className="text-[10px] uppercase font-black text-orange-500 mb-3 tracking-[0.3em]">Copie a Referência</p>
                  <p className="text-5xl font-black tracking-widest text-zinc-900 dark:text-white select-all">
                    {referenciaGerada}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex flex-col gap-4">
              <Button
                disabled={!metodoPagamento || !!referenciaGerada}
                onClick={() => setReferenciaGerada(Math.floor(100000000 + Math.random() * 900000000).toString())}
                className="h-16 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black text-base hover:scale-[1.02] transition-all"
              >
                {referenciaGerada ? <><Check className="mr-2" size={20} /> Referência Pronta</> : "Gerar Código de Pagamento"}
              </Button>

              {referenciaGerada && (
                <Button
                  onClick={() => submeterPedido({
                    planoId: selectedPlano.id,
                    referencia: referenciaGerada,
                    valor: selectedPlano.preco
                  })}
                  disabled={isSubmitting}
                  className="h-16 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black text-base shadow-xl shadow-orange-500/20 active:scale-95 transition-all"
                >
                  {isSubmitting ? <Loader className="animate-spin" /> : "Confirmar que Paguei"}
                </Button>
              )}
              
              <Button variant="ghost" onClick={() => setDialogOpen(false)} className="text-zinc-400 font-bold hover:bg-transparent hover:text-zinc-600">
                Talvez mais tarde
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function LoadingGrid() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-zinc-950 p-6">
      <div className="w-full max-w-md space-y-4">
        <div className="h-16 w-3/4 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-2xl" />
        <div className="h-40 w-full bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-[2.5rem]" />
        <div className="h-40 w-full bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-[2.5rem]" />
      </div>
    </div>
  );
}