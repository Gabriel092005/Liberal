import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Home,Plus,Users2, BookMarked, Handshake, Briefcase, Hammer } from "lucide-react";
import { Link } from "react-router-dom";
import { FastFazerPedido } from "./DialogFastPrestadoresPedido";
import { useQuery } from "@tanstack/react-query";
import { GetUserProfile } from "@/api/get-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { getInialts } from "@/lib/utils";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { api } from "@/lib/axios";
import { NotificationDropdownAdmin } from "./notification-dropdown-admin";
import { Card} from "@/components/ui/card";
import { FetchPostsVitrineAll } from "@/api/fetch-all-vitrine-data";
import { VitrineCardContent } from "./vitrine-card-content";

export function TopHeader() {


  
        const { data: profile } = useQuery({
              queryKey: ["profile"],
              refetchOnWindowFocus: true,     // Rebusca ao voltar ao foco
              refetchOnReconnect: true,       // Rebusca se a internet voltar
              refetchOnMount: true,           // Rebusca sempre que o componente monta
              staleTime: 0,    
              queryFn: GetUserProfile,
              });


     const { data: vitrine, isLoading: isLoadingVitrine } = useQuery({
      queryKey: ["v"],
      queryFn: FetchPostsVitrineAll,
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      staleTime: 0,
    });



if(!profile || !vitrine){
    return
  }


              
  return (
    <header className="hidden md:flex items-center justify-between px-8 py-4 dark:bg-muted bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      {/* Logo */}
      <Link to="/início" className="text-xl font-bold text-orange-400">
        <div className="bg-100-400 shadow-lg rounded-full p-2">
          <Handshake></Handshake>
        </div>
      </Link>

      {/* Menu */}
      <nav className="flex items-center gap-8">
        <Link
          to="/início"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
        >
          <Home size={20} />
          <span>Início</span>
        </Link>

        <Link
          to="/Serviços"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
        >
          <Hammer size={20} />
          <span>Serviços</span>
        </Link>

      

        <Link
          to="/admin-pedidos"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
        >
          <Briefcase size={20} />
          <span>Pedidos</span>
        </Link>

        <Link
          to="/clientes"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
        >
          <Users2 size={20} />
          <span>Clintes</span>
        </Link>

        {/* <Link
          to="/me"
          className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-orange-500 transition-colors"
        >
          <User size={20} />
          <span>Eu</span>
        </Link> */}
        
      </nav>
 
  <div className="flex gap-3">
        

                    <Dialog>
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:opacity-90 transition-all"
            >
              <Plus size={20} />
              <span>Novo Pedido</span>
            </Button>
          </DialogTrigger>
          <FastFazerPedido />
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
              <Button
                        variant="ghost"
                        className="relative rounded-full h-11 w-11 flex items-center justify-center hover:bg-orange-50 dark:bg-zinc-900 transition-colors"
                        >
                        <BookMarked className="text-muted-foreground"></BookMarked>
                    
                      </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader className="">
               <DialogTitle>Vitrine</DialogTitle>
               <DialogDescription>Todos os posts encontrados na vitrine</DialogDescription>
            </DialogHeader>

           <Card className="w-full h-[60vh] border-none shadow-none bg-background">
  {isLoadingVitrine ? (
    // Skeleton enquanto carrega
    <div className="flex flex-col gap-4 p-4 h-full justify-center">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  ) : vitrine?.length === 0 ? (
    // Mensagem quando não há itens
    <div className="flex items-center justify-center h-full text-muted-foreground">
      Nenhum item adicionado ainda.
    </div>
  ) : (
    // Lista de itens com Scroll interno
    <VitrineCardContent></VitrineCardContent>
  )}
</Card>

          </DialogContent>
        </Dialog>
        

           <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                   
                    </DropdownMenuTrigger>
                     <NotificationDropdownAdmin {...profile} />
                  </DropdownMenu>
        
                  <ModeToggle />

                        <div className="flex justify-center items-center gap-2">
                <div>
                      <Avatar className="bg-blue-800">
                        <AvatarImage src={ `${api.defaults.baseURL}/uploads/${profile.image_path}`}></AvatarImage>
                    <AvatarFallback>
                      <strong>
                         {getInialts(profile?.nome)}
                      </strong>
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="flex flex-col">
                    <span>{profile.nome}</span>
                    <span className="text-muted-foreground text-xs">@{profile.role}</span>
                </div>
                  
              </div>
  </div>
              
               
                
    </header>
  );
}
