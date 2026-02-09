import { FetchAllOrders } from "@/api/fetch-all";
import { InterestedOrdersPrestadores } from "@/api/fetch-interrested-orders";
import { InteressarPedidos } from "@/api/interessar-pedido";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { File, InfoIcon, MapPin, MoveDownLeft, MoveUpRight, RefreshCw, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { BotaoNegociar } from "./botao-negociar";
import { SkeletonsDemo } from "./NearClientsSearch";
import { ServicesDialogDetails } from "./ServicesDialogDetails";

function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export function PrestadoresPedidos() {
  const [filter, setFilter] = useState<"all" | "accepted">("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromParams = searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(queryFromParams);
  const debouncedQuery = useDebounce(searchTerm, 400);

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
      className="fixed inset-0 flex items-center justify-center bg-background px-4 py-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="w-full max-w-md h-full max-h-[92dvh] flex flex-col border-none shadow-none md:shadow-lg overflow-hidden bg-transparent md:bg-card">
        
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
              <div className="space-y-3">
                {orders.map((card) => {
                  const isInteresseComPedido = "pedido" in card;
                  const pedido = isInteresseComPedido ? card.pedido : card;

                  return (
                    <motion.div
                      key={card.id}
                      layout
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="group bg-white dark:bg-zinc-900 p-4 rounded-[1.5rem] border border-zinc-100 dark:border-zinc-800 active:scale-[0.98] transition-transform"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex gap-3 min-w-0">
                          <Avatar className="w-10 h-10 rounded-xl ring-2 ring-orange-500/10 shrink-0">
                            <AvatarImage src={`${api.defaults.baseURL}/uploads/${pedido.image_path}`} />
                            <AvatarFallback className="bg-orange-100 text-orange-600 rounded-xl text-xs font-bold">
                              {pedido?.title?.charAt(0) ?? "S"}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="flex flex-col min-w-0">
                            <h4 className="font-bold text-sm truncate uppercase tracking-tight">
                              {pedido?.title}
                            </h4>
                            <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                              {pedido?.content}
                            </p>
                          </div>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full shrink-0 h-8 w-8">
                              <InfoIcon className="text-blue-500" size={18} />
                            </Button>
                          </DialogTrigger>
                          <ServicesDialogDetails
                            status={pedido.status}
                            isSucces={isSuccess}
                            nome={pedido.autor.nome}
                            celular={pedido.autor.celular}
                            provincia={pedido.autor.provincia}
                            image_path={pedido.autor.image_path}
                            municipio={pedido.autor.municipio}
                          />
                        </Dialog>
                      </div>

                      <div className="mt-3 flex items-center justify-between gap-2 pt-3 border-t border-zinc-50 dark:border-zinc-800/50">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-1 text-orange-500">
                            <MapPin size={12} strokeWidth={2.5} />
                            <span className="text-[10px] font-black uppercase truncate max-w-[100px]">
                              {pedido?.location}
                            </span>
                          </div>
                          <Badge variant="secondary" className={`w-fit text-[8px] px-1.5 py-0 h-4 font-bold ${
                            pedido?.brevidade === "URGENTE" ? "bg-red-100 text-red-600 dark:bg-red-900/30" :
                            pedido?.brevidade === "MEDIO" ? "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30" :
                            "bg-green-100 text-green-600 dark:bg-green-900/30"
                          }`}>
                            {pedido?.brevidade}
                          </Badge>
                        </div>

                     <BotaoNegociar 
  celular={pedido.autor.celular} 
  image_path={pedido.autor.image_path} 
  isSucess={true}  // Ajustado para bater com a interface (sucess)
  status={pedido.status} // ADICIONE ESTA LINHA (ou 'PENDING', etc)
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