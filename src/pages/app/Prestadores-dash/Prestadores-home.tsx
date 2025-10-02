import {
  Bell,
  ChevronDown,
  Handshake,
  InfoIcon,
  LucideCircleDollarSign,
  MapPin,

  Podcast,

  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,

} from "@/components/ui/card";
import { useEffect} from "react";
import photo4 from "@/assets/WhatsApp Image 2024-06-27 at 22.59.42_29efed05.jpg";


import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu,  DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NotificationMenu } from "../dashboard-admin/sidebar/Notification/Notification-Content";
import { Table, TableBody, TableCell,TableRow } from "@/components/ui/table";
import { ServicesDialogDetails } from "./ServicesDialogDetails";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Historico } from "./Historico";
;
export function PrestadoresDash() {
  const navigate = useNavigate()
  useEffect(()=>{
    const seen = localStorage.getItem('app_onboarding_seen_v1')
    if(!seen){
       navigate('/sign-up')
    }

  },[navigate])

  const cards = [
    {
      title: 'Canalizador',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. ?',
      image: photo4,
      location: 'Viana, Luanda',
      date:'1min ',
      status:'urgente',
      prestadoresInteressados:34
    },
      {
      title: 'Canalizador',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. ?',
      image: photo4,
      location: 'Viana, Luanda',
      date:'1min ',
      status:'urgente',
      prestadoresInteressados:34
    },  {
      title: 'Canalizador',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. ?',
      image: photo4,
      location: 'Viana, Luanda',
      date:'1min ',
      status:'urgente',
      prestadoresInteressados:34
    },
      {
      title: 'Canalizador',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. ?',
      image: photo4,
      location: 'Viana, Luanda',
      date:'1min ',
      status:'urgente',
      prestadoresInteressados:34
    },
      {
      title: 'Canalizador',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. ?',
      image: photo4,
      location: 'Viana, Luanda',
      date:'1min ',
      status:'urgente',
      prestadoresInteressados:34
    },

        {
      title: 'Pedreiro',
      description: 'Lorem ipsum, dolor sit amet consectetur adipisicing elit. ?',
      image: photo4,
      location: 'Viana, Luanda',
      date:'1min',
      status:'médio',
      prestadoresInteressados:34

    },

     
  ];
  return (
    <div className=" flex flex-col h-screen w-full right-1 fixed overflow-hidden bg-background text-foreground">
      {/* CONTEÚDO */}
      <motion.div
        className="flex flex-col flex-1 px-4 py-4 gap-4 items-center justify-center pb-20"
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
    <header className="w-full sticky top-0 z-50 bg-white dark:bg-zinc-950 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
       <div className="flex items-center gap-3">
  <Avatar className="h-10 w-10 ring-2 ring-orange-400 shadow-md">
    <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="User" />
    <AvatarFallback>AV</AvatarFallback>
  </Avatar>


  <div className="flex flex-col leading-tight">
    <span className="font-bold text-sm sm:text-base text-zinc-800 dark:text-zinc-200">
      Gabriel Cavala
    </span>
    <span className="text-xs text-zinc-500 dark:text-zinc-400">
        +244 973 763 646
    </span>
  </div>
</div>



        {/* Notificações */}
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative rounded-full h-11 w-11 flex items-center justify-center hover:bg-orange-50 dark:bg-zinc-900"
              >
                <Bell className="h-5 w-5 text-orange-500" />
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[11px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-md">
                  3
                </span>
              </Button>
            </DropdownMenuTrigger>
            <NotificationMenu />
          </DropdownMenu>
        </div>
      </div>
    </header>


            

        {/* CATEGORIAS */}
        <section className="w-full flex flex-col  gap-6 items-center justify-center">
            <div className="flex justify-center items-center p-6">
      <div className="relative w-80 h-48 rounded-3xl bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 
                      shadow-[8px_8px_16px_rgba(0,0,0,0.6),-8px_-8px_16px_rgba(255,255,255,0.05)] 
                      text-white p-6 overflow-hidden">
  
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-tr from-orange-500 to-pink-500 rounded-full opacity-30 blur-2xl"></div>
        <div className="flex justify-between items-center">
             <Sheet>
          <SheetTrigger asChild>
          <div className="w-10 h-7 bg-gradient-to-br from-orange-900 to-yellow-600 rounded-md shadow-inner">
          </div>
          </SheetTrigger>
       <SheetContent>
          </SheetContent>
      </Sheet> 
          <LucideCircleDollarSign className="text-white opacity-80" size={22} />
        </div>

        {/* Número do Cartão */}
        <div className="mt-8 space-y-1 tracking-widest font-mono text-lg">
          <p className="text-3xl">0,00kz</p>
        </div>

        {/* Informações */}
        <div className="flex justify-between items-center mt-6 text-xs">
          <div>
            <p className="uppercase opacity-70">Titular</p>
            <p className="font-semibold text-sm">Gabriel C. Manuel</p>
          </div>
          <div>
            <p className="uppercase opacity-70">Validade</p>
            <p className="font-semibold text-sm">12/28</p>
          </div>
        </div>
        
      </div>
      
    </div>
    

    <Dialog>
       <DialogTrigger>
                <ChevronDown className="absolute top-80 right-80 text-muted-foreground"/>
       </DialogTrigger>
       <DialogContent >
        <header>
            <h1 className="text-2xl"> Histórico</h1>
            <span className="text-xs text-muted-foreground">Um relatório de débitos e créditos efetuadas, nas últimas horas</span>
        </header>
               <div className="flex">
                    <Historico/>
               </div>
       </DialogContent>
    </Dialog>
  
        </section>
        <section className="flex flex-col items-center gap-3 flex-1 left-5 relative bottom-50 justify-center">
            <motion.div
                  className="flex h-screen justify-center items-start mt-2"
                  initial={{ x: "-100%", opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                >
                  <Card className="w-full max-w-lg relative right-[1.4rem] overflow-hidden border-none">
                    {/* <CardHeader>
                      <CardTitle className="text-3xl font-bold">Pedidos</CardTitle>
                      <CardDescription className="text-xs mb-2">
                        Aqui você encontra os últimos pedidos feitos.
                      </CardDescription>
            
                      <div className="relative">
                        <Input placeholder="O que você precisa?" className="bg-zinc-200 dark:bg-black pl-10 w-full max-w-[320px]" />
                        <Search className="absolute top-1/2 -translate-y-1/2 left-3 text-gray-400" size={20} />
                      </div>
                    </CardHeader> */}
            
                    <CardContent className="p-0 max-h-[400px] overflow-auto">
                      <Table>
                        <TableBody>
                          {cards.map((card, i) => (
                              <TableRow key={i} className="h-14 cursor-pointer hover:bg-muted/40">
      <TableCell className="flex items-center gap-3 py-2 px-2">
        <Avatar className="w-10 h-10 ring-2 ring-orange-300 shadow-sm">
          {card.image ? (
            <AvatarImage src={card.image} />
          ) : (
            <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold text-xs">
              {card.title}
            </AvatarFallback>
          )}
        </Avatar>

        <div className="flex flex-col leading-tight">
          <div className="flex gap-4">
            <div className="flex flex-col">
              <span className="text-sm font-medium">{card.title}</span>
              <span className="text-[0.65rem] text-muted-foreground">{card.description}</span>
            </div>
            <div>
              <span className="text-[0.65rem] mt-2 text-muted-foreground">{card.date}</span>
            </div>
                             <Dialog>
  <DialogTrigger asChild>
            <div>
              <InfoIcon size={15} className="dark:text-white text-blue-400" />
            </div>
              </DialogTrigger>
                <ServicesDialogDetails />
</Dialog>

          </div>

          <div>
            <span className="text-muted-foreground text-xs font-bold">
              status : <span className="text-red-500">{card.status}</span>
            </span>
          </div>
        </div>
      </TableCell>

      <div className="flex items-start ml-52">
        <span className="absolute top-10 right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-md">
          {card.prestadoresInteressados}
        </span>
      </div>

      <TableCell className="flex items-center gap-2 px-2">
        <X size={16} className="text-red-400 cursor-pointer" />
        <div className="flex text-orange-400">
          <MapPin size={16} className="text-orange-400 cursor-pointer" />
          <span className="font-bold">Estalagem,Luanda</span>
        </div>
        <div>
          <Button variant="outline" className="ml-8">
            <Handshake className="text-muted-foreground"/>
            <span className="flex text-xs text-muted-foreground relative items-center">Negociar</span>
          </Button>
        </div>
      </TableCell>
    </TableRow>

                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </motion.div>
        </section>
      </motion.div>
    </div>
  );
}
