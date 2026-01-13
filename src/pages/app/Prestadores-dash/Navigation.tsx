import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import {
  Box, CreditCard, Handshake, Home, Loader, MapPin, Search, User, WifiOff,
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

import { InteressarPedidos } from "@/api/interessar-pedido";
import { SearchNearOrders } from "@/api/search-nearOrders";
import { useUserLocation } from "../dashboard-admin/sidebar/location-services";
import { SkeletonsDemo } from "./NearClientsSearch";

const LUANDA_COORDS = { latitude: -8.8147, longitude: 13.2302 };

const NAV_ITEMS = [
  { label: "Início", icon: Home, path: "/servicos" },
  { label: "Pacotes", icon: Box, path: "/package" },
  { label: "Pedidos", icon: CreditCard, path: "/prestadores-pedidos" },
  { label: "Perfil", icon: User, path: "/profile" },
];

/** * COMPONENTE PRINCIPAL DE NAVEGAÇÃO
 */
export function Navigation() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();
  const { coords } = useUserLocation();

  useEffect(() => {
    const toggleOnline = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", toggleOnline);
    window.addEventListener("offline", toggleOnline);
    return () => {
      window.removeEventListener("online", toggleOnline);
      window.removeEventListener("offline", toggleOnline);
    };
  }, []);

  return (
    <>
      {/* 🖥️ DESKTOP NAV (Compacta & Glassmorphism) */}
      <header className="hidden md:flex fixed top-0 inset-x-0 z-[100] h-14 items-center justify-center px-6 mt-2">
        <nav className="w-full max-w-4xl h-11 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-full px-4 flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center text-[10px] text-white font-black shadow-sm shadow-orange-500/20">L</div>
            <span className="font-black text-[11px] uppercase tracking-widest text-zinc-800 dark:text-zinc-200">Liberal</span>
          </div>

          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  className={`rounded-full h-8 gap-2 px-3 text-[11px] font-bold transition-all ${
                    location.pathname === item.path
                      ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                      : "text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                  }`}
                >
                  <item.icon size={14} />
                  <span>{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          <SearchModal 
            coords={coords} 
            isOnline={isOnline} 
            trigger={
              <Button size="sm" variant="ghost" className="rounded-full h-8 gap-2 text-zinc-500 hover:text-orange-500 font-bold border border-transparent hover:border-orange-500/20 bg-zinc-50 dark:bg-zinc-900 px-4">
                <Search size={14} />
                <span className="text-[11px]">Buscar</span>
              </Button>
            } 
          />
        </nav>
      </header>

      {/* 📱 MOBILE NAV (Ultra Compacta h-16) */}
      <nav className="md:hidden fixed bottom-4 inset-x-4 z-50">
        <div className="bg-white/95 dark:bg-zinc-950/95 backdrop-blur-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[2rem] h-16 px-4 flex items-center">
          <ul className="flex w-full justify-around items-center">
            <li><MobileNavItem to="/servicos" icon={Home} label="Início" active={location.pathname === "/servicos"} /></li>
            <li><MobileNavItem to="/package" icon={Box} label="Pacotes" active={location.pathname === "/package"} /></li>

            <li className="relative -top-6">
              <SearchModal
                coords={coords}
                isOnline={isOnline}
                trigger={
                  <div className="flex flex-col items-center gap-1 group">
                    <button className="h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 via-rose-500 to-pink-600 shadow-xl shadow-orange-500/40 border-[4px] border-white dark:border-zinc-900 active:scale-90 transition-all flex items-center justify-center">
                      <Search size={24} className="text-white" />
                    </button>
                    <span className="text-[9px] font-black text-orange-600 uppercase tracking-tighter">Buscar</span>
                  </div>
                }
              />
            </li>

            <li><MobileNavItem to="/prestadores-pedidos" icon={CreditCard} label="Pedidos" active={location.pathname === "/prestadores-pedidos"} /></li>
            <li><MobileNavItem to="/profile" icon={User} label="Perfil" active={location.pathname === "/profile"} /></li>
          </ul>
        </div>
      </nav>
    </>
  );
}

/** * BOTÃO DE NAVEGAÇÃO MOBILE
 */
function MobileNavItem({ to, icon: Icon, label, active }: any) {
  return (
    <Link to={to} className="flex flex-col items-center gap-0.5">
      <div className={`p-1.5 rounded-xl transition-all ${active ? "text-orange-500 bg-orange-50 dark:bg-orange-500/10" : "text-zinc-400"}`}>
        <Icon size={20} strokeWidth={active ? 2.5 : 2} />
      </div>
      <span className={`text-[9px] font-bold tracking-tight ${active ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`}>
        {label}
      </span>
    </Link>
  );
}

/** * MODAL DE PESQUISA (RESOLVIDO: FORA DO NAVIGATION)
 */
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
    onError: () => toast.error("Você já se candidatou a este pedido."),
    onSettled: () => setLoadingId(null),
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-full h-[90vh] md:max-w-xl p-0 overflow-hidden flex flex-col rounded-t-[2.5rem] md:rounded-[2rem] border-none">
        <DialogHeader className="p-6  dark:bg-zinc-900 text-white shrink-0">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-orange-500 rounded-xl"><Search size={20} /></div>
             <div>
                <DialogTitle className="text-xl text-muted-foreground">Serviços Próximos</DialogTitle>
                <DialogDescription className="text-zinc-400 text-xs">Trabalhos em Luanda e arredores</DialogDescription>
             </div>
          </div>
        </DialogHeader>

        <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 flex flex-col overflow-hidden">
          <ScrollArea className="h-full p-4">
            <div className="space-y-3 pb-10">
              {!isOnline ? (
                <div className="py-20 text-center"><WifiOff className="mx-auto mb-2 text-zinc-300" /> <p className="text-sm">Sem conexão</p></div>
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
                <p className="text-center py-20 text-zinc-400 text-sm font-medium">Nenhum pedido encontrado no momento.</p>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** * CARD DE PEDIDO (EMBELEZADO & COMPACTO)
 */
function OrderCard({ order, loadingId, onInteressar, isPending }: any) {
  const formattedDate = order.created_at
    ? formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: pt })
    : "Agora";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex gap-3 items-center">
        <Avatar className="h-10 w-10 rounded-xl border-2 border-orange-500/10">
          <AvatarImage src={order.image_path ? `${api.defaults.baseURL}/uploads/${order.image_path}` : undefined} className="object-cover" />
          <AvatarFallback className="bg-zinc-100 text-zinc-400 font-black text-[10px]">{order.title?.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <h3 className="font-black text-[13px] text-zinc-900 dark:text-zinc-100 truncate pr-2">{order.title}</h3>
            <span className="text-[9px] font-bold text-orange-600 bg-orange-50 dark:bg-orange-500/10 px-2 py-0.5 rounded-full uppercase">{formattedDate}</span>
          </div>
          
          <div className="flex items-center gap-3 mt-1 text-[10px] font-bold text-zinc-500">
             <div className="flex items-center gap-1"><MapPin size={10} className="text-orange-500" /> <span>{order.location || "Luanda"}</span></div>
             <div className="flex items-center gap-1"><User size={10} /> <span>{order.dono?.nome?.split(' ')[0]}</span></div>
          </div>
        </div>
      </div>

      <Button
        onClick={() => onInteressar(order.id)}
        disabled={isPending && loadingId === order.id}
        className="w-full h-9 mt-3  dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-orange-500 dark:hover:bg-orange-500 hover:text-white rounded-xl text-[11px] font-black gap-2 transition-all shadow-sm"
      >
        {isPending && loadingId === order.id ? <Loader className="animate-spin" size={14} /> : <><Handshake size={15} /> CANDIDATAR-ME</>}
      </Button>
    </motion.div>
  );
}