"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input";


import { Table, TableBody, TableCell,TableRow } from "@/components/ui/table";
import { Search,Briefcase, ChevronDown, MapPin, Phone } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getInialts } from "@/lib/utils";
import { api } from "@/lib/axios";
import { FetchAllOrders } from "@/api/fetch-all";
import { useQuery } from "@tanstack/react-query";
import { TableSkeleton } from "../skeletons-table";





export function PedidosFilters() {
  const [searchParams, setSearchParams] = useSearchParams();


    const queryFromParams = searchParams.get("query") || "";
    const [searchTerm, setSearchTerm] = useState(queryFromParams);
  
  

      const {data:orders,refetch, isLoading} = useQuery({
      queryKey:['orders',searchParams],
      queryFn:()=>FetchAllOrders({query:searchTerm})
    })






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

  // Mock de pedidos
  if(!orders){
      return
  }
  return (
    <div className="space-y-6 pt-24 ">
      <Card className="rounded-2xl  relative block:max-w-lg lg:w-full lg:left-1 dark:bg-muted shadow-2xl border border-gray-200 dark:border-none p-6">
         <CardHeader className="mb-3 ">
           <CardTitle className="text-xl font-semibold flex items-center text-gray- dark:text-muted-foreground">
             <Briefcase></Briefcase>
              Pedidos</CardTitle>
           <CardDescription className="text-gray-500 text-sm">
             Todos os pedidos feitos pelos clientes
           </CardDescription>
        <div className="relative flex items-center mt-5 w-full max-w-md mx-auto">
             <Search className="absolute left-3 text-gray-400 dark:text-gray-500 pointer-events-none" size={18} />
             <Input
               type="text"
               placeholder="O que você precisa?"
               value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2 rounded-full  dark:border-gray-700 bg-white dark:bg-muted text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-orange-400 transition-all"
               />
           </div>
         </CardHeader>
   
         {/* Área rolável para lista de pedidos */}
         <ScrollArea className="max-h-60 border overflow-auto rounded-lg shadow-inner ">
           <Table className="dark:bg-zinc-950  ">
             <TableBody  className="overflow-auto">
              {isLoading && (
                <TableSkeleton></TableSkeleton>
              )}
               {orders?.length > 0 ? (
                 orders?.map((o) => (
                   <TableRow key={o.id} className="transition">
                     <TableCell className="py-2 px-3 text-gray-700 font-medium">{o.title}</TableCell>
                     {o.status ==='PENDING' && (
                        <TableCell>
                            <span className="text-orange-700 rounded-sm p-1 font-bold bg-orange-400">pendente</span>
                        </TableCell>
                     )}
   
                      {o.status ==='ACEPTED' && (
                        <TableCell>
                            <span className="text-green-700 rounded-sm p-1 font-bold bg-green-400">Aceite</span>
                        </TableCell>
                     )}
   
                          {o.status ==='INTERRUPTED' && (
                        <TableCell>
                            <span className="text-red-700 rounded-sm p-1 font-bold bg-red-400">Cancelado</span>
                        </TableCell>
                     )}
                     <TableCell className="">
                       <span className="text-muted-foreground">{o.location}</span>
                     </TableCell>
                     <TableCell className="flex items-center justify-center">
                         <Avatar>
                           <AvatarFallback>
                             {getInialts(o.autor.nome)}
                           </AvatarFallback>
                             <AvatarImage src={`${api.defaults.baseURL}/uploadS/${o.autor.image_path}`}></AvatarImage>
                         </Avatar>
                         <DropdownMenu>
                           <DropdownMenuTrigger>
                              <ChevronDown className="text-muted-foreground" size={13}></ChevronDown>
                           </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <div className="flex items-center">
                                 <div>
                                   <Avatar>
                                       <AvatarFallback>{getInialts(o.autor.nome)}</AvatarFallback>
                                       <AvatarImage  src={`${api.defaults.baseURL}/uploadS/${o.autor.image_path}`}></AvatarImage>
                                   </Avatar>
                                 </div>
                                 <div className="flex flex-col">
                                     <span>{o.autor.nome}</span>
                                     <div className="flex items-center">
                                    <MapPin size={12} className=" text-red-600"></MapPin>
                                        <div className="flex gap-1 items-center">
                                          <span className="text-xs">{o.autor.municipio} |</span>
                                          <span className="text-xs">{o.autor.provincia}</span>
                                        </div>
                                     </div>
                                        <div className="flex">
                                           <Phone size={12} className="text-blue-400"></Phone>
                                           <span className="text-xs">{o.autor.celular}</span>
                                        </div>
                                 </div>
                              </div>
                            </DropdownMenuContent>
                         </DropdownMenu>
                     </TableCell>
                   </TableRow>
                 ))
               ) : (
                 <TableRow>
                   <TableCell className="text-center text-gray-400 py-4">
                     Nenhum pedido encontrado.
                   </TableCell>
                 </TableRow>
               )}
             </TableBody>
           </Table>
         </ScrollArea>

       </Card>

     
    </div>
  );
}
