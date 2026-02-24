import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import {
  Box, CreditCard,
  Home, Loader, MapPin, Menu, Search, User, WifiOff, Clock
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/axios";

import { GetUserProfile } from "@/api/get-profile";
import { InteressarPedidos } from "@/api/interessar-pedido";
import { SearchNearOrders } from "@/api/search-nearOrders";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useUserLocation } from "../dashboard-admin/sidebar/location-services";
import { NotificationDropdown } from "../dashboard-admin/sidebar/Notification/notification-dropdown";
import { SkeletonsDemo } from "./NearClientsSearch";
import { OrderCallSystem } from "./order-call-system";
import { Vitrine } from "./Vitrine";
import logo from '@/assets/logo-01.png';
import { Badge } from "@/components/ui/badge";

const LUANDA_COORDS = { latitude: -8.8147, longitude: 13.2302 };

const NAV_ITEMS = [
  { label: "Início", icon: Home, path: "/servicos" },
  { label: "Pacotes", icon: Box, path: "/package" },
  { label: "Créditos", icon: CreditCard, path: "/prestadores-pedidos" },
  { label: "Perfil", icon: User, path: "/profile" },
];

export function Navigation() {
  const [isOnline] = useState(navigator.onLine);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { coords } = useUserLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: GetUserProfile,
  });

  return (
    <>
      <OrderCallSystem />
      
      {/* DESKTOP NAVIGATION */}
      <header className="hidden md:block fixed bg-white/80 dark:bg-black/80 top-0 inset-x-0 z-[100] h-20 pointer-events-none backdrop-blur-xl border-b border-zinc-200/50 dark:border-zinc-800/50">
        <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-6 lg:px-8">
          
          {/* LOGOTIPO */}
          <Link to="/servicos" className="flex items-center gap-3 pointer-events-auto min-w-[180px] group">
            <div className="relative">
              <div className="absolute -inset-3 bg-orange-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-10 h-10 flex items-center justify-center">
                <img className="h-9 object-contain transition-transform group-hover:scale-105" src={logo} alt="Liberal Angola" />
              </div>
            </div>
            <div className="flex flex-col select-none">
              <span className="font-black text-sm uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-50">Liberal</span>
              <span className="text-[8px] font-black text-orange-500 tracking-widest uppercase">Angola Business</span>
            </div>
          </Link>

          {/* NAVEGAÇÃO CENTRAL */}
          <nav className={`
            absolute left-1/2 -translate-x-1/2 h-12 pointer-events-auto
            flex items-center gap-1 p-1 rounded-2xl
            transition-all duration-500 ease-out
            ${scrolled 
              ? "bg-white/90 dark:bg-zinc-900/90 border border-zinc-200/60 dark:border-zinc-800/50 shadow-lg shadow-zinc-200/50 dark:shadow-none backdrop-blur-xl" 
              : "bg-white/60 dark:bg-zinc-900/40 backdrop-blur-md border border-zinc-200/40 dark:border-zinc-800/30"}
          `}>
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={`
                      relative rounded-xl h-10 gap-2 px-5 text-[10px] font-black transition-all duration-200
                      ${isActive 
                        ? "text-zinc-900 dark:text-white" 
                        : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"}
                    `}
                  >
                    <item.icon 
                      size={15} 
                      strokeWidth={isActive ? 2.5 : 2} 
                      className={isActive ? "text-orange-500" : ""} 
                    />
                    <span className="relative z-10 uppercase tracking-wider">{item.label}</span>
                    {isActive && (
                      <motion.div 
                        layoutId="navActiveGlow" 
                        className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200/60 dark:border-zinc-700/50" 
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* AÇÕES DIREITA */}
          <div className="flex items-center gap-2 pointer-events-auto min-w-[280px] justify-end">
            <SearchModal coords={coords} isOnline={isOnline} trigger={
              <Button 
                size="icon" 
                variant="ghost" 
                className="rounded-xl h-10 w-10 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 transition-colors"
              >
                <Search size={18} className="text-zinc-500 dark:text-zinc-400" />
              </Button>
            } />
            
            <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
            
            <div className="flex items-center gap-1 bg-zinc-100/60 dark:bg-zinc-900/40 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-800/50 backdrop-blur-sm">
              {profile && <NotificationDropdown {...profile} />}
          
              <ModeToggle />
            </div>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="rounded-xl h-10 px-4 gap-2 hover:bg-orange-500 hover:text-white transition-all duration-200 group"
                >
                  <Menu className="h-4 w-4 text-zinc-500 group-hover:text-white transition-colors" />
                  <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] p-0">
                <Vitrine />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* MOBILE NAVIGATION */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50">
        <div className="relative bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-200/50 dark:border-zinc-800/50 pb-safe shadow-[0_-8px_32px_rgba(0,0,0,0.08)] dark:shadow-none">
          <ul className="flex items-center justify-around h-16 px-2">
            <li className="flex-1">
              <MobileNavItem 
                to="/servicos" 
                icon={Home} 
                label="Início" 
                active={location.pathname === "/servicos"} 
              />
            </li>
            <li className="flex-1">
              <MobileNavItem 
                to="/package" 
                icon={Box} 
                label="Pacotes" 
                active={location.pathname === "/package"} 
              />
            </li>

            {/* BUSCA CENTRAL FLUTUANTE */}
            <li className="flex-1 flex justify-center relative">
              <div className="absolute -top-8">
                <SearchModal coords={coords} isOnline={isOnline} trigger={
                  <button className="h-16 w-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-[0_8px_24px_rgba(249,115,22,0.3)] border-[5px] border-white dark:border-zinc-950 flex items-center justify-center active:scale-90 transition-transform duration-200">
                    <Search size={24} className="text-white" strokeWidth={2.5} />
                  </button>
                } />
              </div>
            </li>

            <li className="flex-1">
              <MobileNavItem 
                to="/prestadores-pedidos" 
                icon={CreditCard} 
                label="Créditos" 
                active={location.pathname === "/prestadores-pedidos"} 
              />
            </li>
            <li className="flex-1">
              <MobileNavItem 
                to="/profile" 
                icon={User} 
                label="Perfil" 
                active={location.pathname === "/profile"} 
              />
            </li>
          </ul>
          
          {/* Espaçador para o Home Indicator (iOS) */}
          <div className="h-[env(safe-area-inset-bottom)]" />
        </div>
      </nav>
    </>
  );
}

function MobileNavItem({ to, icon: Icon, label, active }: any) {
  return (
    <Link 
      to={to} 
      className="flex flex-col items-center justify-center gap-1.5 w-full h-full group"
    >
      <div className={`
        p-2 rounded-xl transition-all duration-200
        ${active 
          ? "text-orange-500 bg-orange-50 dark:bg-orange-500/10 scale-105" 
          : "text-zinc-400 group-active:scale-90"}
      `}>
        <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      </div>
      <span className={`
        text-[9px] font-black uppercase tracking-tight
        ${active 
          ? "text-zinc-900 dark:text-zinc-100" 
          : "text-zinc-400"}
      `}>
        {label}
      </span>
    </Link>
  );
}

function SearchModal({ trigger, isOnline, coords }: { trigger: React.ReactNode; isOnline: boolean; coords: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: ["nearOrders", coords?.latitude, coords?.longitude, isOpen],
    queryFn: async () => {
      const searchCoords = coords?.latitude ? coords : LUANDA_COORDS;
      return await SearchNearOrders({
        latitude: searchCoords.latitude,
        longitude: searchCoords.longitude,
        radiusKm: 100,
      });
    },
    enabled: isOpen,
  });

  const { mutateAsync: Interessar, isPending } = useMutation({
    mutationFn: InteressarPedidos,
    onError: () => toast.error("Falha ao se candidatar."),
    onSettled: () => setLoadingId(null),
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[calc(100%-2rem)] max-w-xl h-[85vh] md:h-[80vh] p-0 overflow-hidden flex flex-col rounded-2xl md:rounded-3xl border border-zinc-200/60 dark:border-zinc-800/50 shadow-2xl">
        
        {/* HEADER */}
        <DialogHeader className="p-5 sm:p-6 bg-gradient-to-br from-zinc-900 to-zinc-800 dark:from-zinc-950 dark:to-zinc-900 text-white shrink-0 border-b border-zinc-800/50">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-orange-500 rounded-xl shadow-lg shadow-orange-500/20">
                <Search size={20} strokeWidth={2.5} />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold">Serviços Próximos</DialogTitle>
                <DialogDescription className="text-zinc-400 text-xs sm:text-sm mt-0.5">
                  {data?.length || 0} oportunidades disponíveis
                </DialogDescription>
              </div>
            </div>
            {coords && (
              <Badge 
                variant="outline" 
                className="bg-zinc-800/50 border-zinc-700/50 text-zinc-300 text-[10px] gap-1"
              >
                <MapPin size={10} />
                Sua localização
              </Badge>
            )}
          </div>
        </DialogHeader>

        {/* CONTEÚDO */}
        <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
          <ScrollArea className="h-full p-4 sm:p-5">
            <div className="space-y-3 pb-10">
              {!isOnline ? (
                <div className="py-20 text-center">
                  <div className="inline-flex p-4 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-3">
                    <WifiOff className="h-8 w-8 text-zinc-400" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">Sem conexão</p>
                  <p className="text-xs text-zinc-500 mt-1">Verifique sua internet</p>
                </div>
              ) : isFetching ? (
                <div className="space-y-3">
                  <SkeletonsDemo />
                  <SkeletonsDemo />
                  <SkeletonsDemo />
                </div>
              ) : data && data.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {data.map((order: any) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      isPending={isPending} 
                      loadingId={loadingId} 
                      onInteressar={(id: any) => { 
                        setLoadingId(id); 
                        Interessar({ pedidoId: id }); 
                      }} 
                    />
                  ))}
                </AnimatePresence>
              ) : (
                <div className="py-20 text-center">
                  <div className="inline-flex p-4 rounded-full bg-zinc-100 dark:bg-zinc-900 mb-3">
                    <Search className="h-8 w-8 text-zinc-400" />
                  </div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">Nenhum serviço encontrado</p>
                  <p className="text-xs text-zinc-500 mt-1">Tente expandir o raio de busca</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function OrderCard({ order, loadingId, onInteressar, isPending }: any) {
  const formattedDate = order.created_at
    ? formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: pt })
    : "Agora";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className="group p-4 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/50 bg-white dark:bg-zinc-900/50 hover:shadow-lg hover:shadow-zinc-200/50 dark:hover:shadow-none hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-200 backdrop-blur-sm"
    >
      {/* HEADER DO CARD */}
      <div className="flex gap-3 items-start mb-3">
        <Avatar className="h-12 w-12 rounded-xl ring-2 ring-zinc-200 dark:ring-zinc-800 shrink-0">
          <AvatarImage 
            src={order.image_path ? `${api.defaults.baseURL}/uploads/${order.image_path}` : undefined} 
            className="object-cover" 
          />
          <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white font-black text-sm rounded-xl">
            {order.title?.slice(0, 2).toUpperCase() || "??"}
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-white line-clamp-2 leading-tight">
              {order.title}
            </h3>
            <Badge 
              variant="outline" 
              className="shrink-0 bg-orange-50 dark:bg-orange-500/10 border-orange-200 dark:border-orange-800/50 text-orange-600 dark:text-orange-400 text-[9px] font-black px-2 py-0.5"
            >
              <Clock size={9} className="mr-1" />
              {formattedDate}
            </Badge>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 text-[10px] text-zinc-500 dark:text-zinc-400 font-semibold">
            <div className="flex items-center gap-1">
              <MapPin size={11} className="text-orange-500 shrink-0" />
              <span className="truncate">{order.location || "Luanda"}</span>
            </div>
            {order.dono?.nome && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700">•</span>
                <div className="flex items-center gap-1">
                  <User size={11} className="shrink-0" />
                  <span className="truncate">{order.dono.nome.split(' ')[0]}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* BOTÃO DE AÇÃO */}
      <Button
        onClick={() => onInteressar(order.id)}
        disabled={isPending && loadingId === order.id}
        className="w-full h-10 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending && loadingId === order.id ? (
          <div className="flex items-center gap-2">
            <Loader className="animate-spin" size={14} />
            <span>Processando...</span>
          </div>
        ) : (
          "Candidatar-me"
        )}
      </Button>
    </motion.div>
  );
}