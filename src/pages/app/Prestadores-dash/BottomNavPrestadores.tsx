// import { Button } from "@/components/ui/button";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import {
//   Home,
//   User,
//   Search,
//   Box,
//   MapPin,
//   Handshake,
//   WifiOff,
//   Loader,
//   Briefcase,
// } from "lucide-react";
// import { Link } from "react-router-dom";
// import { SkeletonsDemo } from "./NearClientsSearch";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { SearchNearOrders } from "@/api/search-nearOrders";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { api } from "@/lib/axios";
// import { useUserLocation } from "../dashboard-admin/sidebar/location-services";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { useEffect, useState } from "react";
// import { MapRoute } from "../dashboard-admin/mapas";
// import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
// import { pt } from "date-fns/locale/pt";
// import { InteressarPedidos } from "@/api/interessar-pedido";
// import { toast } from "sonner";
// import { motion } from "framer-motion";

// export function BottomNavPrestadores() {
//   const { coords } = useUserLocation();
  
//   console.log("coordernas:",coords)
//   const Latitude = coords?.latitude
//   const Longitude = coords?.longitude
//   const [isOnline, setIsOnline] = useState(navigator.onLine);

//   // 🧠 Monitora o status da internet
//   useEffect(() => {
//     const handleOnline = () => setIsOnline(true);
//     const handleOffline = () => setIsOnline(false);

//     window.addEventListener("online", handleOnline);
//     window.addEventListener("offline", handleOffline);
    
//     return () => {
//       window.removeEventListener("online", handleOnline);
//       window.removeEventListener("offline", handleOffline);
//     };
//   }, []);
  
//   // console.log("pedidos",data)
  
//   const [filter, _] = useState<"list" | "map">("list");
//   const [loadingId, setLoadingId] = useState<number | null>(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
  

//   const { loading: loadingLocation, error: locationError , place} = useUserLocation();
  
//   const { data, isFetching } = useQuery({
//     // 💡 A chave da query PRECISA incluir o coords para resetar quando ele for obtido
//     queryKey: ["nearOrders", coords?.latitude, coords?.longitude],
//     queryFn: () =>
//       SearchNearOrders({
//         latitude: coords!.latitude,
//         longitude: coords!.longitude,
//         radiusKm: 100,
//       }),
//     // 💡 SÓ dispara se o Modal estiver aberto E as coordenadas existirem
//     enabled: isModalOpen && !!coords,
//     staleTime: 1000 * 60 * 5,
//   });

//   // Log para monitorar a chegada dos dados
//   console.log("Status Localização:", { coords, loadingLocation, place });
//   console.log("Resultado Pedidos:", data);



//   const {mutateAsync:Interessar,isPending} = useMutation({
//     mutationFn:InteressarPedidos,
//     onError(_,){
//        toast.error("Oops😁, você já se negociou neste pedido!")
//       },
//       onSettled: () => {
//         // Quando terminar (sucesso ou erro), limpa o estado
//         setLoadingId(null);
//       },
//     })
    
//     filter === "list" ? data : data?.filter((c:any) => c.accepted);
    
//   return (
//     <nav className="fixed bottom-5  h-20 inset-x-0 z-50 bg-white dark:bg-zinc-950 shadow-lg md:hidden border-t border-zinc-200 dark:border-zinc-800">
//       <ul className="flex justify-between items-center px-6 h-full relative">
//         {/* Início */}
//         <li>
//           <Link
//             to="/servicos"
//             className="flex flex-col items-center text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500"
//           >
//             <Home className="w-6 h-6" />
//             <span className="text-xs">Início</span>
//           </Link>
//         </li>

//         {/* Pacotes */}
//         <li>
//           <Link
//             to="/package"
//             className="flex flex-col items-center text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500"
//           >
//             <Box className="w-6 h-6" />
//             <span className="text-xs">Pacotes</span>
//           </Link>
//         </li>

//         {/* Botão central */}
//         <li>
//         <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
//             <DialogTrigger asChild>
//               <Button
//                 className="rounded-full h-14 w-14 flex items-center justify-center 
//                 bg-gradient-to-r from-orange-500 to-pink-500 text-white 
//                 shadow-xl border-4 border-white dark:border-zinc-950 
//                 hover:opacity-90 transition-all"
//               >
//                 <Search size={28} />
//               </Button>
//             </DialogTrigger>

// <DialogContent
//   className="w-full h-full p-0 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 
//   flex flex-col overflow-hidden z-[9999] shadow-2xl rounded-2xl border dark:border-zinc-800"
// >
// <DialogHeader>

//     <div className=" border-b dark:border-zinc-800 sticky top-0 flex justify-between items-center backdrop-blur-md bg-white/70 dark:bg-zinc-950/60">
//     <div className="flex ml-1  flex-col">
//       <div className="flex items-center relative  justify-start">
//       <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
//         Serviços Próximos
//       </DialogTitle>
//       </div>
//       <DialogDescription className="text-muted-foreground">Encontre trabalhos próximos em tempo real</DialogDescription>
//     </div>

//     {/* <DialogClose asChild>
//       <Button
//         variant="ghost"
//         size="icon"
//         className="rounded-full hover:bg-orange-100 dark:hover:bg-zinc-800 transition-all"
//       >
//         <X className="w-5 h-5 text-zinc-700 dark:text-zinc-300" />
//       </Button>
//     </DialogClose> */}
//   </div>
// </DialogHeader>

//   {/* 🔘 Alternador de modo */}
//   {/* <div className="flex justify-center gap-3 p-3 border-b dark:border-zinc-800 bg-inherit sticky top-[72px] z-10 backdrop-blur-sm"> */}
//     {/* <Button
//       variant={filter === "map" ? "default" : "outline"}
//       className={`flex items-center gap-2 text-sm transition-all ${
//         filter === "map" ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 shadow-md" : ""
//       }`}
//       onClick={() => setFilter("map")}
//     >
//       <MapIcon size={18} />
//       Mapa
//     </Button> */}

//     {/* <Button
//       variant={filter === "list" ? "default" : "outline"}
//       className={`flex items-center gap-2 text-sm transition-all ${
//         filter === "list" ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white border-0 shadow-md" : ""
//       }`}
//       onClick={() => setFilter("list")}
//     >
//       <File size={18} />
//       Lista
//     </Button> */}
//   {/* </div> */}

//   {/* 🧭 Conteúdo */}
//   <div className="flex-1 overflow-auto p-4">
//     {filter === "map" ? (
//       <motion.div
//         initial={{ opacity: 0, scale: 0.95 }}
//         animate={{ opacity: 1, scale: 1 }}
//         transition={{ duration: 0.4 }}
//         className="w-full h-[85vh] rounded-xl border dark:border-zinc-800 overflow-hidden shadow-md"
//       >
//         <MapRoute />
//       </motion.div>
//     ) : (
//       <ScrollArea className="h-[75vh] px-1">
//         <div className="py-4 space-y-4">
//           {/* Sem internet */}
//           {!isOnline ? (
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               className="flex flex-col items-center justify-center gap-3 text-center mt-10"
//             >
//               <WifiOff className="w-10 h-10 text-zinc-400" />
//               <p className="text-zinc-500">
//                 Você está offline.<br />
//                 Conecte-se para ver serviços próximos.
//               </p>
//             </motion.div>
//           ) : isFetching ? (
//             <>
//               <SkeletonsDemo />
//               <SkeletonsDemo />
//             </>
//           ) : data && data.length > 0 ? (
//             data.map((orders) => (
//               <motion.div
//               key={orders.id}
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.3 }}
//               className="p-4 rounded-xl border dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:shadow-lg transition-all"
//               >
           
//                 <div className="flex items-start gap-4">
//                   {/* Avatar */}
//                   <Avatar className="w-14 h-14 ring-2 ring-orange-400 shadow-md">
//                     <AvatarImage
//                       src={`${api.defaults.baseURL}/uploads/${orders.image_path}`}
//                       alt="User"
//                     />
//                     <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
//                       {orders.title?.slice(0, 2).toUpperCase() ?? "US"}
//                     </AvatarFallback>
//                   </Avatar>

//                   {/* Info */}
//                   <div className="flex-1">
//                     <div className="flex justify-between items-center">
//                       <h2 className="text-lg font-semibold">{orders.title}</h2>
//                       <span className="text-xs text-zinc-500">
//                         {formatDistanceToNow(new Date(orders.created_at), {
//                           addSuffix: true,
//                           locale: pt,
//                         })}
//                       </span>
//                     </div>

//                     {/* <p className="text-xs flex items-center gap-1 text-muted-foreground mt-1">
//                       <Phone size={14} />
//                       +244 {orders.dono.celular}
//                     </p> */}

//                     <div className="flex items-center gap-1 mt-2 text-muted-foreground text-sm">
//                       <User size={16} />
                    
//                       <span>{orders.dono.nome}</span>
//                     </div>

//                     <div className="flex items-center gap-1 mt-2 text-orange-500 text-sm">
//                       <MapPin size={16} />
//                       <span className="truncate max-w-[7rem]">{orders.location}</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Botão de ação */}
//                 <div className="flex justify-end mt-4">
//                         <Button
//   onClick={() => {
//     setLoadingId(orders.id); // Marca qual botão está sendo carregado
//     Interessar({ pedidoId: orders.id });
//   }}
//   disabled={isPending && loadingId === orders.id} // evita duplo clique
//   className="bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow hover:opacity-90"
// >
//   <Handshake size={16} className="mr-2" />
//   {isPending && loadingId === orders.id ? (
//     <Loader className="animate-spin" />
//   ) : (
//     <>Negociar</>
//   )}
// </Button>

//                 </div>
//               </motion.div>
//             ))
//           ) : (
//             <p className="text-center text-muted-foreground mt-6">
//               Nenhum serviço encontrado por perto.
//             </p>
//           )}
//         </div>
//       </ScrollArea>
//     )}
//   </div>
// </DialogContent>


//           </Dialog>
//         </li>

//         {/* Pedidos */}
//         <li>
//           <Link
//             to="/prestadores-pedidos"
//             className="flex flex-col items-center relative left-5 text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500"
//           >
//             <Briefcase className="w-6 h-6" />
//             <span className="text-xs">Pedidos</span>
//           </Link>
//         </li>

//         {/* Perfil */}
//         <li>
//           <Link
//             to="/profile"
//             className="flex flex-col items-center text-sm text-gray-600 dark:text-gray-300 hover:text-orange-500"
//           >
//             <User className="w-6 h-6" />
//             <span className="text-xs">Perfil</span>
//           </Link>
//         </li>
//       </ul>
//     </nav>
//   );
// }
