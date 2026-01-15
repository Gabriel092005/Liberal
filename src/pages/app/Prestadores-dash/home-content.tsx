import { FetchAllOrders } from "@/api/fetch-all";
import { InterestedOrdersPrestadores } from "@/api/fetch-interrested-orders";
import { GetUserProfile } from "@/api/get-profile";
import { InteressarPedidos } from "@/api/interessar-pedido";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { api } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {File, InfoIcon, MapPin, Menu, MoveDownLeft, MoveUpRight, RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { NotificationDropdown } from "../dashboard-admin/sidebar/Notification/notification-dropdown";
import { BotaoNegociar } from "./botao-negociar";
import { SkeletonsDemo } from "./NearClientsSearch";
import { ServicesDialogDetails } from "./ServicesDialogDetails";
import { Vitrine } from "./Vitrine";
import logo from '@/assets/liberal.png'
import { ModeToggle } from "@/components/theme/theme-toggle";


function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export function HomeContent() {
  const [filter, setFilter] = useState<"all" | "accepted">("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromParams = searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(queryFromParams);
  const debouncedQuery = useDebounce(searchTerm, 400);

    const { data: profile } = useQuery({
      queryKey: ["profile"],
      queryFn: GetUserProfile,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      staleTime: 0,
    })

  useEffect(() => {
    const newParams = new URLSearchParams();
    if (debouncedQuery) newParams.set("query", debouncedQuery);
    setSearchParams(newParams);
  }, [debouncedQuery, setSearchParams]);

  const { data: orders, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["orders", filter, debouncedQuery],
    queryFn: async () => {
      return filter === "all" 
        ? await FetchAllOrders({ query: debouncedQuery }) 
        : await InterestedOrdersPrestadores();
    },
    staleTime: 1000 * 30,
  });

  const { mutateAsync: SeInteressar, isSuccess } = useMutation({
    mutationFn: InteressarPedidos,
    onSuccess: () => toast.success("Pedido marcado para negociação!"),
    onError: () => toast.error("Oops! Só pode negociar uma vez!"),
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[100dvh] w-full p-4">
        <div className="w-full max-w-md space-y-4">
          <SkeletonsDemo />
          <SkeletonsDemo />
          <SkeletonsDemo />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      // Centralização total no viewport do smartphone
      className="fixed inset-0 flex pb-10 items-center justify-center bg-background px-4 py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full max-w-md h-full max-h-[92dvh] flex flex-col border-none shadow-none md:shadow-lg overflow-hidden bg-transparent md:bg-card">
        <div className="flex flex-col    w-full bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      
      {/* 1. HEADER - FIXO NO TOPO */}
    <header className="w-full shrink-0 md:hidden z-50 sticky top-0 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50 supports-[backdrop-filter]:bg-white/60">
  {/* Padding para Safe Area do iOS/Android */}
  <div className="h-[env(safe-area-inset-top)] w-full" />
  
  <div className="h-16 px-4 flex items-center justify-between">
    {/* Logo com efeito de brilho */}
    <div className="relative group">
      <div className="absolute -inset-2 bg-orange-500/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <img 
        src={logo} 
        alt="Logo" 
        className="h-10 w-auto relative z-10 hover:scale-105 transition-transform duration-300" 
      />
    </div>

    {/* Lado Direito: Ações */}
    <div className="flex items-center gap-2">
      {/* Container de Notificação Estilizado */}
      <div className="relative flex items-center justify-center bg-zinc-100/80 dark:bg-zinc-800/80 rounded-2xl p-0.5 border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors">
        {profile && (
          <div className="scale-90 origin-center">
            <NotificationDropdown {...profile} />
          </div>
        )}
      </div>

      {/* Menu Sanduíche com Sheet */}
      <Sheet>
        <SheetTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-2xl h-11 w-11 bg-orange-500 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-orange-600 dark:hover:bg-orange-500 hover:text-white active:scale-95 transition-all duration-300 shadow-lg shadow-orange-500/10"
          >
            <Menu className="h-5 w-5 stroke-[2.5px]" />
          </Button>

        </SheetTrigger>
        
        
        {/* SheetContent com animação e bordas arredondadas */}
        <SheetContent 
          side="right" 
          className="w-[85%] p-0 border-l border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 sm:max-w-none"
        >
          {/* O componente Vitrine deve lidar com o scroll interno */}
          <div className="h-full pt-[env(safe-area-inset-top)]">
            <Vitrine />
          </div>
        </SheetContent>
      </Sheet>
      <ModeToggle></ModeToggle>
    </div>
  </div>
</header>
      </div>
        {/* Header fixo no topo do card */}
        <CardHeader className="px-2 pb-4 pt-2 shrink-0">
          <div className="flex justify-between items-center mb-1">
            <CardTitle className="text-2xl font-black tracking-tighter">
              Pedidos
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => refetch()} 
              className={`rounded-full ${isFetching ? "animate-spin" : ""}`}
            >
              <RefreshCw size={18} />
            </Button>
          </div>
          <CardDescription className="text-xs">
            {filter === "all"
              ? "Encontre novas oportunidades de trabalho."
              : "Pedidos que você demonstrou interesse."}
          </CardDescription>

          <div className="flex flex-col gap-3 mt-4">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Buscar serviços..."
                className="pl-9 h-10 bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-row gap-2 overflow-x-auto pb-1 no-scrollbar shrink-0">
              <Button
                variant={filter === "all" ? "default" : "secondary"}
                onClick={() => setFilter("all")}
                className="rounded-full whitespace-nowrap h-8 text-[11px]"
              >
                Novos <MoveUpRight size={12} className="ml-1" />
              </Button>
              <Button
                variant={filter === "accepted" ? "default" : "secondary"}
                onClick={() => setFilter("accepted")}
                className="rounded-full whitespace-nowrap h-8 text-[11px]"
              >
                Negociando <MoveDownLeft size={12} className="ml-1" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Área de conteúdo com scroll independente */}
        <CardContent className="flex-1 overflow-y-auto px-2 pb-6 no-scrollbar">
          <AnimatePresence mode="popLayout">
            {!orders?.length ? (
              <motion.div 
                className="flex flex-col items-center justify-center py-20 text-muted-foreground"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              >
                <File size={48} strokeWidth={1} className="mb-2 opacity-20" />
                <p className="text-sm font-medium">Nenhum pedido encontrado.</p>
              </motion.div>
            ) : (
       <div className="space-y-4 p-1">
  {orders.map((card) => {
    const isInteresseComPedido = "pedido" in card;
    const pedido = isInteresseComPedido ? card.pedido : card;

    return (
      <motion.div
        key={card.id}
        layout
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="group relative bg-white dark:bg-zinc-900/50 backdrop-blur-sm p-5 rounded-[2rem] border border-zinc-100 dark:border-zinc-800/50 shadow-sm hover:shadow-xl hover:shadow-orange-500/5 hover:border-orange-500/20 active:scale-[0.99] transition-all duration-300"
      >
        {/* Lado Superior: Info Principal */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4 min-w-0">
            {/* Avatar com Shape Moderno */}
            <div className="relative shrink-0">
              <Avatar className="w-12 h-12 rounded-2xl ring-4 ring-orange-500/5 transition-transform group-hover:scale-105 duration-500">
                <AvatarImage 
                  src={`${api.defaults.baseURL}/uploads/${pedido.image_path}`} 
                  className="object-cover"
                />
                <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl text-xs font-black">
                  {pedido?.title?.charAt(0) ?? "S"}
                </AvatarFallback>
              </Avatar>
              {/* Indicador de Status/Online */}
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-[3px] border-white dark:border-zinc-900 ${
                pedido?.brevidade === "URGENTE" ? "bg-red-500 animate-pulse" : "bg-emerald-500"
              }`} />
            </div>
            
            <div className="flex flex-col min-w-0 pt-0.5">
              <h4 className="font-black text-zinc-900 dark:text-zinc-100 text-sm md:text-base truncate uppercase tracking-tight group-hover:text-orange-600 transition-colors">
                {pedido?.title}
              </h4>
              <p className="text-[11px] md:text-xs text-zinc-500 dark:text-zinc-400 line-clamp-2 mt-1 leading-relaxed font-medium">
                {pedido?.content}
              </p>
            </div>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-2xl shrink-0 h-10 w-10 bg-zinc-50 dark:bg-zinc-800/50 hover:bg-blue-500 hover:text-white transition-all duration-300"
              >
                <InfoIcon size={18} />
              </Button>
            </DialogTrigger>
            <ServicesDialogDetails
              isSucces={isSuccess}
              nome={pedido.autor.nome}
              celular={pedido.autor.celular}
              provincia={pedido.autor.provincia}
              image_path={pedido.autor.image_path}
              municipio={pedido.autor.municipio}
            />
          </Dialog>
        </div>

        {/* Divisor Elegante (Gradiente) */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-100 dark:via-zinc-800 to-transparent my-4" />

        {/* Lado Inferior: Tags e Ação */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col gap-2">
            {/* Localização com Icone Estilizado */}
            <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400">
              <div className="p-1.5 bg-orange-500/10 rounded-lg">
                <MapPin size={12} strokeWidth={3} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest truncate max-w-[120px]">
                {pedido?.location || "Angola"}
              </span>
            </div>
            
            {/* Badge com Estilo de Prioridade */}
            <Badge 
              variant="outline" 
              className={`w-fit text-[9px] px-2.5 py-0.5 h-5 border-none font-black tracking-tighter rounded-lg ${
                pedido?.brevidade === "URGENTE" 
                  ? "bg-red-500/10 text-red-600 dark:bg-red-500/20" 
                  : pedido?.brevidade === "MEDIO" 
                    ? "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20" 
                    : "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20"
              }`}
            >
              <span className="mr-1 opacity-50">•</span>
              {pedido?.brevidade}
            </Badge>
          </div>

          {/* Botão de Negociar - Dando destaque ao CTA principal */}
          <div className="shrink-0 transform group-hover:scale-105 transition-transform">
            <BotaoNegociar 
              celular={pedido.autor.celular} 
              image_path={pedido.autor.image_path} 
              isSuccess={isSuccess} 
              nome={pedido.autor.nome} 
              onClick={() => SeInteressar({ pedidoId: Number(pedido.id) })} 
            />
          </div>
        </div>
      </motion.div>
    );
  })}
</div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}