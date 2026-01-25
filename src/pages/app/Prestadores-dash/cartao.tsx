import { useHistoricoCarteira } from "@/api/get-active-packages";
import { GetCarteira } from "@/api/get-carteira";
import { GetHistorico } from "@/api/get-historico-recargas";
import { GetUserProfile } from "@/api/get-profile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatCurrencyKZ } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bell,
  History,
  LucideCircleDollarSign,
  Wallet,
  Zap
} from "lucide-react";
import { Historico } from "./Historico";
import { SkeletonsCard } from "./prestadores-home-skeletons/creditcard-skeletons";
import { TableSkeletons } from "./prestadores-home-skeletons/table-sketons";

export function Cartaa() {


  const { data: profile, isLoading: isLoadingUserProfile } = useQuery({ queryKey: ["profile"], queryFn: GetUserProfile });
  const { data: carteira, isLoading: isLoadingCarteira } = useQuery({ queryKey: ["carteira"], queryFn: GetCarteira });
  const { data: pacotesAtivos } = useQuery({ queryKey: ['carteira-pacotes'], queryFn: useHistoricoCarteira });
  const carteiraId = localStorage.getItem("carteiraId");
  const { data: historico } = useQuery({
    queryKey: ['historico', carteiraId],
    queryFn: () => GetHistorico({ carteiraId: Number(carteiraId) }),
    enabled: !!carteiraId
  });

  if (isLoadingUserProfile || isLoadingCarteira) {
    return (
      <div className="flex flex-col h-screen w-full items-center justify-center p-6 bg-background">
        <SkeletonsCard />
        <TableSkeletons />
      </div>
    );
  }

  return (
   // Substitua o seu componente principal por esta estrutura atualizada:

<div className="h-screen w-full bg-zinc-50 dark:bg-[#050505] text-zinc-900 dark:text-zinc-100 overflow-hidden flex items-center justify-center relative">
  
  {/* Glow Neon Laranja Central - Aumentado para cobrir o desktop */}
  <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-orange-500/10 blur-[160px] rounded-full pointer-events-none" />

  {/* Main Container: 
      Mobile: flex-col (um em cima do outro)
      Desktop: flex-row (inline / lado a lado) 
  */}
  <main className="w-full max-w-7xl px-6 flex flex-col lg:flex-row gap-12 items-center justify-center z-10 transition-all duration-500">
    
    {/* COLUNA DA ESQUERDA: Header + Cartão */}
    <div className="w-full max-w-[420px] flex flex-col gap-8">
      
      {/* Header Minimalista */}
      <header className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
            <Zap className="text-white fill-white" size={18} />
          </div>
          <h1 className="text-lg font-black tracking-tighter uppercase italic">Wallet</h1>
        </div>

        <div className="flex items-center gap-2">
          {/* Botão de Histórico (Drawer) */}
          <Drawer>
            <DrawerTrigger asChild>
              <button className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm active:scale-95 transition-transform">
                <History size={20} className="text-orange-500" />
              </button>
            </DrawerTrigger>
            <DrawerContent className="bg-white dark:bg-zinc-950 h-[85vh]">
              <div className="mx-auto w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full my-4" />
              <DrawerHeader>
                <DrawerTitle className="text-xl font-black flex items-center gap-2">
                  <History className="text-orange-500" /> Extrato de Conta
                </DrawerTitle>
              </DrawerHeader>
              <ScrollArea className="flex-1 px-6 pb-10">
                <Historico data={historico} />
              </ScrollArea>
            </DrawerContent>
          </Drawer>

          <button className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm relative active:scale-95">
            <Bell size={20} className="text-zinc-500" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-orange-500 rounded-full" />
          </button>
        </div>
      </header>

      {/* Cartão Central (Destaque) */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="relative w-full aspect-[1.6/1] rounded-[2.5rem] bg-zinc-900 border border-white/5 p-8 flex flex-col justify-between overflow-hidden shadow-[0_20px_60px_rgba(249,115,22,0.2)]"
      >
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-orange-500/20 via-transparent to-transparent opacity-50" />
        
        <div className="flex justify-between items-start z-10">
          <div className="px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20">
            <span className="text-[8px] font-black text-orange-500 uppercase tracking-widest">Premium Card</span>
          </div>
          <LucideCircleDollarSign className="text-white/5" size={50} />
        </div>

        <div className="z-10">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Saldo Atual</p>
          <h2 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">
            {formatCurrencyKZ(carteira?.receita ?? 0)}
          </h2>
        </div>

        <div className="flex justify-between items-end z-10">
          <div className="flex flex-col">
            <p className="text-[8px] text-zinc-500 font-bold uppercase">Titular</p>
            <p className="text-xs font-bold text-white uppercase">{profile?.nome}</p>
          </div>
          <div className="flex -space-x-2">
            <div className="w-8 h-8 rounded-full bg-orange-600 border-2 border-zinc-900 shadow-xl" />
            <div className="w-8 h-8 rounded-full bg-zinc-800 border-2 border-zinc-900 shadow-xl" />
          </div>
        </div>
      </motion.div>
    </div>

    {/* COLUNA DA DIREITA: Assinaturas (Inline no Desktop) */}
    <div className="w-full max-w-[420px] flex flex-col gap-6 self-center h-full max-h-[450px]">
  <div className="flex items-center justify-between px-1 shrink-0">
    <h3 className="text-[10px] font-black text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em]">
      Serviços Ativos
    </h3>
    <button className="text-[10px] font-bold text-orange-500 flex items-center gap-1 hover:underline transition-all">
      VER TODOS <ArrowRight size={12} />
    </button>
  </div>

  {/* Ativação do ScrollArea */}
 {/* Container com altura definida para o Scroll funcionar */}
<ScrollArea className="h-[260px] w-full rounded-3xl pr-4">
  <motion.div 
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}

    className="flex flex-col gap-3 mb-4" 
  >
    {pacotesAtivos?.pacotes_ativos.map((p, i) => (
      <ActivePackageCard key={i} package={p} />
    ))}
    
    {/* Fallback caso a lista esteja vazia */}
    {pacotesAtivos?.pacotes_ativos.length === 0 && (
      <p className="text-[10px] text-zinc-500 text-center py-10 uppercase tracking-widest font-bold opacity-50">
        Nenhum serviço ativo
      </p>
    )}
  </motion.div>
</ScrollArea>
  {/* Footer Indicativo fixo abaixo do scroll */}
  <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-medium opacity-50 px-1 mt-2 shrink-0">
    Última atualização: hoje às 14:30
  </p>
</div>

  </main>
</div>
  );
}

function ActivePackageCard({ package: p }: { package: any }) {
  return (
    <div className="p-4 rounded-3xl bg-white dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800/50 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600">
          <Wallet size={18} />
        </div>
        <div>
          <p className="text-[9px] text-zinc-500 font-bold uppercase leading-none mb-1">{p.nome}</p>
          <p className="text-base font-black dark:text-white leading-none">{p.total}</p>
        </div>
      </div>
      <div className="bg-orange-500/5 px-3 py-1.5 rounded-xl border border-orange-500/10 text-[9px] font-mono font-bold text-orange-600">
        {p.validade}
      </div>
    </div>
  );
}