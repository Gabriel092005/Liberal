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
import { File, InfoIcon, MapPin, Menu, MoveDownLeft, MoveUpRight, RefreshCw, Search } from "lucide-react";
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
import { ChatIntegrado } from "../dashboard-admin/sidebar/Mensagens";

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
        <div className="w-full max-w-md lg:max-w-6xl space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4">
          <SkeletonsDemo />
          <SkeletonsDemo />
          <SkeletonsDemo />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      // Mobile: Ocupa tudo fixo | Desktop: Centralizado com padding
      className="fixed inset-0 lg:relative lg:inset-auto lg:min-h-screen lg:h-screen w-full flex items-center justify-center bg-background px-0 py-0 lg:px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Card Mobile: Sem bordas, sem sombra | Desktop: Rounded e Shadow */}
      <Card className="w-full h-full lg:max-w-6xl lg:h-[95dvh] flex flex-col border-none lg:border-none shadow-none lg:shadow-1xl overflow-hidden bg-transparent lg:bg-card">
        
        {/* HEADER MOBILE (Identico ao seu original) */}
        <header className="w-full lg:hidden shrink-0 z-50 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div className="h-[env(safe-area-inset-top)] w-full" />
          <div className="h-16 px-4 flex items-center justify-between">
            <img src={logo} alt="Logo" className="h-10 w-auto" />
            <div className="flex items-center gap-2">
              <div className="bg-zinc-100/80 dark:bg-zinc-800/80 rounded-2xl p-0.5">
                {profile && <NotificationDropdown {...profile} />}
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-2xl h-11 w-11">
                    <Menu className="h-5 w-5 text-muted-foreground" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[85%] p-0">
                  <Vitrine />
                </SheetContent>
              </Sheet>
              <ModeToggle />
              <ChatIntegrado />
            </div>
          </div>
        </header>

        {/* HEADER DE CONTEÚDO (Pedidos + Busca) */}
        <CardHeader className="px-4 lg:px-8 pb-4 pt-4 lg:pt-6 shrink-0 bg-white dark:bg-zinc-950 border-b lg:border-none">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl lg:text-4xl font-black tracking-tighter">
              Pedidos
            </CardTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => refetch()} 
              className={`rounded-full ${isFetching ? "animate-spin" : ""}`}
            >
              <RefreshCw size={20} />
            </Button>
          </div>
          <CardDescription className="text-xs lg:text-sm">
            {filter === "all" ? "Novas oportunidades de trabalho." : "Pedidos interessados."}
          </CardDescription>

          <div className="flex flex-col lg:flex-row gap-3 mt-4">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Buscar serviços..."
                className="pl-9 h-10 lg:h-12 bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl lg:rounded-2xl text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-row gap-2 overflow-x-auto no-scrollbar shrink-0">
              <Button
                variant={filter === "all" ? "default" : "secondary"}
                onClick={() => setFilter("all")}
                className="rounded-full h-9 lg:h-11 text-[11px] lg:text-sm px-4"
              >
                Todos <MoveUpRight size={14} className="ml-1" />
              </Button>
              <Button
                variant={filter === "accepted" ? "default" : "secondary"}
                onClick={() => setFilter("accepted")}
                className="rounded-full h-9 lg:h-11 text-[11px] lg:text-sm px-4"
              >
                Negociando <MoveDownLeft size={14} className="ml-1" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* LISTAGEM (O segredo está no grid responsivo) */}
        <CardContent className="flex-1 overflow-y-auto px-3 lg:px-8 pb-20 lg:pb-8 no-scrollbar bg-zinc-50/30 dark:bg-transparent">
          <AnimatePresence mode="popLayout">
            {!orders?.length ? (
              <motion.div className="flex flex-col items-center justify-center py-20 opacity-40">
                <File size={48} />
                <p>Nenhum pedido encontrado.</p>
              </motion.div>
            ) : (
              // grid-cols-1 para Mobile (Lista vertical) | lg:grid-cols-2 ou 3 para Desktop
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mt-2 lg:mt-4">
                {orders.map((card) => {
                  const isInteresseComPedido = "pedido" in card;
                  const pedido = isInteresseComPedido ? card.pedido : card;

                  return (
                    <motion.div
                      key={card.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      // Design do Card: Otimizado para os dois ambientes
                      className="group relative bg-white dark:bg-zinc-900/50 p-4 lg:p-6 rounded-[1.8rem] lg:rounded-[2.2rem] border border-zinc-100 dark:border-zinc-800/50 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex gap-3 min-w-0">
                            <div className="relative shrink-0">
                              <Avatar className="w-12 h-12 lg:w-14 lg:h-14 rounded-2xl ring-2 ring-orange-500/5">
                                <AvatarImage 
                                  src={`${api.defaults.baseURL}/uploads/${pedido.image_path}`} 
                                  className="object-cover"
                                />
                                <AvatarFallback className="bg-orange-500 text-white rounded-2xl font-black">
                                  {pedido?.title?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-zinc-900 ${
                                pedido?.brevidade === "URGENTE" ? "bg-red-500 animate-pulse" : "bg-emerald-500"
                              }`} />
                            </div>
                            
                            <div className="flex flex-col min-w-0 pt-0.5">
                              <h4 className="font-black text-zinc-900 dark:text-zinc-100 text-sm lg:text-base truncate uppercase">
                                {pedido?.title}
                              </h4>
                              <p className="text-[11px] lg:text-xs text-zinc-500 line-clamp-2 mt-0.5">
                                {pedido?.content}
                              </p>
                            </div>
                          </div>

                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-xl shrink-0 h-9 w-9 bg-zinc-50 dark:bg-zinc-800/50">
                                <InfoIcon size={16} />
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
                        <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-100 dark:via-zinc-800 to-transparent my-3 lg:my-4" />
                      </div>

                      <div className="flex items-center justify-between mt-1">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1 text-orange-600">
                            <MapPin size={10} strokeWidth={3} />
                            <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-tighter truncate max-w-[100px]">
                              {pedido?.location || "Angola"}
                            </span>
                          </div>
                          <Badge className={`text-[8px] lg:text-[9px] px-2 py-0 border-none font-black rounded-lg ${
                             pedido?.brevidade === "URGENTE" ? "bg-red-500/10 text-red-600" : "bg-emerald-500/10 text-emerald-600"
                          }`}>
                            {pedido?.brevidade}
                          </Badge>
                        </div>
                        <BotaoNegociar 
                          celular={pedido.autor.celular} 
                          image_path={pedido.autor.image_path} 
                          isSuccess={isSuccess} 
                          nome={pedido.autor.nome} 
                          onClick={() => SeInteressar({ pedidoId: Number(pedido.id) })} 
                        />
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