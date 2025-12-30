import { Briefcase, ChevronDown, File, MapPin, MessageCircle, Phone, Pin, Search, Trash2, AlertCircle, Clock } from "lucide-react";
import { motion} from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CostumerOrders, Interessado } from "@/api/costumer-orders";
import { formatNotificationDate } from "@/lib/utils";
import { api } from "@/lib/axios";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PedidoCard } from "./pedidos-confirmar";
import { Favoritar } from "@/api/favoritar";
import { Deletar } from "@/api/deletar-order";
import { queryClient } from "@/lib/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

export function SearchPedidos() {
  const [searchParams, _] = useSearchParams();
  const queryFromParams = searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(queryFromParams);
  // const userId = searchParams.get("userId");

  const [parent] = useAutoAnimate();

  // const { mutateAsync: comentar, isPending } = useMutation({ mutationFn: Commentar });
  const { mutateAsync: favoritar } = useMutation({ mutationFn: Favoritar });
  
  const { mutate: EliminarPedido } = useMutation({
    mutationFn: Deletar,
    onSuccess: (_, variables) => {
      queryClient.setQueryData(["orders", searchTerm], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.filter((pedido: any) => pedido.id !== variables.pedidoId);
      });
    },
  });

  const { data: orders, isLoading, refetch, isRefetching } = useQuery({
    queryKey: ["orders", searchTerm],
    queryFn: () => CostumerOrders({ query: searchTerm }),
  });

  // Estilização de Urgência
  const getUrgencyStyles = (brevidade: string) => {
    switch (brevidade) {
      case 'URGENTE': return "bg-red-500/10 text-red-500 border-red-500/20";
      case 'MEDIO': return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      default: return "bg-green-500/10 text-green-500 border-green-500/20";
    }
  };

  return (
    <motion.div 
      className="flex h-screen justify-center items-start p-4 lg:pt-20 md:p-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card className="w-full max-w-lg border-none bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex justify-between items-center mb-2">
            <div>
              <CardTitle className="text-3xl font-black tracking-tight">Meus Pedidos</CardTitle>
              <CardDescription className="font-medium">Gerencie suas solicitações ativas</CardDescription>
            </div>
            <div className="h-12 w-12 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-500">
              <Clock size={24} />
            </div>
          </div>
          
          <div className="relative group mt-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-orange-500 transition-colors" size={18} />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por título ou descrição..."
              className="h-12 pl-12 rounded-2xl bg-slate-100/50 dark:bg-slate-900/50 border-none focus-visible:ring-2 focus-visible:ring-orange-500/50 transition-all"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-320px)] px-6 pb-6">
            <div ref={parent} className="space-y-4">
              {isLoading ? (
                <PedidoSkeleton />
              ) : orders?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 opacity-40 text-center">
                  <File size={80} strokeWidth={1} />
                  <p className="mt-4 font-bold uppercase tracking-widest text-xs">Nenhum pedido ativo</p>
                </div>
              ) : (
                orders?.map((pedido) => (
                  <motion.div 
                    key={pedido.id}
                    layout
                    className="group relative p-4 rounded-3xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      {/* Avatar do Serviço */}
                      <div className="relative flex-shrink-0">
                        <Avatar className="w-14 h-14 rounded-2xl shadow-inner ring-2 ring-white dark:ring-slate-800">
                          <AvatarImage src={`${api.defaults.baseURL}/uploads/${pedido.image_path}`} className="object-cover" />
                          <AvatarFallback className="bg-orange-50 text-orange-500 font-bold">{pedido.title.substring(0,2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {pedido._count.interessados > 0 && (
                          <span className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center ring-4 ring-white dark:ring-slate-950 animate-bounce">
                            {pedido._count.interessados}
                          </span>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-lg text-slate-900 dark:text-slate-100 truncate">{pedido.title}</h4>
                          <button 
                            onClick={() => EliminarPedido({ pedidoId: pedido.id })}
                            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 leading-relaxed">
                          {pedido.content}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-3">
                          <Badge variant="outline" className={`rounded-lg px-2 py-0.5 font-bold text-[10px] ${getUrgencyStyles(pedido.brevidade)}`}>
                            {pedido.brevidade}
                          </Badge>
                          
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                            <MapPin size={12} className="text-orange-500" />
                            <span className="truncate max-w-[120px]">{pedido.location}</span>
                          </div>

                          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <Clock size={12} />
                            <span>{formatNotificationDate(pedido.created_at)}</span>
                          </div>
                        </div>

                        {/* Dropdown de Prestadores Refatorado */}
                        <div className="mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="w-full justify-between h-10 rounded-xl bg-slate-50 dark:bg-slate-900 hover:bg-orange-500 hover:text-white transition-all group/btn">
                                <div className="flex items-center gap-2">
                                  <Briefcase size={14} className="group-hover/btn:text-white text-orange-500 transition-colors" />
                                  <span className="text-xs font-bold">Interessados</span>
                                </div>
                                <ChevronDown size={14} className="opacity-50" />
                              </Button>
                            </DropdownMenuTrigger>
                            
                            <DropdownMenuContent align="end" className="w-[320px] p-2 rounded-[2rem] border-none shadow-2xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl">
                              <ScrollArea className="max-h-[350px]">
                                {pedido.interessados?.length > 0 ? (
                                  pedido.interessados.map((i: Interessado) => (
                                    <div key={i.prestadorId} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-2xl transition-all group/item">
                                      <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 rounded-xl ring-2 ring-orange-500/10">
                                          <AvatarImage src={`${api.defaults.baseURL}/uploads/${i.prestador.image_path}`} className="object-cover" />
                                          <AvatarFallback className="text-[10px] font-bold">{i.prestador.nome.substring(0,2)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0">
                                          <p className="text-sm font-bold truncate">{i.prestador.nome}</p>
                                          <p className="text-[10px] text-muted-foreground uppercase font-black tracking-wider">{i.prestador.profissao}</p>
                                        </div>
                                        <PedidoCard refetch={refetch} isRefetching={isRefetching} prestadorId={i.prestadorId} id={pedido.id} status={i.status} />
                                      </div>
                                      
                                      <div className="mt-3 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-3">
                                          <button onClick={() => favoritar({ prestadorId: i.prestadorId })} className="text-slate-400 hover:text-orange-500 transition-colors">
                                            <Pin size={14} />
                                          </button>
                                          <Dialog>
                                            <DialogTrigger asChild>
                                              <button className="text-slate-400 hover:text-blue-500 transition-colors">
                                                <MessageCircle size={14} />
                                              </button>
                                            </DialogTrigger>
                                            <DialogContent className="rounded-[2.5rem]">
                                              <DialogHeader>
                                                <DialogTitle>Avaliar {i.prestador.nome}</DialogTitle>
                                                <DialogDescription>Deixe um feedback sobre o atendimento.</DialogDescription>
                                              </DialogHeader>
                                              {/* Form logic aqui... */}
                                            </DialogContent>
                                          </Dialog>
                                        </div>
                                        <a href={`tel:+244${i.prestador.celular}`} className="flex items-center gap-1 text-[10px] font-bold text-blue-500">
                                          <Phone size={12} /> +244 {i.prestador.celular}
                                        </a>
                                      </div>
                                    </div>
                                  ))
                                ) : (
                                  <div className="py-8 text-center text-muted-foreground">
                                    <AlertCircle size={32} className="mx-auto mb-2 opacity-20" />
                                    <p className="text-xs font-bold">Ninguém interessado ainda</p>
                                  </div>
                                )}
                              </ScrollArea>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function PedidoSkeleton() {
  return [...Array(3)].map((_, i) => (
    <div key={i} className="p-4 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-3">
      <div className="flex gap-4">
        <Skeleton className="h-14 w-14 rounded-2xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
      <Skeleton className="h-10 w-full rounded-xl" />
    </div>
  ));
}