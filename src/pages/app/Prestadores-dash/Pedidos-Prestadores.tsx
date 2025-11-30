import {  File,InfoIcon, MapPin, MoveDownLeft, MoveUpRight, Search} from "lucide-react";
import {  motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { ServicesDialogDetails } from "./ServicesDialogDetails";
import { useEffect,  useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { InterestedOrdersPrestadores } from "@/api/fetch-interrested-orders";
import { FetchAllOrders } from "@/api/fetch-all";
import { SkeletonsDemo } from "./NearClientsSearch";
import { InteressarPedidos } from "@/api/interessar-pedido";
import { useSearchParams } from "react-router-dom";
import { BotaoNegociar } from "./botao-negociar";
import { toast } from "sonner";
import { api } from "@/lib/axios";



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

  // 🔹 Atualiza os parâmetros de busca na URL automaticamente
  useEffect(() => {
    const newParams = new URLSearchParams();
    if (debouncedQuery) newParams.set("query", debouncedQuery);
    setSearchParams(newParams);
  }, [debouncedQuery, setSearchParams]);

  // 🔹 Query principal com base no filtro atual
  const { data: orders, isLoading } = useQuery({
    queryKey: ["orders", filter, debouncedQuery],
    queryFn: async () => {
      if (filter === "all") {
        return await FetchAllOrders({ query: debouncedQuery });
      } else {
        return await InterestedOrdersPrestadores();
      }
    },
    // keepPreviousData: true, // mantém os resultados antigos enquanto carrega novos
    staleTime: 1000 * 30, // 30s de cache fresco
  });

  const { mutateAsync: SeInteressar,isSuccess } = useMutation({
    mutationFn: InteressarPedidos,
    onSuccess: () => toast.success("Pedido marcado para negociação!"),
    onError: () => toast.error("Oops! Só pode negociar uma vez!"),
  });

  // 🔹 Loader elegante
  if (isLoading) {
    return (
      <div>
        <SkeletonsDemo />
        <SkeletonsDemo />
        <SkeletonsDemo />
      </div>
    );
  }

  return (
    <motion.div
      className="flex h-screen justify-center items-start mt-2"
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="max-w-lg relative right-[2.5rem] overflow-hidden border-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Pedidos</CardTitle>
          <CardDescription className="text-xs mb-2">
            {filter === "all"
              ? "Aqui você encontra todos os pedidos do sistema."
              : "Aqui estão os pedidos que você demonstrou interesse."}
          </CardDescription>

          {/* 🔹 Barra de busca */}
          <div className="relative mb-3">
            <Input
              placeholder="O que você precisa?"
              className="bg-zinc-200 dark:bg-black pl-10 w-full max-w-[320px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" size={20} />
          </div>

          {/* 🔹 Filtros */}
          <div className="flex gap-3">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              onClick={() => setFilter("all")}
            >
              Todos Pedidos <MoveUpRight />
            </Button>
            <Button
              variant={filter === "accepted" ? "default" : "outline"}
              onClick={() => setFilter("accepted")}
            >
              Pedidos Negociar <MoveDownLeft />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0 max-h-[400px] overflow-auto">
          <Table>
            <TableBody>
              {!orders?.length ? (
                <div className="flex items-center justify-center flex-col p-4">
                  <File className="text-muted-foreground" size={74} />
                  <span className="text-muted-foreground">Nenhum pedido encontrado.</span>
                </div>
              ) : (
                orders.map((card) => {
                  const isInteresseComPedido = "pedido" in card;
                  const pedido = isInteresseComPedido ? card.pedido : card;
                  return (
                    <TableRow key={card.id} className="h-14 cursor-pointer hover:bg-muted/40">
                      <TableCell className="flex items-center gap-3 py-2 px-2">
                        <Avatar className="w-10 h-10 ring-2 ring-orange-300 shadow-sm">
                          {pedido?.image_path ? (
                            <AvatarImage src={`${api.defaults.baseURL}/uploads/${pedido.image_path}`} />
                          ) : (
                            <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
                              {pedido?.title?.slice(0, 2).toUpperCase() ?? "SN"}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex flex-col leading-tight">
                          <div className="flex gap-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{pedido?.title ?? "Sem título"}</span>
                              <span className="text-[0.65rem] w-[10rem] truncate text-muted-foreground">
                                {pedido?.content ?? "Sem descrição"}
                              </span>
                            </div>
                            <div className="relative left-32 flex items-baseline">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <InfoIcon size={24} className="dark:text-blue-400 text-blue-400 relative right-12 cursor-pointer" />
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
                          </div>
                          <span className="text-muted-foreground text-xs font-bold">
                            status:{" "}
                            <span
                              className={
                                pedido?.brevidade === "URGENTE"
                                  ? "text-red-500"
                                  : pedido?.brevidade === "MEDIO"
                                  ? "text-yellow-500"
                                  : "text-green-500"
                              }
                            >
                              {pedido?.brevidade ?? ""}
                            </span>
                          </span>
                        </div>
                      </TableCell>

                      <TableCell className="flex items-center gap-2 px-2">
                        {/* <X size={16} className="text-red-400 cursor-pointer" /> */}
                        <div className="flex text-orange-400">
                          <MapPin size={16} />
                          <span className="font-bold w-[10rem] truncate">
                            {pedido?.location ?? "Local não informado"}
                          </span>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                             <BotaoNegociar  celular={pedido.autor.celular} image_path={pedido.autor.image_path} isSuccess={isSuccess} nome={pedido.autor.nome}  onClick={() => SeInteressar({ pedidoId: Number(pedido.id) })} />
                          </DialogTrigger>
                        </Dialog>
                      </TableCell>

      

           
                    </TableRow>
                  );
                })

                
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
