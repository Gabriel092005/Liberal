import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, ChevronDownCircle, DollarSign, PenTool, Users2, TrendingUp, Loader2, ChevronDown, MapPin, Phone, Search } from "lucide-react";
import { SellingsCharts } from "./selling-charts";
import { ChartPieLabelCustom } from "./Pie";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import {useQuery } from "@tanstack/react-query";
import { Metrics } from "@/api/get-metrics";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FetchAllOrders } from "@/api/fetch-all";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/axios";
import { getInialts } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

export function Dashboard() {
  const cardVariants = {
    hover: { scale: 1.05, y: -4, boxShadow: "0px 20px 25px rgba(0,0,0,0.1)" },
  };

  const {data:metrics,isLoading:isLoadingMetrics} =useQuery({
    queryKey:['metrics'],
    queryFn:Metrics
  })
  
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromParams = searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(queryFromParams);


  if(!metrics){
    <div className="w-full h-full flex items-center justify-center">
        <Loader2 className="animate-spin"></Loader2>
    </div>
  }
    const {data:orders,refetch} = useQuery({
    queryKey:['orders'],
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



 

  if(!orders){
     return (
      <div className="w-screen h-screen flex  items-center justify-center">
         <Loader2 className="flex items-center justify-center animate-spin text-orange-500"></Loader2>
      </div>
     )
  }

  return (
    <div className="pt-20 px-4 h-screen overflow-y-auto ">
      <h1 className="font-bold tracking-tight text-3xl mb-4 text-gray-900 dark:text-white">
        Dashboard
      </h1>

      {/* Cards Horizontais */}
      <div className="flex gap-6  overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-orange-300 scrollbar-track-gray-200">
        {/* Card Template */}
        <motion.div whileHover="hover" variants={cardVariants} className="min-w-[18rem]">
          <Card className="bg-white dark:bg-muted shadow-xl dark:border-0 rounded-2xl border border-gray-100 dark:border-gray-700 transition-transform duration-300">
            <CardHeader className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                  Prestadores
                </CardTitle>
                  <DropdownMenu>
                  <DropdownMenuTrigger>
                    <ChevronDownCircle className="cursor-pointer text-gray-400 hover:text-orange-500 transition-colors" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 bg-muted border-0">
                    <Card className="border-none dark:bg-muted ">
                      <CardTitle>Prestadores Empresa</CardTitle>
                      <CardDescription>Total de prestadores activos</CardDescription>
                      <CardContent className="flex items-start justify-between">
                        <span className="text-3xl font-bold text-orange-500">{metrics?.prestadoresEmpresa}</span>
                        <TrendingUp className="text-green-500" />
                      </CardContent>
                    </Card>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                Total de prestadores de serviços
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-tr from-orange-500 to-pink-500 shadow-lg transform transition-transform duration-300 hover:scale-110">
                  <Briefcase className="text-white w-8 h-8" />
                </div>
            {isLoadingMetrics ? (
               <Skeleton className="w-10 h-4"></Skeleton>
            ):(
               <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrics?.prestadoresIndividual}</span>
            )}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">Crescimento {metrics?.crescimento.prestadores}% mês</span>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div whileHover="hover" variants={cardVariants} className="min-w-[18rem]">
          <Card className="bg-white dark:bg-muted shadow-xl rounded-2xl border border-gray dark:border-gray-700 transition-transform duration-300">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">Clientes</CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <ChevronDownCircle className="cursor-pointer text-gray-400 hover:text-orange-500 transition-colors" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 bg-muted border-0">
                    <Card className="border-none dark:bg-muted border-0">
                      <CardTitle>Clientes Empresa </CardTitle>
                      <CardDescription>Total de clientes activos</CardDescription>
                      <CardContent className="flex items-start justify-between">
                        <span className="text-3xl font-bold text-orange-500">{metrics?.clientesEmpresa}</span>
                        <TrendingUp className="text-green-500" />
                      </CardContent>
                    </Card>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
           
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                Total de clientes
              </CardDescription>
              
            </CardHeader>
            <CardContent className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-tr from-orange-500 to-pink-500 shadow-lg hover:scale-110 transform transition-transform duration-300">
                  <Users2 className="text-white w-8 h-8" />
                </div>
                <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrics?.clientesIndividual}</span>
              </div>
              <span className="text-sm text-green-500">Crescimento +{metrics?.crescimento.clientes}% mês</span>
          
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover="hover" variants={cardVariants} className="min-w-[18rem]">
          <Card className="bg-white dark:bg-muted shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 transition-transform duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 dark:text-gray-200">Receitas Obtidas</CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                Valores de crédito total
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-tr from-orange-500 to-pink-500 shadow-lg hover:scale-110 transform transition-transform duration-300">
                  <DollarSign className="text-white w-8 h-8" />
                </div>
   {isLoadingMetrics ? (
               <Skeleton className="w-10 h-4"></Skeleton>
            ):(
                     <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrics?.receitas},00kz</span>
            )}
              </div>
                
            </CardContent>
          </Card>
        </motion.div>

   <Dialog>
      <DialogTrigger>
             <motion.div whileHover="hover" variants={cardVariants} className="min-w-[18rem]">
          <Card className="bg-white dark:bg-muted shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 flex flex-col  items-start transition-transform duration-300">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-left  text-gray-800 dark:text-gray-200">Pedidos</CardTitle>
              <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                Total de pedidos
              </CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center h-16 w-16 rounded-xl bg-gradient-to-tr from-orange-500 to-pink-500 shadow-lg hover:scale-110 transform transition-transform duration-300">
                  <PenTool className="text-white w-8 h-8" />
                </div>
                 {isLoadingMetrics ? (
               <Skeleton className="w-10 h-4"></Skeleton>
            ):(
                     <span className="text-3xl font-bold text-gray-900 dark:text-white">{metrics?.pedidos}</span>
            )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </DialogTrigger>
       <DialogContent className="max-w-lg rounded-2xl dark:bg-muted shadow-2xl border border-gray-200 dark:border-none p-6">
      <DialogHeader className="mb-3 text-center">
        <DialogTitle className="text-xl font-semibold flex items-center text-gray-800 dark:text-muted-foreground">
          <Briefcase></Briefcase>
           Pedidos</DialogTitle>
        <DialogDescription className="text-gray-500 text-sm">
          Todos os pedidos feitos pelos clientes
        </DialogDescription>
     <div className="relative flex items-center mt-5 w-full max-w-md mx-auto">
          <Search className="absolute left-3 text-gray-400 dark:text-gray-500 pointer-events-none" size={18} />
          <Input
            type="text"
            placeholder="O que você precisa?"
            value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-muted text-sm shadow-sm focus-visible:ring-2 focus-visible:ring-orange-400 transition-all"
            />
        </div>
      </DialogHeader>

      {/* Área rolável para lista de pedidos */}
      <ScrollArea className="max-h-60 border rounded-lg shadow-inner bg-gray-50 p-2">
        <Table className="dark:bg-black">
          <TableBody >
            {orders?.length > 0 ? (
              orders?.map((o) => (
                <TableRow key={o.id} className="hover:bg-gray-100 transition">
                  <TableCell className="py-2 px-3 text-muted-foreground font-medium">{o.title}</TableCell>
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


          <Link to='/admin-pedidos'>
          <Button variant="outline" className="text-sm font-medium">
            Ver mais
          </Button>
          </Link>
    </DialogContent>
   </Dialog>
      </div>
      <div className="mt-6 flex  flex-col md:flex-row gap-6 min-h-[400px]">
        <SellingsCharts />
        <ChartPieLabelCustom />
      </div>
    </div>
  );
}
