import { Briefcase, ChevronDown, File, MapPin, MessageCircle, Phone, Pin, Search, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CostumerOrders, Interessado} from "@/api/costumer-orders";
import { formatNotificationDate } from "@/lib/utils";
import { api } from "@/lib/axios";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { StarButton } from "./stars-button";
import { PedidoCard } from "./pedidos-confirmar";
import { socket } from "@/lib/socket";
import { Favoritar } from "@/api/favoritar";
import { Deletar } from "@/api/deletar-order";
import { queryClient } from "@/lib/react-query";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import z from "zod";
import { Commentar } from "@/api/commentar-prestadores";


export function SearchPedidos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromParams = searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(queryFromParams);
  const userId = searchParams.get("userId")

  const {mutateAsync:comentar, isPending} = useMutation({
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

  return (
    <motion.div
      className="flex h-screen justify-center items-start mt-2"
      initial={{ x: "-100%", opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <Card className="w-[22rem] max-w-lg relative right-[2.5rem] overflow-hidden border-none">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Pedidos</CardTitle>
          <CardDescription className="text-xs mb-2">
            Aqui você encontra os últimos pedidos feitos.
          </CardDescription>
          <div className="relative flex gap-1">
            <Button variant="outline">
              <Search />
            </Button>
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar..."
              className="mt-0.5"
            />
          </div>
        </CardHeader>

       
        <CardContent ref={parent} className="p-0 max-h-[400px] overflow-auto">
           {!orders  || orders.length===0 &&  (
          <div className="flex items-center justify-center">
              <div className="flex flex-col items-center">
                   <File className="text-muted-foreground" size={105}></File>
                   <span className="text-muted-foreground">Nenhum pedido feito por enquanto</span>
              </div>
          </div>
        )}

          <Table>
            <TableBody>
              {isLoading
                ? [...Array(5)].map((_, idx) => (
                    <TableRow key={idx} className="h-14">
                      <TableCell className="flex items-center gap-3 py-2 px-2">
                        <Skeleton className="w-10 h-10 rounded-full" />
                        <div className="flex flex-col gap-2 w-[16rem]">
                          <Skeleton className="h-5 w-1/2 rounded" />
                          <Skeleton className="h-4 w-3/4 rounded" />
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center gap-2 px-2">
                        <Skeleton className="h-4 w-10 rounded" />
                      </TableCell>
                    </TableRow>
                  ))
                : orders?.map((card) => (
                    <TableRow key={card.id} className="h-14 relative">
                      <TableCell className="flex items-center gap-3 py-2 px-2">
                        <Avatar className="w-10 h-10 ring-2 ring-orange-300 shadow-sm">
                          {card.image_path ? (
                            <AvatarImage src={`${api.defaults.baseURL}/uploads/${card.image_path}`} />
                          ) : (
                            <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
                              {card.title.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>

                        <div className="flex flex-col leading-tight w-full">
                          <div className="flex justify-between items-start">
                            <div className="flex flex-col">
                              <span className="text-xl font-medium">{card.title}</span>
                              <span className="text-[0.65rem] truncate max-w-60 text-muted-foreground">{card.content}</span>
                            </div>

                            {card._count.interessados > 0 && (
                              <span className="bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-md">
                                {card._count.interessados}
                              </span>
                            )}
                          </div>

                          <div className="mt-1 text-[0.65rem] text-muted-foreground flex justify-between items-center">
                            <span>
                              {card.brevidade==='BAIXO' &&(
                               <>
                                    Urgência: <span className="text-green-500 font-bold">Pouca</span>
                               </>
                              )}

                                {card.brevidade==='URGENTE' &&(
                               <>
                                    Urgência: <span className="text-red-500 font-bold">Muita</span>
                               </>
                              )}
                                   {card.brevidade==='MEDIO'&&(
                               <>
                                    Urgência: <span className="text-orange-500 font-bold">Normal</span>
                               </>
                              )}
                            </span>
                            <span className="text-[0.65rem] text-muted-foreground">
                              {formatNotificationDate(card.created_at)}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="flex items-center gap-[3rem] px-2">
                        <div className="flex items-center gap-1 text-orange-400">
                       <Button onClick={()=>EliminarPedido({pedidoId:card.id})} variant='outline'>
                           <Trash2 size={16} className="text-red-400 cursor-pointer" />
                       </Button>
                          <MapPin size={16} />
                          <span className="font-bold text-xs max-w-[110px] truncate" title={card.location}>
                            {card.location}
                          </span>
                        </div>
                        <DropdownMenu>
                          {card.interessados? (
                            <DropdownMenuTrigger>
                              <Button variant="outline">
                                <span className="text-muted-foreground flex text-xs items-center">
                                  Prestadores
                                  <ChevronDown />
                                </span>
                              </Button>
                            </DropdownMenuTrigger>
                          ):(
                            <div>sem prestadores</div>
                          )}

                         {card.interessados.length>0 &&(
                             <DropdownMenuContent className="w-80 p-3">
                      {card.interessados.map((i: Interessado, idx: number) => (
  <div
key={`${card.id}-${i.prestadorId}`}
  className={`
    flex items-start gap-3 p-3 rounded-xl transition-all
    hover:bg-muted/50 hover:shadow-sm
    ${idx !== card.interessados.length - 1 ? "border-b border-muted/30" : ""}
    `}
    >
    
    {/* Avatar */}
    <Avatar className="w-11 h-11 ring-2 ring-orange-300/60 shadow-sm flex-shrink-0">
      {i.prestador.image_path ? (
        <AvatarImage
          src={`${api.defaults.baseURL}/uploads/${i.prestador.image_path}`}
        />
      ) : (
        <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-sm">
          {i.prestador.nome.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      )}
    </Avatar>

    {/* Conteúdo principal */}
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start gap-3">
        
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-semibold text-foreground truncate">
            {i.prestador.nome}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1 truncate">
            <Briefcase size={13} className="text-orange-500" /> {i.prestador.profissao}
          </span>
          <span className="text-xs text-muted-foreground flex items-center gap-1 truncate">
            <MapPin size={13} className="text-orange-400" /> {i.prestador.municipio},{" "}
            {i.prestador.provincia}
          </span>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
       
            
          <PedidoCard
            refetch={refetch}
            isRefetching={isRefetching}
            prestadorId={i.prestadorId}
            id={card.id}
            status={i.status}
          />

          
        </div>
      </div>
      <div className="mt-2">
        <div className="flex items-center gap-[4rem] text-xs text-muted-foreground">
          <div className="flex">
             <Phone size={13} className="text-blue-500" />
            <span className="font-medium">+244{i.prestador.celular}</span>
          </div>
          <div className="flex gap-2 ">
            <Pin onClick={() => favoritar({ prestadorId: i.prestadorId })} className="w-4 h-4 text-muted-foreground"  />
                <Dialog>
              <DialogTrigger onClick={()=>handleSetCommentSearchParams({userId:i.prestadorId.toString()})}  asChild>
                   <MessageCircle className="w-4 h-4 text-blue-400" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader className="flex items-start">
                  <DialogTitle>Avaliação</DialogTitle>
                  <DialogDescription>Pode avaliar prestadores com um comentário e estrela</DialogDescription>
                </DialogHeader>


                 <form onSubmit={handleSubmit(handlecomentar)} className="flex gap-3">
                  <Input {...register('content')}></Input>
                  <Button disabled={isPending} type="submit">Comentar</Button>
                  </form>
              </DialogContent>
                  <StarButton prestadorId={i.prestador.id} />
           </Dialog>

          </div>
        </div>
      </div>
    </div>
  </div>
))}

                            </DropdownMenuContent>
                         )}
                         {card.interessados.length<=0 && (
                          <DropdownMenuContent className="flex flex-col items-center">
                              <File className="flex text-muted-foreground"></File>
                              <span className="text-muted-foreground text-xs">Sem Prestadores Interessados</span>
                          </DropdownMenuContent>
                         )}
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
