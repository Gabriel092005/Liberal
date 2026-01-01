import { Commentar } from "@/api/commentar-prestadores";
import { CostumerOrders, Interessado } from "@/api/costumer-orders";
import { Deletar } from "@/api/deletar-order";
import { Favoritar } from "@/api/favoritar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/axios";
import { queryClient } from "@/lib/react-query";
import { socket } from "@/lib/socket";
import { formatNotificationDate } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { AlertCircle, Briefcase, ChevronDown, Clock, File, MapPin, MessageCircle, Phone, Pin, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import z from "zod";
import { PedidoCard } from "./pedidos-confirmar";
import { StarButton } from "./stars-button";

export function SearchPedidos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromParams = searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(queryFromParams);
  const userId = searchParams.get("userId")

  const {mutateAsync:comentar} = useMutation({
    mutationFn:Commentar
  })

  
  const avaliarPrestadoresBodySchema = z.object({
    content:z.string()
  })
  function handleSetCommentSearchParams ({userId}:{userId:string}){
      setSearchParams(state=>{
         state.append("userId" ,userId)
         return state
      })
  }

  type AvaliarPrestadoresSchemaTypes = z.infer< typeof avaliarPrestadoresBodySchema>

  const {handleSubmit, register,reset} = useForm<AvaliarPrestadoresSchemaTypes>()

  async function handlecomentar(data:AvaliarPrestadoresSchemaTypes)
  {
     const { content} = data
     await comentar({
      content,
      userId:Number(userId)
     })
    reset()
  }

 

    const {mutateAsync:favoritar} = useMutation({
    mutationFn : Favoritar,
  })
const { mutate: EliminarPedido } = useMutation({
    mutationFn: Deletar,
    onSuccess: (_data, variables) => {
      // Remove o pedido localmente sem refazer o fetch
      queryClient.setQueryData(["orders", searchTerm], (oldData: any) => {
        if (!oldData) return oldData;
        return oldData.filter((pedido: any) => pedido.id !== variables.pedidoId);
      });
    },
  });
  const { data: orders, isLoading, refetch,isRefetching } = useQuery({
  queryKey: ["orders", searchTerm],
  refetchOnWindowFocus: true,     // Rebusca ao voltar ao foco
  refetchOnReconnect: true,       // Rebusca se a internet voltar
  refetchOnMount: true,           // Rebusca sempre que o componente monta
  staleTime: 0,    
    queryFn: () => CostumerOrders({ query: searchTerm }),
  });


   useEffect(() => {
      socket.on("order", (data) => {
        console.log("🔔 Nova notificação recebida:", data);
        refetch();
      });
      return () => {
        socket.off("order");
      };
    }, [refetch]);

  



  const [parent] = useAutoAnimate<HTMLDivElement>();

  

  // Atualiza a URL com debounce
  useEffect(() => {
    const timeout = setTimeout(() => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (searchTerm) {
          newParams.set("query", searchTerm);
        } else {
          newParams.delete("query");
        }
        return newParams;
      });
      refetch(); // atualiza a lista sempre que searchTerm muda
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm, setSearchParams, refetch]);

  // Socket para atualização em tempo real
  // useEffect(() => {
  //   socket.on("user", () => {
  //     refetch();
  //   });
  //   return () => socket.off("user");
  // }, [refetch]);


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
                                  <span className="text-xs font-bold"> Interessados</span>
                                </div>
                                <ChevronDown size={14} className="opacity-50" />
                              </Button>
                            </DropdownMenuTrigger>
                            
                            <DropdownMenuContent align="end" className="w-[320px] p-2 rounded-[2rem] border-none shadow-2xl bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl">
                              <ScrollArea className="max-h-[350px]">
                                {pedido.interessados?.length > 0 ? (
                                  pedido.interessados.map((i: Interessado) => (
               <div key={i.prestadorId} className="group/item relative p-4 rounded-[2rem] bg-white/50 dark:bg-zinc-900/50 border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-white dark:hover:bg-zinc-900 hover:shadow-2xl hover:shadow-orange-500/5 transition-all duration-500">
  <div className="flex items-center gap-4">
    {/* Avatar Section com Shape Moderno */}
    <div className="relative">
      <Avatar className="h-12 w-12 rounded-2xl ring-2 ring-offset-2 ring-offset-white dark:ring-offset-zinc-950 ring-transparent group-hover/item:ring-orange-500/20 transition-all duration-500">
        <AvatarImage 
          src={`${api.defaults.baseURL}/uploads/${i.prestador.image_path}`} 
          className="object-cover" 
        />
        <AvatarFallback className="bg-orange-100 text-orange-600 text-xs font-bold">
          {i.prestador.nome.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      {/* Indicador de Status Online (Opcional) */}
      <span className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 border-2 border-white dark:border-zinc-950 rounded-full" />
    </div>

    {/* Nome e Info */}
    <div className="flex-1 min-w-0">
      <p className="text-base font-black tracking-tight text-zinc-800 dark:text-zinc-100 truncate">
        {i.prestador.nome}
      </p>
      <div className="inline-flex items-center px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-[9px] font-black uppercase tracking-widest mt-0.5">
        {i.prestador.profissao}
      </div>
    </div>

    {/* Componente de Status/Ação principal */}
    <PedidoCard 
      refetch={refetch} 
      isRefetching={isRefetching} 
      prestadorId={i.prestadorId} 
      id={pedido.id} 
      status={i.status} 
    />
  </div>

  {/* Footer de Ações - Aparece suavemente no Hover */}
  <div className="mt-4 pt-3 border-t border-zinc-100 dark:border-zinc-800/50 flex items-center justify-between opacity-0 group-hover/item:opacity-100 transform translate-y-2 group-hover/item:translate-y-0 transition-all duration-300">
    <div className="flex items-center gap-2">
      {/* Botões Estilizados como Glass */}
      <Button 
        variant="ghost" 
        onClick={() => favoritar({ prestadorId: i.prestadorId })}
        className="h-9 w-9 p-0 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-orange-500/10 hover:text-orange-600 transition-colors"
      >
        <Pin size={15} />
      </Button>

      <Button 
        variant="ghost"
        className="h-9 w-9 p-0 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-yellow-500/10 hover:text-yellow-600 transition-colors"
      >
        <StarButton prestadorId={i.prestadorId} />
      </Button>

      <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="ghost"
            className="h-9 w-9 p-0 rounded-xl bg-zinc-100 dark:bg-zinc-800 hover:bg-blue-500/10 hover:text-blue-600 transition-colors"
          >
            <MessageCircle size={15} />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px] rounded-[2.5rem] p-6 backdrop-blur-2xl bg-white/90 dark:bg-zinc-950/90 border-zinc-200/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black tracking-tighter uppercase">Avaliar Atendimento</DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium">
              Sua opinião ajuda a comunidade a escolher os melhores profissionais.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit(handlecomentar)} className="space-y-4 mt-4">
            <Textarea 
              {...register('content')} 
              placeholder="Como foi sua experiência?"
              className="min-h-[120px] rounded-3xl border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50 focus:ring-orange-500/20"
            />
            <Button type="submit" className="w-full h-12 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold uppercase tracking-widest transition-all active:scale-95">
              Enviar Avaliação
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>

    {/* Link de Telefone Minimalista */}
    <a 
      href={`tel:+244${i.prestador.celular}`} 
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-zinc-950/10"
    >
      <Phone size={12} className="fill-current" />
      <span className="text-[10px] font-black uppercase tracking-tighter">+244 {i.prestador.celular}</span>
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
