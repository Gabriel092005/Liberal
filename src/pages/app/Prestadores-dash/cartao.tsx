import { useHistoricoCarteira } from "@/api/get-active-packages";
import { GetCarteira } from "@/api/get-carteira";
import { GetHistorico } from "@/api/get-historico-recargas";
import { GetUserProfile } from "@/api/get-profile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { socket } from "@/lib/socket";
import { formatCurrencyKZ } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Bell,
  CreditCard,
  DollarSign,
  LucideCircleDollarSign,
  TrendingUp,
  Wallet
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Historico } from "./Historico";
import { SkeletonsCard } from "./prestadores-home-skeletons/creditcard-skeletons";
import { TableSkeletons } from "./prestadores-home-skeletons/table-sketons";

export function Cartaa() {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [notificacoesAtivas, setNotificacoesAtivas] = useState(false);
    const navigate = useNavigate();

    // Consultas com StaleTime definido para evitar refetch desnecessário
    const { data: pacotesAtivos } = useQuery({
        queryKey: ['carteira-pacotes'],
        queryFn: useHistoricoCarteira,
        staleTime: 1000 * 60 * 5 // 5 minutos
    });

    const { data: profile, isLoading: isLoadingUserProfile, refetch } = useQuery({
        queryKey: ["profile"],
        queryFn: GetUserProfile,
        staleTime: 1000 * 60 * 10
    });

    const { data: carteira, isLoading: isLoadingCarteira } = useQuery({
        queryKey: ["carteira"],
        queryFn: GetCarteira,
    });

    const carteiraId = localStorage.getItem("carteiraId");
    
    const { data: historico } = useQuery({
        queryKey: ['historico', carteiraId],
        queryFn: () => GetHistorico({ carteiraId: Number(carteiraId) }),
        enabled: !!carteiraId
    });

    // Redirecionamentos de Segurança
    useEffect(() => {
        if (!isLoadingUserProfile && profile) {
            if (['CLIENTE_INDIVIDUAL', 'CLIENTE_COLECTIVO'].includes(profile.role)) navigate("/");
            if (profile.role === 'ADMIN') navigate("/início");
        }
    }, [profile, isLoadingUserProfile, navigate]);

    // Audio de Notificação
    useEffect(() => {
        audioRef.current = new Audio("/bell-98033.mp3");
        audioRef.current.volume = 0.5;
    }, []);

    // Socket Lifecycle
    useEffect(() => {
        if (!profile?.id) return;

        socket.emit("register", profile.id);

        const handleUserNotification = () => {
            refetch();
            setNotificacoesAtivas(true);
            audioRef.current?.play().catch(() => {});
            setTimeout(() => setNotificacoesAtivas(false), 5000);
        };

        socket.on("user", handleUserNotification);
        return () => { socket.off("user", handleUserNotification); };
    }, [profile?.id, refetch]);

    if (isLoadingUserProfile || isLoadingCarteira) {
        return (
            <div className="flex flex-col h-screen w-full items-center justify-center gap-8 p-6 bg-background">
                <SkeletonsCard />
                <TableSkeletons />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen w-full fixed inset-0 overflow-hidden bg-zinc-50 dark:bg-zinc-950">
            {/* BACKGROUND GRADIENT SUBTIL */}
            <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-emerald-500/10 to-transparent pointer-events-none" />

            <ScrollAreaCustom>
                <motion.div 
                    className="flex flex-col w-full max-w-md mx-auto px-4 pt-8 pb-32 gap-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    {/* HEADER CUSTOMIZADO */}
                    <header className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-12 h-12 rounded-2xl bg-zinc-900 dark:bg-white flex items-center justify-center shadow-xl">
                                    <DollarSign className="text-emerald-500" size={24} />
                                </div>
                                {notificacoesAtivas && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-background rounded-full animate-bounce" />
                                )}
                            </div>
                            <div>
                                <h1 className="text-xl font-black text-zinc-900 dark:text-white">Minha Conta</h1>
                                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter flex items-center gap-1">
                                    <TrendingUp size={12} /> Saldo Atualizado
                                </p>
                            </div>
                        </div>

                        <Drawer>
                            <DrawerTrigger asChild>
                                <button className="p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm active:scale-95 transition-all">
                                    <Bell size={20} className="text-zinc-500" />
                                </button>
                            </DrawerTrigger>
                            <DrawerContent className="rounded-t-[2.5rem] p-6 max-h-[80vh]">
                                <DrawerHeader>
                                    <DrawerTitle className="flex items-center gap-2 justify-center italic">
                                        <CreditCard size={18} className="text-orange-500" /> Pacotes Ativos
                                    </DrawerTitle>
                                </DrawerHeader>
                                <div className="space-y-3 mt-4 overflow-y-auto">
                                    {pacotesAtivos?.pacotes_ativos.length ? (
                                        pacotesAtivos.pacotes_ativos.map((p, i) => <ActivePackageCard key={i} package={p} />)
                                    ) : (
                                        <p className="text-center text-zinc-500 text-sm py-10">Nenhum pacote ativo no momento.</p>
                                    )}
                                </div>
                            </DrawerContent>
                        </Drawer>
                    </header>

                    {/* CARTÃO DE SALDO (DESIGN EVOLUÍDO) */}
                    <section className="w-full">
                        <motion.div 
                            whileHover={{ y: -5 }}
                            className="relative w-full aspect-[1.6/1] rounded-[2.5rem] bg-zinc-900 shadow-2xl shadow-emerald-900/20 p-8 flex flex-col justify-between overflow-hidden"
                        >
                            {/* Efeitos de Luz */}
                            <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/20 blur-[80px] rounded-full" />
                            
                            <div className="flex justify-between items-start z-10">
                                <div className="flex flex-col gap-1">
                                    <span className="text-emerald-500 font-mono text-xs tracking-widest font-bold">PREMIUM ACCOUNT</span>
                                    <div className="w-10 h-6 bg-zinc-800 rounded-md border border-white/10" /> {/* Simulação de Chip */}
                                </div>
                                <LucideCircleDollarSign className="text-white/20" size={32} />
                            </div>

                            <div className="z-10">
                                <p className="text-white/40 text-[10px] font-bold uppercase tracking-[0.3em] mb-1">Total em Carteira</p>
                                <h2 className="text-4xl font-black text-white tracking-tighter">
                                    {formatCurrencyKZ(carteira?.receita ?? 0)}
                                </h2>
                            </div>

                            <div className="flex justify-between items-end z-10 border-t border-white/5 pt-4">
                                <div>
                                    <p className="text-[8px] uppercase text-white/30 font-bold tracking-widest">Titular da Conta</p>
                                    <p className="text-sm font-bold text-white uppercase">{profile?.nome}</p>
                                </div>
                                <div className="flex -space-x-2">
                                    <div className="w-8 h-8 rounded-full bg-orange-500/80" />
                                    <div className="w-8 h-8 rounded-full bg-yellow-500/80" />
                                </div>
                            </div>
                        </motion.div>
                    </section>

                    {/* SEÇÃO DE HISTÓRICO */}
                    <section className="flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="font-bold text-zinc-900 dark:text-white">Atividade Recente</h3>
                            <button className="text-xs font-bold text-emerald-600">Ver tudo</button>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-2 border border-zinc-200 dark:border-zinc-800">
                             <Historico data={historico} />
                        </div>
                    </section>
                </motion.div>
            </ScrollAreaCustom>
        </div>
    );
}

// Sub-componentes para limpeza de código
function ActivePackageCard({ package: p }: { package: any }) {
    return (
        <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-5 rounded-3xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-800 flex justify-between items-center group"
        >
            <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                    <Wallet size={20} />
                </div>
                <div>
                    <p className="text-[10px] text-zinc-400 font-black uppercase tracking-tighter">{p.nome}</p>
                    <p className="text-lg font-black text-zinc-800 dark:text-zinc-100">{p.total}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[9px] text-zinc-400 font-bold uppercase mb-1 underline decoration-orange-500/50">Expira em</p>
                <p className="text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400">{p.validade}</p>
            </div>
        </motion.div>
    );
}

function ScrollAreaCustom({ children }: { children: React.ReactNode }) {
    return (
        <div className="h-full w-full overflow-y-auto scrollbar-hide pb-20">
            {children}
        </div>
    );
}