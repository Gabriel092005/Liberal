import {
  BookMarked,
  CalendarDays,
  ChevronDown,
  LucideCircleDollarSign,

} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { GetUserProfile } from "@/api/get-profile";
import { GetCarteira } from "@/api/get-carteira";
import { socket } from "@/lib/socket";
import { api } from "@/lib/axios";
import { formatCurrencyKZ, getInialts } from "@/lib/utils";
import { NotificationDropdown } from "../dashboard-admin/sidebar/Notification/notification-dropdown";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { Historico } from "./Historico";
import { Skeleton } from "@/components/ui/skeleton";
import { GetHistorico } from "@/api/get-historico-recargas";
import { Dialog,  DialogTrigger } from "@/components/ui/dialog";
import { UpdateProfile } from "../dashboard-admin/sidebar/updateProfile";
import { SkeletonsCard } from "./prestadores-home-skeletons/creditcard-skeletons";
import { TableSkeletons } from "./prestadores-home-skeletons/table-sketons";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useHistoricoCarteira } from "@/api/get-active-packages";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { FetchPostsVitrine } from "@/api/fetch-MyVitrinePosts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function PrestadoresDash() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [_, setNotif] = useState<any[]>([]);
  
  const navigate = useNavigate();

  const {data} = useQuery({
    queryKey:['carteira1'],
    queryFn:useHistoricoCarteira
  })

  const { data: profile, isLoading: isLoadingUserProfile, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: GetUserProfile,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 0,
  });

   const { data: vitrine} = useQuery({
    queryKey: ["vitrine"],
    queryFn: FetchPostsVitrine,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 0,
  });
  
  const { data: carteira, isLoading: isLoadingCarteira } = useQuery({
    queryKey: ["carteira"],
    queryFn: GetCarteira,
  });
  const carteiraId = localStorage.getItem("carteiraId")
  
  const { data:historico } = useQuery({
    queryKey:['historico'],
    queryFn:()=>GetHistorico({carteiraId:Number(carteiraId)})
  })
  // 🔔 Configura som
  useEffect(() => {
    audioRef.current = new Audio("/bell-98033.mp3");
    audioRef.current.volume = 0.7;
  }, []);

  // 🎧 Socket para notificações
useEffect(() => {
  if (!profile?.id) return;

  socket.emit("register", profile.id);
  console.log("✅ Registrado no socket como:", profile.id);

  const handleUserNotification = (data: any[]) => {
    console.log("🔔 Nova notificação recebida:", data);
    refetch();

    setNotif((prev) => {
      if (data.length > prev.length && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      return data;
    });
  };
  
  socket.on("user", handleUserNotification);
  
  // 👇 conversão explícita pra deixar claro que o retorno é void
  return () => {
    socket.off("user", handleUserNotification);
    return void 0;
  };
}, [profile?.id]);
  if(profile?.role =='CLIENTE_INDIVIDUAL' || profile?.role=='CLIENTE_COLECTIVO'){
     navigate("/")
  }

     if(profile?.role =='ADMIN'){
     navigate("/início")
  }



if (isLoadingUserProfile) {
  return (
    <div className="flex flex-col h-screen w-full items-center mr-1 justify-center gap-4 p-6">
         <div className="flex justify-center ">
            <SkeletonsCard></SkeletonsCard>
         </div>
         <div>
          <TableSkeletons></TableSkeletons>
         </div>
       {/* <SkeletonsDemo></SkeletonsDemo>
       <SkeletonsDemo></SkeletonsDemo>
       <SkeletonsDemo></SkeletonsDemo> */}
    </div>
  );
}



  if (!profile || !carteira) return null;

  return (
    <div className="flex flex-col h-screen w-full left-[0.1rem] fixed overflow-hidden bg-background text-foreground">
      <motion.div
        className="flex flex-col flex-1 px-4 py-4 gap-4 items-center justify-center pb-20"
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* HEADER */}
        <header className="w-full sticky top-0 z-50 bg-white dark:bg-zinc-950 px-4 py-3 shadow-sm">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                   <Dialog>
                  <DialogTrigger>
                      <Avatar className="h-10 w-10 ring-2 ring-orange-400 shadow-md">
                    <AvatarImage
                      src={`${api.defaults.baseURL}/uploads/${profile.image_path}`}
                      alt="User"
                    />
                    <AvatarFallback>{getInialts(profile.nome)}</AvatarFallback>
                  </Avatar>
                  </DialogTrigger>
                  <UpdateProfile imageSrc={`${api.defaults.baseURL}/uploads/${profile.image_path}`}></UpdateProfile>
                </Dialog>
                  <div className="flex flex-col leading-tight">
                    <span className="font-bold text-sm sm:text-base text-zinc-800 dark:text-zinc-200">
                      {profile.nome}
                    </span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">
                      +244 {profile.celular}
                    </span>
                  </div>
                   <Sheet>

                      <SheetTrigger>
        <div className="flex items-center justify-center relative left-10">
          <BookMarked size={14}   className="text-muted-foreground fixedhover:text-foreground transition-colors" />
        </div>
      </SheetTrigger>
    

      <SheetContent className="p-0 w-full sm:max-w-lg dark:border-none dark:bg-black">
        <Card className="w-full border-none dark:border-0 shadow-none bg-background ">
           {vitrine?.length===0 ? (
              <div className="flex justify-center items-center h-full fixed w-full">
                 <span className="text-muted-foreground">Nenhum conteúdo encontrado na vitrine</span>
              </div>
           ):(
               <CardContent className="p-0  dark:border-none">
   <ScrollArea className="h-[800px] px-6 pb-6">              
    {isLoadingUserProfile ? (
                <div className="py-6 flex flex-col gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-28 w-full rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="py-6">
                  {/* Cabeçalho */}
                  <header className="flex flex-col mb-6">
                    <h1 className="font-bold flex tr items-baseline  acking-tight text-3xl">
                      Vitrine</h1>
                    <span className="text-muted-foreground text-sm">
                      Todos os itens que você colocou na sua vitrine
                    </span>
                  </header>

                  {/* Lista de itens */}
                  {vitrine?.length === 0 ? (
                    <div className="text-center py-16 text-muted-foreground">
                      Nenhum item adicionado ainda.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 overflow-auto sm:grid-cols-2 gap-5 pb-10">
                      {vitrine?.map((item, i) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                          className="bg-card rounded-2xl shadow-md overflow-auto  overflow-y-auto hover:shadow-lg transition-all"
                        >
                          {item.image_path && (
                            <img
                              src={`${api.defaults.baseURL}/uploads/${item.image_path}`}
                              alt={item.titulo}
                              className="h-20 w-full object-cover"
                            />
                          )}
                          <div className="p-4 flex dark:bg-zinc-900 flex-col gap-2">
                            <h2 className="font-semibold text-base">{item.titulo}</h2>
                            {item.description && (
                                      <Accordion type="single">
                                          <AccordionItem value="Mais">
                                          <AccordionTrigger>Ver mais</AccordionTrigger>
                                        
                                            <AccordionContent>
                                         
                                            {item.description}
                            
                                           </AccordionContent>
                                                    {/* <Textarea></Textarea> */}
                                       
                                          </AccordionItem>
                                      </Accordion>
                            )}
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                              <CalendarDays className="w-4 h-4" />
                              {new Date(item.created_at).toLocaleDateString("pt-PT", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </ScrollArea>
          </CardContent>
           )}
        </Card>
      </SheetContent>
    </Sheet>
                         {/* <h1 className="text-4xl  font-bold tracking-tight mb-3">Liberal</h1> */}
                 </div>
                     <div className="flex gap-2 items-center">
              <ModeToggle />
              {isLoadingUserProfile ? (
                <Skeleton className="h-6 w-6 rounded-full" />
              ) : (
                <NotificationDropdown {...profile} />
              )}
            </div>
              </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {isLoadingUserProfile ? (
                <>
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex flex-col gap-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </>
              ) : (
                <>
               
    

                
                </>
              )}
            </div>

            {/* Notificações + Tema */}
          
          </div>
        </header>

        {/* SALDO (CARTEIRA) */}
        <section className="w-full flex flex-col relative bottom-[1rem] gap-6 items-center justify-center">
          <div className="flex justify-center items-center p-6">
            <div className="relative w-80 h-48 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 shadow-[8px_8px_16px_rgba(0,0,0,0.6),-8px_-8px_16px_rgba(255,255,255,0.05)] text-white p-6 overflow-hidden">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-tr from-orange-500 to-pink-500 rounded-full opacity-30 blur-2xl"></div>

              <div className="flex justify-between items-center">
                <LucideCircleDollarSign className="text-white opacity-80" size={22} />
              </div>

              <div className="mt-8 space-y-1 tracking-widest font-mono text-lg">
                {isLoadingCarteira ? (
                  <Skeleton className="h-8 w-32" />
                ) : (
                  <p className="text-3xl">{formatCurrencyKZ(carteira?.receita)?? "0,00"} </p>
                )}
              </div>

              <div className="flex justify-between items-center mt-6 text-xs">
                {isLoadingUserProfile ? (
                  <>
                    <div>
                      <Skeleton className="h-3 w-10 mb-1" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <div>
                      <Skeleton className="h-3 w-12 mb-1" />
                      <Skeleton className="h-4 w-10" />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="uppercase opacity-70">Titular</p>
                      <p className="font-semibold text-sm">{carteira?.usuario.nome}</p>
                    
                    </div>

                      <Drawer>
                         <DrawerTrigger >
                                    <div className="flex flex-col relative justify-center items-center left-9">
                                               <p className="uppercase opacity-70">Planos</p>
                                               <ChevronDown></ChevronDown>
                                    </div>
                         </DrawerTrigger>
                         <DrawerContent className="h-56">
                            {data?.pacotes_ativos.map((e)=>{
                               return(
                                    <div>
                                        <div className="flex justify-center mt-4">
                                          <ul>
                                              <li className="flex gap-3 items-center">
                                                <span>Plano</span>  
                                               <span>{e.nome}</span>
                                              </li>
                                                <li className="flex gap-3 items-center">
                                                <span>Prazo</span>  
                                               <span>{e.validade}</span>
                                              </li>

                                                <li className="flex gap-3 items-center">
                                                <span>Total</span>  
                                            <span>{e.total}</span>
                                               {/* <span>{e.validade}</span> */}
                                              </li>

                                              
                                          </ul>
                                           
                                        </div>
                                    </div>
                               )
                            })}
                         </DrawerContent>
                      </Drawer>
                    <div>
                    
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Botões abaixo da carteira */}
          <div className="relative bottom-10 flex gap-10">
            {isLoadingUserProfile ? (
              <>
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </>
            ) : (
              <>
                {/* <ActionButton icon={<InfoIcon />} label="Detalhes" />
                <ActionButton icon={<Plus />} label="Add Kumbo" />
                <ActionButton icon={<span className="text-1xl">...</span>} label="Mais" /> */}
              </>
            )}
          </div>
        </section>

        {/* HISTÓRICO */}
        <section className="flex flex-col items-center gap-3 flex-1 left-5 relative bottom-10 justify-center">
          <motion.div
            className="flex h-screen justify-center items-start mt-2"
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <Card className="w-full bottom-10 max-w-lg relative right-[1.4rem] overflow-hidden border-none">
              <CardContent className="p-0 max-h-[400px] overflow-auto">
                {isLoadingUserProfile ? (
                  <div className="p-4 flex flex-col gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <Skeleton key={i} className="h-10 w-full rounded-lg" />
                    ))}
                  </div>
                ) : (
                  <Historico  data={historico}    />
                )}
              </CardContent>
            </Card>
          </motion.div>
        </section>
      </motion.div>
    </div>
  );
}

// 🔸 Componente de botão auxiliar (para evitar repetição)
// function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
//   return (
//     <div className="flex flex-col items-center">
//       <Button
//         variant="ghost"
//         className="relative rounded-full h-11 w-11 flex items-center justify-center hover:bg-orange-50 dark:bg-zinc-900"
//       >
//         {icon}
//       </Button>
//       <span className="text-xs font-bold text-muted-foreground">{label}</span>
//     </div>
//   );
// }
