import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import {
  Box, CreditCard, Handshake, Home, Loader, MapPin, Menu, Search, User, WifiOff,
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
import { ChatIntegrado } from "../dashboard-admin/sidebar/Mensagens";
import { NotificationDropdown } from "../dashboard-admin/sidebar/Notification/notification-dropdown";
import { SkeletonsDemo } from "./NearClientsSearch";
import { OrderCallSystem } from "./order-call-system";
import { Vitrine } from "./Vitrine";

const LUANDA_COORDS = { latitude: -8.8147, longitude: 13.2302 };

const NAV_ITEMS = [
  { label: "Início", icon: Home, path: "/servicos" },
  { label: "Pacotes", icon: Box, path: "/package" },
  { label: "Credítos", icon: CreditCard, path: "/prestadores-pedidos" },
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

      {/* 🖥️ DESKTOP INTERFACE */}
      <header className="hidden md:block fixed top-0 inset-x-0 z-[100] h-20 pointer-events-none">
        <div className="max-w-[1440px] mx-auto h-full flex items-center justify-between px-8">
          {/* LOGOTIPO */}
          <div className="flex items-center gap-4 pointer-events-auto min-w-[200px]">
            <div className="relative group">
              <div className="absolute -inset-4 bg-orange-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
              <div className="relative w-11 h-11 bg-zinc-950 dark:bg-white rounded-2xl flex items-center justify-center shadow-xl transform group-hover:-rotate-6 transition-transform duration-500">
                <span className="text-white dark:text-black font-black text-lg italic">L</span>
              </div>
            </div>
            <div className="flex flex-col select-none">
              <span className="font-black text-[15px] uppercase tracking-[0.3em] text-zinc-900 dark:text-zinc-50">Liberal</span>
              <span className="text-[9px] font-black text-orange-500 tracking-widest uppercase">Angola Business</span>
            </div>
          </div>

          {/* BARRA CENTRAL */}
          <nav className={`
            absolute left-1/2 -translate-x-1/2 h-14 pointer-events-auto
            flex items-center gap-1 p-1.5 rounded-[1.5rem]
            transition-all duration-700 cubic-bezier(0.19, 1, 0.22, 1)
            ${scrolled 
              ? "bg-white/70 dark:bg-zinc-950/70 backdrop-blur-3xl border border-white/40 dark:border-zinc-800/50 shadow-2xl translate-y-2 scale-105" 
              : "bg-white/10 dark:bg-zinc-900/10 backdrop-blur-md border border-white/10 dark:border-zinc-800/10"}
          `}>
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    className={`relative rounded-2xl h-11 gap-2.5 px-6 text-[11px] font-black transition-all ${isActive ? "text-zinc-900 dark:text-white" : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"}`}
                  >
                    <item.icon size={16} strokeWidth={isActive ? 3 : 2} className={isActive ? "text-orange-500" : ""} />
                    <span className="relative z-10 uppercase">{item.label}</span>
                    {isActive && (
                      <motion.div layoutId="navActiveGlow" className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border-t border-white/50 dark:border-zinc-700/50" />
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* AÇÕES DIREITA */}
          <div className="flex items-center gap-3 pointer-events-auto min-w-[300px] justify-end">
            <SearchModal coords={coords} isOnline={isOnline} trigger={
              <Button size="icon" variant="ghost" className="rounded-2xl h-11 w-11 hover:bg-zinc-100 dark:hover:bg-zinc-800">
                <Search size={19} className="text-zinc-500" />
              </Button>
            } />
            <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 mx-1" />
            <div className="flex items-center gap-1.5 bg-zinc-100/50 dark:bg-zinc-900/50 p-1 rounded-[1.2rem] border border-zinc-200/50 dark:border-zinc-800/50">
              {profile && <NotificationDropdown {...profile} />}
              <ChatIntegrado />
              <ModeToggle />
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="rounded-2xl h-11 px-4 gap-3 hover:bg-orange-500 hover:text-white group">
                  <Menu className="h-5 w-5 text-zinc-500 group-hover:text-white" />
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

      {/* 📱 MOBILE NAVIGATION - FULL WIDTH BOTTOM */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50">
        <div className="relative bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-200/50 dark:border-zinc-800/50 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
          <ul className="flex items-center justify-around h-16 px-2">
            <li className="flex-1">
              <MobileNavItem to="/servicos" icon={Home} label="Início" active={location.pathname === "/servicos"} />
            </li>
            <li className="flex-1">
              <MobileNavItem to="/package" icon={Box} label="Pacotes" active={location.pathname === "/package"} />
            </li>

            {/* BUSCA CENTRAL FLUTUANTE */}
            <li className="flex-1 flex justify-center relative">
              <div className="absolute -top-8">
                <SearchModal coords={coords} isOnline={isOnline} trigger={
                  <button className="h-16 w-16 rounded-full bg-orange-500 shadow-[0_10px_25px_rgba(249,115,22,0.4)] border-[6px] border-zinc-50 dark:border-zinc-950 flex items-center justify-center active:scale-90 transition-transform">
                    <Search size={26} className="text-white" strokeWidth={3} />
                  </button>
                } />
              </div>
            </li>

            <li className="flex-1">
              <MobileNavItem to="/prestadores-pedidos" icon={CreditCard} label="Pedidos" active={location.pathname === "/prestadores-pedidos"} />
            </li>
            <li className="flex-1">
              <MobileNavItem to="/profile" icon={User} label="Perfil" active={location.pathname === "/profile"} />
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
    <Link to={to} className="flex flex-col items-center justify-center gap-1 w-full h-full group">
      <div className={`p-1.5 rounded-xl transition-all duration-300 ${active ? "text-orange-500 bg-orange-50 dark:bg-orange-500/10 scale-110" : "text-zinc-400 group-active:scale-90"}`}>
        <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      </div>
      <span className={`text-[9px] font-black uppercase tracking-tighter ${active ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`}>
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
      <DialogContent className="w-full h-[90vh] md:max-w-xl p-0 overflow-hidden flex flex-col rounded-t-[2.5rem] md:rounded-[2rem] border-none">
        <DialogHeader className="p-6 bg-zinc-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-500 rounded-xl"><Search size={20} /></div>
            <div>
              <DialogTitle className="text-xl">Serviços Próximos</DialogTitle>
              <DialogDescription className="text-zinc-400 text-xs">Oportunidades perto de você</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-3 pb-10">
              {!isOnline ? (
                <div className="py-20 text-center"><WifiOff className="mx-auto mb-2 text-zinc-300" /> <p>Sem conexão</p></div>
              ) : isFetching ? (
                <div className="space-y-3"><SkeletonsDemo /><SkeletonsDemo /></div>
              ) : data && data.length > 0 ? (
                <AnimatePresence>
                  {data.map((order: any) => (
                    <OrderCard 
                      key={order.id} 
                      order={order} 
                      isPending={isPending} 
                      loadingId={loadingId} 
                      onInteressar={(id: any) => { setLoadingId(id); Interessar({ pedidoId: id }); }} 
                    />
                  ))}
                </AnimatePresence>
              ) : (
                <p className="text-center py-20 text-zinc-400 text-sm">Nenhum pedido encontrado.</p>
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
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm"
    >
      <div className="flex gap-3 items-center">
        <Avatar className="h-10 w-10 rounded-xl">
          <AvatarImage src={order.image_path ? `${api.defaults.baseURL}/uploads/${order.image_path}` : undefined} className="object-cover" />
          <AvatarFallback className="bg-zinc-100 text-zinc-400 font-black text-[10px]">{order.title?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-black text-[13px] truncate">{order.title}</h3>
            <span className="text-[8px] font-black text-orange-600 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-md">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-3 mt-1 text-[10px] text-zinc-500 font-bold">
            <div className="flex items-center gap-1"><MapPin size={10} className="text-orange-500" /> <span>{order.location || "Luanda"}</span></div>
            <div className="flex items-center gap-1"><User size={10} /> <span>{order.dono?.nome?.split(' ')[0]}</span></div>
          </div>
        </div>
      </div>
      <Button
        onClick={() => onInteressar(order.id)}
        disabled={isPending && loadingId === order.id}
        className="w-full h-9 mt-3 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-orange-500 rounded-xl text-[11px] font-black"
      >
        {isPending && loadingId === order.id ? <Loader className="animate-spin" size={14} /> : "CANDIDATAR-ME"}
      </Button>
    </motion.div>
  );
}