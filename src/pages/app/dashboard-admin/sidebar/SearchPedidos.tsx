import { Commentar } from "@/api/commentar-prestadores";
import { CostumerOrders, Interessado } from "@/api/costumer-orders";
import { Deletar } from "@/api/deletar-order";
import { Favoritar } from "@/api/favoritar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/axios";
import { queryClient } from "@/lib/react-query";
import { socket } from "@/lib/socket";
import { formatNotificationDate, getInialts } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Briefcase, ChevronRight, Clock, File, MapPin, Maximize2, MessageCircle, Phone, Pin, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import z from "zod";
import { EmptyInteressados } from "./EmptyInterssados";
import { ExpandableContent } from "./pedido-description";
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
         state.set("userId" ,userId)
         return state
      })
  }

  type AvaliarPrestadoresSchemaTypes = z.infer< typeof avaliarPrestadoresBodySchema>

  const {handleSubmit, register,reset} = useForm<AvaliarPrestadoresSchemaTypes>()

  async function handlecomentar(data:AvaliarPrestadoresSchemaTypes)
  {
    console.log("data",data)
    const { content} = data
     await comentar({
      content,
      userId:Number(userId)
     })
    reset()
  }

 

    const {mutateAsync:favoritar} = useMutation({
    mutationFn : Favoritar,
    onSuccess(){
      toast.success("O Prestador foi colocado nos favoritos com sucesso.")
    }
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
  const { data: orders, isLoading, refetch} = useQuery({
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
      <Card className="w-full max-w-lg border-none bg-white/80 dark:bg-zinc-950  backdrop-blur-xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] rounded-[2.5rem] overflow-hidden">
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
              className="h-12 pl-12 rounded-2xl bg-slate-100/50  dark:bg-zinc-900   border-none focus-visible:ring-2 focus-visible:ring-orange-500/50 transition-all"
            />
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-320px)] px-1 pb-6">
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
                    className="group relative p-4 rounded-3xl border border-slate-100   bg-white dark:bg-zinc-950 dark:border-none  hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300"
                  >
                    <div className="flex gap-4">
                      {/* Avatar do Serviço */}
                      <div className="relative flex-shrink-0">


<Dialog>
  <DialogTrigger asChild>
    <div className="relative group cursor-zoom-in">
      <Avatar className="w-14 h-14 rounded-2xl shadow-inner ring-2 ring-white dark:ring-slate-800 transition-transform duration-300 group-hover:scale-105">
        <AvatarImage 
          src={`${api.defaults.baseURL}/uploads/${pedido.image_path}`} 
          className="object-cover" 
        />
        <AvatarFallback className="bg-orange-50 text-orange-500 font-bold">
          {pedido.title.substring(0,2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      {/* Overlay sutil de hover */}
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
        <Maximize2 size={14} className="text-white shadow-sm" />
      </div>
    </div>
  </DialogTrigger>

  <DialogContent className="max-w-[90vw] sm:max-w-[500px] p-0 overflow-hidden bg-transparent border-none shadow-none z-[9999]">
    {/* Animação de entrada da foto */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative aspect-square w-full"
    >
      <img 
        src={`${api.defaults.baseURL}/uploads/${pedido.image_path}`} 
        alt={pedido.title}
        className="w-full h-full object-cover rounded-[2.5rem] shadow-2xl ring-4 ring-white/10"
      />
      
      {/* Legenda Flutuante */}
      <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/40 backdrop-blur-md rounded-[1.5rem] border border-white/10">
        <p className="text-white font-black italic uppercase tracking-tighter text-sm">
          {pedido.title}
        </p>
        <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-0.5">
          Visualização do Pedido
        </p>
      </div>

     
    </motion.div>
  </DialogContent>
</Dialog>
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
                        
                      <ExpandableContent content={pedido.content}></ExpandableContent>

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
                        <div className="mt-4  -ml-10 border-t border-slate-50 dark:border-slate-800">
               
                              <div className="w-full max-w-full sm:px-0">
      {/* Header Adaptável */}
      <div className="flex items-center justify-between  px-2">
        <div className="flex items-center gap-2">
          <Briefcase size={16} className="text-orange-500" />
          <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-zinc-500">
            Interessados ({pedido.interessados?.length || 0})
          </h3>
        </div>
      </div>

      <ScrollArea className="h-[400px] sm:h-[200px] w-full pr-2">
        {pedido.interessados?.length > 0 ? (
          <Accordion type="single" collapsible className="w-full space-y-3">
            {pedido.interessados.map((i: Interessado) => (
              <AccordionItem
                key={i.prestadorId}
                value={String(i.prestadorId)}
                className="border-none bg-white dark:bg-zinc-900/50 rounded-[1.5rem] sm:rounded-[2rem] px-3 sm:px-4 border border-zinc-100 dark:border-zinc-800 shadow-sm overflow-hidden"
              >
                {/* CABEÇALHO RESPONSIVO */}
                <AccordionTrigger className="hover:no-underline py-4 group">
                  <div className="flex items-center justify-between w-full gap-2">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                   <Dialog>
  <DialogTrigger asChild>
    <div className="relative ">
      <Avatar className="w-14 h-14 rounded-2xl shadow-inner ring-2 ring-white dark:ring-slate-800 transition-transform duration-300 group-hover:scale-105">
        <AvatarImage 
          src={`${api.defaults.baseURL}/uploads/${i.prestador.image_path}`} 
          className="object-cover" 
        />
        <AvatarFallback className="bg-orange-50 text-orange-500 font-bold">
        {getInialts(i.prestador.nome)}
        </AvatarFallback>
      </Avatar>
      
      {/* Overlay sutil de hover */}
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
        <Maximize2 size={14} className="text-white shadow-sm" />
      </div>
    </div>
  </DialogTrigger>

  <DialogContent className="max-w-[90vw] sm:max-w-[500px] p-0 overflow-hidden bg-transparent border-none shadow-none z-[9999]">
    {/* Animação de entrada da foto */}
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="relative aspect-square w-full"
    >
      <img 
        src={`${api.defaults.baseURL}/uploads/${i.prestador.image_path}`} 
        alt={i.prestador.nome}
        className="w-full h-full object-cover rounded-[2.5rem] shadow-2xl ring-4 ring-white/10"
      />
      
      {/* Legenda Flutuante */}
      <div className="absolute bottom-4 left-4 right-4 p-4 bg-black/40 backdrop-blur-md rounded-[1.5rem] border border-white/10">
        <p className="text-white font-black italic uppercase tracking-tighter text-sm">
          {i.prestador.profissao}
        </p>
        <p className="text-white/70 text-[10px] font-bold uppercase tracking-widest mt-0.5">
          Visualização do Pedido
        </p>
      </div>

     
    </motion.div>
  </DialogContent>
</Dialog>
                        <span className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                      </div>

                      <div className="text-left min-w-0">
                        <p className="text-xs sm:text-sm font-black text-zinc-800 dark:text-zinc-100 truncate pr-2 uppercase">
                          {i.prestador.nome.split(' ')[0]} {/* Apenas primeiro nome no mobile */}
                        </p>
                        <p className="text-[8px] sm:text-[10px] font-bold text-orange-500 uppercase tracking-tighter sm:tracking-widest truncate">
                          {i.prestador.profissao}
                        </p>
                      </div>
                    </div>
                    
                    {/* Botão de Status (Oculto em telas muito pequenas se necessário, ou reduzido) */}
                    <div className="shrink-0 scale-75 sm:scale-90 origin-right">
                       <PedidoCard
                          refetch={refetch}
                          prestadorId={i.prestadorId}
                          id={pedido.id}
                          status={i.status}
                        />
                    </div>
                  </div>
                </AccordionTrigger>

                {/* CONTEÚDO EXPANSÍVEL (Ações focadas em toque) */}
                <AccordionContent className="pb-5 pt-0">
                  <div className="flex flex-col gap-3 mt-2 border-t border-zinc-50 dark:border-zinc-800/50 pt-4">
                    
                    {/* Grid de Botões Secundários */}
                    <div className="grid grid-cols-3 gap-2 w-full">
                      <Button
                        variant="secondary"
                        onClick={() => favoritar({ prestadorId: i.prestadorId })}
                        className="h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center gap-1"
                      >
                        <Pin size={14} className="text-zinc-500" />
                        <span className="text-[8px] font-black uppercase">Fixar</span>
                      </Button>

                      <Button
                        variant="secondary"
                        className="h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center gap-1"
                      >
                        <StarButton prestadorId={i.prestadorId} />
                        <span className="text-[8px] font-black uppercase">Avaliar</span>
                      </Button>
                      <Dialog>
  <DialogTrigger asChild>
    <Button
      variant="secondary"
      onClick={() => handleSetCommentSearchParams({ userId: String(i.prestadorId) })}
      className="h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex flex-col items-center justify-center gap-1"
    >
      <MessageCircle size={14} className="text-zinc-500" />
      <span className="text-[8px] font-black uppercase">comentar</span>
    </Button>
  </DialogTrigger>

  {/* Usamos DialogPortal sem o DialogOverlay */}
    <DialogContent 
    
      className="z-[1001] fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] sm:max-w-[400px] rounded-[2rem] p-6 bg-white dark:bg-zinc-950 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)] border-zinc-200 dark:border-zinc-800 outline-none"
    >
      <DialogHeader>
        <DialogTitle className="text-xl font-black uppercase tracking-tighter">
          Avaliar Prestador
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit(handlecomentar)} className="mt-4 space-y-4">
        <p className="text-xs font-medium text-zinc-500">
          Diga como foi o serviço de <span className="text-orange-500 font-bold">{i.prestador.nome}</span>
        </p>
        
        <Textarea 
         {...register('content')}
          placeholder="Escreva aqui..." 
          className="min-h-[100px] rounded-2xl bg-zinc-50 dark:bg-zinc-900 border-none focus-visible:ring-orange-500"
        />
        
        <Button type="submit" className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-xs tracking-widest">
          Enviar Comentário
        </Button>
      </form>
    </DialogContent>
</Dialog>
                     
                    </div>

                    {/* Botão de Chamada - Grande para Mobile */}
                    <a
                      href={`tel:+244${i.prestador.celular}`}
                      className="flex items-center justify-between w-full h-14 px-4 rounded-xl bg-orange-500 text-white shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <Phone size={18} fill="currentColor" />
                        <div className="text-left">
                          <p className="text-[7px] font-black uppercase opacity-80 leading-none">Ligar agora para</p>
                          <p className="text-xs font-black tracking-widest">+244 {i.prestador.celular}</p>
                        </div>
                      </div>
                      <ChevronRight size={16} />
                    </a>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
         <EmptyInteressados></EmptyInteressados>
        )}
      </ScrollArea>
    </div>
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
