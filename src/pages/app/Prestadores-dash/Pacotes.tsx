import { assinarPacote } from "@/api/carregar-carteira";
import { FetchPacotes } from "@/api/fetch-pacotes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
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
import { motion } from "framer-motion";
import { Check, ChevronRight, Loader, Sparkles, Timer } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

// 🧩 Helper para formatar moeda
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
      await assinarPacote({ metodo: 'Referencia', pacoteId: planoId });
      return await api.post("/pagamentos/confirmar", { planoId, referencia, valor });
    },
    onSuccess: () => {
      toast.success("Pedido submetido! Aguarde a confirmação.");
      setDialogOpen(false);
      setReferenciaGerada(null);
    },
    onError: () => toast.error("Erro ao processar pagamento."),
  });

  if (isLoading) return <LoadingGrid />;

  return (
    <div className="flex flex-col relative right-5 -top-20 w-full min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      {/* HEADER DINÂMICO */}
      <header className="px-6 pt-12 pb-8 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <Badge className="bg-orange-500/10 text-orange-600 border-none mb-3">
            Planos & Assinaturas
          </Badge>
          <h1 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-zinc-100">
            Impulsione seu <br /><span className="text-orange-500">Negócio</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 text-sm">
            Selecione o plano ideal para aumentar sua visibilidade.
          </p>
        </motion.div>
      </header>

      {/* GRID DE CARDS (Substitui a Tabela) */}
      {/* 3. SCROLL AREA: Onde o "deslize" acontece */}
        <ScrollArea className="flex-1 h-full max-h-96 w-full">
          <main className="p-6 flex flex-col gap-4 pb-32">
            {planos?.map((plano: any, i: number) => (
              <motion.div
                key={plano.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="group relative bg-zinc-50 dark:bg-zinc-800/50 rounded-[2.5rem] p-6 border border-zinc-100 dark:border-zinc-700/50 hover:border-orange-500/40 transition-all active:scale-[0.98]"
              >
                {/* Badge Popular interna */}
                {i === 1 && (
                  <div className="absolute top-4 right-6 bg-orange-500 text-white text-[9px] font-black px-3 py-1 rounded-full shadow-lg shadow-orange-500/20">
                    MAIS VENDIDO
                  </div>
                )}

                <div className="flex flex-col gap-1 mb-6">
                  <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100">{plano.title}</h3>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                    <Timer size={12} className="text-orange-500" />
                    Duração: {plano.validade} dias
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-black text-zinc-900 dark:text-white leading-none">
                    {formatCurrency(plano.preco)}
                  </span>
                </div>

                <Button 
                  onClick={() => { setSelectedPlano(plano); setDialogOpen(true); }}
                  className="w-full h-14 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black uppercase tracking-widest text-xs hover:opacity-90 transition-all shadow-xl"
                >
                  Assinar Agora
                  <ChevronRight size={18} className="ml-2" />
                </Button>
              </motion.div>
            ))}
          </main>
        </ScrollArea>
      {/* DIALOG DE PAGAMENTO REESTILIZADO */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[2rem] border-none p-0 overflow-hidden bg-white dark:bg-zinc-950">
          <div className="bg-orange-500 p-8 text-white relative">
            <Sparkles className="absolute top-4 right-4 opacity-30" />
            <DialogHeader>
              <DialogTitle className="text-2xl font-black tracking-tight">Checkout</DialogTitle>
              <DialogDescription className="text-orange-100">
                Finalize sua assinatura para o plano <b>{selectedPlano?.title}</b>
              </DialogDescription>
            </DialogHeader>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-4">
              <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                Método de Pagamento
              </label>
              <Select onValueChange={setMetodoPagamento}>
                <SelectTrigger className="h-14 rounded-2xl border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900">
                  <SelectValue placeholder="Como deseja pagar?" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  <SelectItem value="multicaixa" className="py-3">Multicaixa Express</SelectItem>
                  <SelectItem value="referencia" className="py-3">Referência Bancária</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {referenciaGerada && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-2xl bg-orange-50 dark:bg-orange-500/5 border border-orange-200 dark:border-orange-500/20 text-center"
              >
                <p className="text-[10px] uppercase font-bold text-orange-600 mb-1">Código de Referência</p>
                <p className="text-2xl font-black tracking-widest text-zinc-800 dark:text-zinc-200">
                  {referenciaGerada}
                </p>
              </motion.div>
            )}

            <div className="flex flex-col gap-3">
              <Button
                disabled={!metodoPagamento || !!referenciaGerada}
                onClick={() => setReferenciaGerada("REF-" + Math.floor(100000 + Math.random() * 900000))}
                className="h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-lg shadow-orange-500/20"
              >
                {referenciaGerada ? <><Check className="mr-2" /> Gerado</> : "Gerar Código de Pagamento"}
              </Button>

              {referenciaGerada && (
                <Button
                  onClick={() => submeterPedido({
                    planoId: selectedPlano.id,
                    referencia: referenciaGerada,
                    valor: selectedPlano.preco
                  })}
                  disabled={isSubmitting}
                  className="h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-bold"
                >
                  {isSubmitting ? <Loader className="animate-spin" /> : "Confirmar e Enviar Comprovativo"}
                </Button>
              )}
              
              <Button variant="ghost" onClick={() => setDialogOpen(false)} className="rounded-xl text-zinc-500">
                Cancelar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// 🦴 Skeleton para Loading State
function LoadingGrid() {
  return (
    <div className="p-6 space-y-4 max-w-md mx-auto">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-48 w-full bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-3xl" />
      ))}
    </div>
  );
}