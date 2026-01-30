import { FetchAllOrders } from "@/api/fetch-all";
import { InterestedOrdersPrestadores } from "@/api/fetch-interrested-orders";
import { GetUserProfile } from "@/api/get-profile";
import { InteressarPedidos } from "@/api/interessar-pedido";
import { Logout } from "@/api/log-out";
import { UpdatePhoto } from "@/api/update-profile-photo";
import logo from '@/assets/logo-01.png';
import { ModeToggle } from "@/components/theme/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetClose, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { api } from "@/lib/axios";
import { queryClient } from "@/lib/react-query";
import { socket } from "@/lib/socket";
import { useMutation, useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart3, Camera, CheckCircle2, ChevronRight, File, InfoIcon, LayoutDashboard, LogOut, MapPin, Menu, MoveDownLeft, MoveUpRight, Pencil, Search, Settings, Store } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, redirect, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ChatIntegrado } from "../dashboard-admin/sidebar/Mensagens";
import { NotificationDropdown } from "../dashboard-admin/sidebar/Notification/notification-dropdown";
import { BotaoNegociar } from "./botao-negociar";
import { SkeletonsDemo } from "./NearClientsSearch";
import { ServicesDialogDetails } from "./ServicesDialogDetails";

import { cn } from "@/lib/utils";
import { LanguageSelectorMini } from "./languageSelector";
import { UpdateLocationDialog } from "./localizator";

function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

export function HomeContent() {
  const [filter, setFilter] = useState<"all" | "accepted"| "completed">("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const queryFromParams = searchParams.get("query") || "";
  const [searchTerm, setSearchTerm] = useState(queryFromParams);
  const debouncedQuery = useDebounce(searchTerm, 400);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [_, setNotif] = useState<any[]>([]);

  const { data: profile, refetch:refetchProfile } = useQuery({
    queryKey: ["profile"],
    queryFn: GetUserProfile,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 0,
  })
  useEffect(() => {
    audioRef.current = new Audio("/bell-98033.mp3");
    audioRef.current.volume = 0.7;
  }, []);
  const { mutateAsync: Sair } = useMutation({ mutationFn: Logout,
    onSuccess(_){
      redirect('/sign-in')
    }
   });
  const { mutateAsync: changeProfilePhoto } = useMutation({ mutationFn: UpdatePhoto });
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const handleSignOut = async () => { await Sair(); };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };


  

    // Simulação de dados do usuário (substitua pelo seu hook de auth)
  
  
    const menuItems = [
      { label: "Home", icon: LayoutDashboard, href: "/servicos" },
      { label: "vitrine", icon: Store, href: "/vitrine-prestadores" },
      { label: "Estatísticas", icon: BarChart3, href: "/stats" },
      { label: "Configurações", icon: Settings, href: "/config-prestadores" },
    ]
  
  const { mutateAsync: concluirPedido } = useMutation({
    mutationFn: async (pedidoId: number) => {
      console.log("pedido:",pedidoId)
      return await api.patch("/pedidos/concluir", { pedidoId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Serviço finalizado com sucesso!");
    },
    onError: () => toast.error("Erro ao finalizar serviço.")
  });
  

  const handleSave = () => {
    if (selectedFile) changeProfilePhoto({ image_path: selectedFile });
  };

  const imageSrc = preview || (profile?.image_path
    ? `${api.defaults.baseURL}/uploads/${profile.image_path}`
    : "https://i.pravatar.cc/150?u=placeholder");

  // 🎧 Socket para notificações
useEffect(() => {
  if (!profile?.id) return;

  socket.emit("register", profile.id);
  console.log("✅ Registrado no socket como:", profile.id);

  const handleUserNotification = (data: any[]) => {
    console.log("🔔 Nova notificação recebida:", data);
    refetchProfile();

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



  useEffect(() => {
    const newParams = new URLSearchParams();
    if (debouncedQuery) newParams.set("query", debouncedQuery);
    setSearchParams(newParams);
  }, [debouncedQuery, setSearchParams]);

  const { data: orders, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["orders", filter, debouncedQuery],
    queryFn: async () => {
      // Se o filtro for 'all', busca tudo. Caso contrário, busca os interessados/negociando.
      const response = filter === "all"
        ? await FetchAllOrders({ query: debouncedQuery })
        : await InterestedOrdersPrestadores();
      
      return response;
    },
    // Lógica de filtragem local baseada no status INTERRUPTED
    select: (data) => {
      if (!data) return [];
      if (filter === "completed") {
        return data.filter((item: any) => {
          const p = "pedido" in item ? item.pedido : item;
          return p.status === "CONFIRMED";
        });
      }
      if (filter === "accepted") {
        return data.filter((item: any) => {
          const p = "pedido" in item ? item.pedido : item;
          return p.status !== "ACEPTED"; // Mostra os que ainda estão em negociação
        });
      }
      return data;
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
        <div className="w-full max-w-md lg:max-w-6xl space-y-4 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-4">
          <SkeletonsDemo />
          <SkeletonsDemo />
          <SkeletonsDemo />
        </div>
      </div>
    );
  }
 
 


  return (
    <motion.div
      // Mobile: Ocupa tudo fixo | Desktop: Centralizado com padding
      className="fixed inset-0 lg:relative lg:inset-auto lg:min-h-screen lg:h-screen w-full flex items-center justify-center bg-background px-0 py-0 lg:px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Card Mobile: Sem bordas, sem sombra | Desktop: Rounded e Shadow */}
      <Card className="w-full h-full lg:max-w-6xl lg:h-[95dvh] flex flex-col border-none lg:border-none shadow-none lg:shadow-1xl overflow-hidden bg-transparent lg:bg-card">
        
        {/* HEADER MOBILE (Identico ao seu original) */}
        <header className="w-full lg:hidden shrink-0 z-50 sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div className="h-[env(safe-area-inset-top)] w-full" />
          <div className="h-16 px-4 flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4 shrink-0 px-2">
  {/* 1. Logotipo de lado */}
  <motion.div 
    initial={{ opacity: 0, x: -10 }} 
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center"
  >
    <img src={logo} alt="Logo" className="h-8 sm:h-10 w-auto object-contain" />
  </motion.div>

  {/* 2. Componente Separator do Shadcn-UI */}
  <Separator orientation="vertical" className="h-8 bg-zinc-200 dark:bg-zinc-800" />

  {/* 3. Avatar e Informações do Perfil */}
  <div className="flex items-center gap-3 flex-shrink-0">
    <Dialog>
      <DialogTrigger asChild>
        <motion.button whileTap={{ scale: 0.95 }} className="relative group focus:outline-none">
          <Avatar className="h-10 w-10 sm:h-12 sm:w-12 ring-2 ring-orange-500/10 group-hover:ring-orange-500 transition-all">
            <AvatarImage src={imageSrc} className="object-cover" />
            <AvatarFallback className="font-bold">
              {profile?.nome?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
        </motion.button>
      </DialogTrigger>

      <DialogContent className="max-w-md rounded-[2.5rem]">
        <DialogHeader><DialogTitle className="text-center">Minha Conta</DialogTitle></DialogHeader>
        <div className="flex flex-col items-center gap-4 py-4">
          <div className="relative group">
            <img src={imageSrc} className="w-28 h-28 rounded-full object-cover ring-4 ring-orange-400" />
            <label htmlFor="file-up" className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full cursor-pointer text-white shadow-lg">
              <Camera size={18} />
            </label>
            <input id="file-up" type="file" className="hidden" onChange={handleFileChange} />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg">{profile?.nome}</h3>
            <p className="text-sm text-muted-foreground">+244 {profile?.celular}</p>
          </div>
        </div>
        <div className="grid gap-2">
          <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600 rounded-xl font-bold">Salvar</Button>
          <Button onClick={handleSignOut} variant="outline" className="text-red-500 rounded-xl">
            <LogOut className="mr-2" size={16}/> Sair
          </Button>
        </div>
      </DialogContent>
    </Dialog>

    {/* Informações de Texto (Visíveis no Desktop) */}
    <div className="hidden lg:flex flex-col truncate max-w-[100px]">
      <span className="text-sm font-bold truncate leading-none">
        {profile?.nome?.split(' ')[0]}
      </span>
      <span className="text-[10px] text-orange-500 font-bold uppercase mt-1">Ouro</span>
    </div>
  </div>
</div>
            <div className="flex items-center gap-2">
              <div className="bg-zinc-100/80 dark:bg-zinc-800/80 rounded-2xl p-0.5">
                {profile && <NotificationDropdown {...profile} />}
              </div>

 <Sheet>
 <SheetTrigger asChild>
 <Button variant="outline" size="icon" className="rounded-2xl h-11 w-11">
 <Menu className="h-5 w-5 text-muted-foreground" />
</Button>
</SheetTrigger>
<SheetContent side="right" className="w-[85%] p-0 border-l-0 bg-zinc-50 dark:bg-zinc-950 flex flex-col">
      
      {/* HEADER: NOME DO APP */}
      

      {/* PERFIL DO USUÁRIO */}
      <div className="px-8 py-6">
        <div className="flex items-center gap-4 p-4 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <Avatar className="h-14 w-14 border-2 border-orange-500 p-0.5">
            <AvatarImage src={imageSrc} className="rounded-full object-cover" />
            <AvatarFallback className="font-black bg-zinc-100 uppercase">
             
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-zinc-900 dark:text-zinc-50 truncate">
              {profile?.nome}
            </p>
            <p className="text-[10px] font-bold uppercase text-zinc-400 tracking-wider">
              {profile?.role}
            </p>
          </div>
        </div>
      </div>

      {/* LINKS DE NAVEGAÇÃO */}
      <nav className="flex-1 px-6 space-y-2">
        <p className="px-4 text-[10px] font-black uppercase text-zinc-400 tracking-[0.2em] mb-4">
          Navegação Principal
        </p>
        {menuItems.map((item) => (
          <SheetClose asChild key={item.label}>
            <Link  to={item.href} className="flex items-center justify-between w-full p-4 rounded-2xl hover:bg-orange-500/10 group transition-all text-left">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 group-hover:border-orange-500/50 transition-colors">
                  <item.icon size={20} className="text-zinc-500 group-hover:text-orange-500 transition-colors" />
                </div>
                <span className="text-sm font-black uppercase tracking-tight text-zinc-700 dark:text-zinc-300 group-hover:text-zinc-900 dark:group-hover:text-white">
                  {item.label}
                </span>
              </div>
              <ChevronRight size={16} className="text-zinc-300 group-hover:text-orange-500" />
            </Link>
          </SheetClose>
        ))}
      </nav>

      {/* FOOTER: SAIR */}
      <div className="p-8 mt-auto">
        <Separator className="mb-6 opacity-50" />
        <Button 
          variant="destructive" 
          className="w-full h-14 rounded-[1.5rem] font-black uppercase tracking-wider gap-3 shadow-lg shadow-red-500/20"
          onClick={() =>Sair()}
        >
          <LogOut size={18} />
          Sair da Conta
        </Button>
        <p className="mt-6 text-center text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
          Versão 1.0.0 • Angola 🇦🇴
        </p>
      </div>
    </SheetContent>

</Sheet> 
  
              <ModeToggle />
              <ChatIntegrado />
            </div>
          </div>
        </header>

        {/* HEADER DE CONTEÚDO (Pedidos + Busca) */}
        <CardHeader className="px-4 lg:px-8 pb-4 pt-4 lg:mt-5 lg:pt-6 shrink-0 bg-white dark:bg-zinc-950 border-b lg:border-none">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between w-full">
  {/* Lado Esquerdo: Título e Refresh */}
  <div className="flex items-center lg:gap-6  justify-between">
    <CardTitle className="text-2xl lg:text-4xl font-black tracking-tighter">
      Pedidos
    </CardTitle>
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => refetch()} 
      className={cn("rounded-full h-8 w-8", isFetching && "animate-spin")}
    >
      <LanguageSelectorMini></LanguageSelectorMini>


    </Button>
  </div>

  {/* Lado Direito: Botão de Localização */}
  <Dialog>
    <DialogTrigger asChild>
      <button className="flex items-center gap-3 p-2.5 pr-5 sm:p-3 sm:pr-6 rounded-[1.2rem] sm:rounded-[1.5rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 hover:border-blue-500 transition-all group w-full sm:w-auto shadow-sm active:scale-95">
        <div className="p-2 bg-blue-500/10 rounded-lg sm:rounded-xl group-hover:bg-blue-500 transition-colors">
          <MapPin size={16} className="text-blue-600 group-hover:text-white" />
        </div>
        <div className="text-left flex-1 min-w-0">
          <p className="text-[8px] sm:text-[9px] font-black text-zinc-400 uppercase tracking-tighter leading-none mb-1">
            Localização
          </p>
          <p className="text-[10px] sm:text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
            Alterar endereço
          </p>
        </div>
        <Pencil size={12} className="ml-2 text-zinc-300 group-hover:text-blue-500 transition-colors" />
      </button>
    </DialogTrigger>

    <UpdateLocationDialog />
  </Dialog>
</div>
          <CardDescription className="text-xs lg:text-sm">
            {filter === "all" ? "Novas oportunidades de trabalho." : "Pedidos interessados."}
          </CardDescription>

          <div className="flex flex-col lg:flex-row gap-3 mt-4">
            <div className="relative w-full lg:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input
                placeholder="Buscar serviços..."
                className="pl-9 h-10 lg:h-12 bg-zinc-100 dark:bg-zinc-900 border-none rounded-xl lg:rounded-2xl text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex flex-row gap-2 overflow-x-auto no-scrollbar shrink-0 pb-2">
  <Button
    variant={filter === "all" ? "default" : "secondary"}
    onClick={() => setFilter("all")}
    className="rounded-full h-9 lg:h-11 text-[11px] lg:text-sm px-4 transition-all"
  >
    Todos <MoveUpRight size={14} className="ml-1 opacity-60" />
  </Button>

  <Button
    variant={filter === "accepted" ? "default" : "secondary"}
    onClick={() => setFilter("accepted")}
    className="rounded-full h-9 lg:h-11 text-[11px] lg:text-sm px-4 transition-all"
  >
    Negociando <MoveDownLeft size={14} className="ml-1 opacity-60" />
  </Button>

  {/* Novo Botão de Pedidos Concluídos */}
  <Button
    variant={filter === "completed" ? "default" : "secondary"}
    onClick={() => setFilter("completed")}
    className="rounded-full h-9 lg:h-11 text-[11px] lg:text-sm px-4 transition-all"
  >
    Concluídos <CheckCircle2 size={14} className="ml-1 opacity-60" />
  </Button>
</div>
          </div>
        </CardHeader>

        {/* LISTAGEM (O segredo está no grid responsivo) */}
        <CardContent className="flex-1 overflow-y-auto px-3 lg:px-8 pb-20 lg:pb-8 no-scrollbar bg-zinc-50/30 dark:bg-transparent">
  <AnimatePresence mode="popLayout">
    {!orders?.length ? (
      <motion.div className="flex flex-col items-center justify-center py-20 opacity-40">
        <File size={48} />
        <p>Nenhum pedido encontrado.</p>
      </motion.div>
    ) : (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6 mt-2 lg:mt-4">
        {orders.map((card) => {
          const isInteresseComPedido = "pedido" in card;
          const pedido = isInteresseComPedido ? card.pedido : card;
          
          // LÓGICA DE STATUS
          const isCompleted = pedido?.status === "CONFIRMED"; // Ou a sua variável de controle

          return (
            <motion.div
              key={card.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ 
                opacity: isCompleted ? 0.7 : 1, // Opacidade reduzida se concluído
                scale: 1,
                filter: isCompleted ? "grayscale(0.4)" : "grayscale(0)" // Efeito visual de finalizado
              }}
              className={`group relative p-4 lg:p-6 rounded-[1.8rem] lg:rounded-[2.2rem] border transition-all flex flex-col justify-between 
                ${isCompleted 
                  ? "bg-zinc-100/50 dark:bg-zinc-800/20 border-zinc-200 dark:border-zinc-700/50 shadow-none" 
                  : "bg-white dark:bg-zinc-900/50 border-zinc-100 dark:border-zinc-800/50 shadow-sm"
                }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <Avatar className={`w-12 h-12 lg:w-14 lg:h-14 rounded-2xl ring-2 ${isCompleted ? "ring-zinc-300" : "ring-orange-500/5"}`}>
                        <AvatarImage 
                          src={`${api.defaults.baseURL}/uploads/${pedido.image_path}`} 
                          className="object-cover"
                        />
                        <AvatarFallback className={`${isCompleted ? "bg-zinc-400" : "bg-orange-500"} text-white rounded-2xl font-black`}>
                          {pedido?.title?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      
                      {/* Badge de Status no Avatar */}
                      <div className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-zinc-900 ${
                        isCompleted ? "bg-zinc-400" : (pedido?.brevidade === "URGENTE" ? "bg-red-500 animate-pulse" : "bg-emerald-500")
                      }`} />
                    </div>
                    
                    <div className="flex flex-col min-w-0 pt-0.5">
                      <h4 className={`font-black text-sm lg:text-base truncate uppercase ${isCompleted ? "text-zinc-500 line-through decoration-zinc-400" : "text-zinc-900 dark:text-zinc-100"}`}>
                        {pedido?.title}
                      </h4>
                      <p className="text-[11px] lg:text-xs text-zinc-500 line-clamp-2 mt-0.5">
                        {pedido?.content}
                      </p>
                    </div>
                  </div>

                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-xl shrink-0 h-9 w-9 bg-zinc-50 dark:bg-zinc-800/50">
                        <InfoIcon size={16} />
                      </Button>
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
                <div className="h-px w-full bg-gradient-to-r from-transparent via-zinc-100 dark:via-zinc-800 to-transparent my-3 lg:my-4" />
              </div>

              <div className="flex items-center justify-between mt-1">
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1 text-zinc-500">
                    <MapPin size={10} strokeWidth={3} className={isCompleted ? "" : "text-orange-600"} />
                    <span className="text-[9px] lg:text-[10px] font-black uppercase tracking-tighter truncate max-w-[100px]">
                      {pedido?.location || "Angola"}
                    </span>
                  </div>
                  <Badge className={`text-[8px] lg:text-[9px] px-2 py-0 border-none font-black rounded-lg ${
                      isCompleted ? "bg-zinc-200 text-zinc-500" : (pedido?.brevidade === "URGENTE" ? "bg-red-500/10 text-red-600" : "bg-emerald-500/10 text-emerald-600")
                  }`}>
                    {isCompleted ? "FINALIZADO" : pedido?.brevidade}
                  </Badge>
                </div>

             

                {/* LOGICA DO BOTÃO: Se concluído, mostra selo, senão mostra o botão de negociar */}
                <div className="flex items-center justify-between mt-1">


  {/* LÓGICA DINÂMICA DE BOTÕES */}
  <div className="flex items-center gap-2">
    {isCompleted ? (
      // ESTADO 1: JÁ CONCLUÍDO (Selo estático)
      <div className="flex items-center gap-1.5 px-3 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700">
        <CheckCircle2 size={14} className="text-emerald-500" />
        <span className="text-[9px] font-black text-zinc-500 uppercase">Finalizado</span>
      </div>
    ) : isInteresseComPedido ? (
      // ESTADO 2: EM NEGOCIAÇÃO (Botão para Concluir)
      <Button 
        size="sm"
        onClick={() => concluirPedido(card.pedido.id)}
        className="rounded-xl h-9 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase px-4 shadow-sm"
      >
        Concluir <CheckCircle2 size={14} className="ml-2" />
      </Button>
    ) : (
      // ESTADO 3: DISPONÍVEL (Botão para Negociar)
      <BotaoNegociar 
        celular={pedido.autor.celular} 
        image_path={pedido.autor.image_path} 
        isSuccess={isSuccess} 
        nome={pedido.autor.nome} 
        onClick={() => SeInteressar({ pedidoId: Number(pedido.id) })} 
      />
    )}
  </div>
</div>
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