import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import {
    Bell,
    Box,
    CreditCard,
    Handshake,
    Home,
    Loader,
    MapPin,
    Search,
    User,
    WifiOff,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/axios";

// API e Hooks (Certifique-se que os caminhos estão corretos no seu projeto)
import { InteressarPedidos } from "@/api/interessar-pedido";
import { SearchNearOrders } from "@/api/search-nearOrders";
import { useUserLocation } from "../dashboard-admin/sidebar/location-services";
import { SkeletonsDemo } from "./NearClientsSearch";

// Coordenadas Base: Luanda
const LUANDA_COORDS = {
  latitude: -8.8147,
  longitude: 13.2302,
};

const NAV_ITEMS = [
  { label: "Início", icon: Home, path: "/servicos" },
  { label: "Pacotes", icon: Box, path: "/package" },
  { label: "Pedidos", icon: CreditCard, path: "/prestadores-pedidos" },
  { label: "Perfil", icon: User, path: "/profile" },
];

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
      {/* 🖥️ DESKTOP NAV */}
      <header className="hidden md:flex fixed top-0 inset-x-0 z-[100] h-16 items-center justify-center px-6">
        <nav className="w-full max-w-5xl h-12 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-full px-4 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-2 ring-orange-500/20">
              <AvatarFallback className="bg-orange-500 text-white text-[10px]">LC</AvatarFallback>
            </Avatar>
            <span className="font-bold text-sm italic">Liberal</span>
          </div>

          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`rounded-full gap-2 px-4 transition-all ${
                    location.pathname === item.path
                      ? "bg-orange-500/10 text-orange-600 dark:text-orange-400"
                      : "text-zinc-500"
                  }`}
                >
                  <item.icon size={16} />
                  <span className="font-medium">{item.label}</span>
                </Button>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <SearchModal 
              coords={coords} 
              isOnline={isOnline} 
              trigger={
                <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 text-zinc-500 hover:bg-orange-50">
                  <Search size={18} />
                </Button>
              } 
            />
            <div className="h-4 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-1" />
            <Button size="icon" variant="ghost" className="rounded-full h-8 w-8 text-zinc-500">
              <Bell size={18} />
            </Button>
          </div>
        </nav>
      </header>

      {/* 📱 MOBILE NAV */}
      <nav className="md:hidden fixed bottom-6 inset-x-4 z-50">
        <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border border-zinc-200 dark:border-zinc-800 shadow-2xl rounded-[2.5rem] h-20 px-6 flex items-center justify-between">
          <ul className="flex w-full justify-between items-center">
            <li className="flex-1 flex justify-center">
              <MobileNavItem to="/servicos" icon={Home} label="Início" active={location.pathname === "/servicos"} />
            </li>
            <li className="flex-1 flex justify-center">
              <MobileNavItem to="/package" icon={Box} label="Pacotes" active={location.pathname === "/package"} />
            </li>

            <li className="relative -top-8 flex-1 flex justify-center">
              <SearchModal
                coords={coords}
                isOnline={isOnline}
                trigger={
                  <Button className="h-16 w-16 rounded-full bg-gradient-to-tr from-orange-500 to-pink-600 shadow-lg shadow-orange-500/40 border-4 border-white dark:border-zinc-950 hover:scale-105 transition-transform">
                    <Search size={28} className="text-white" />
                  </Button>
                }
              />
            </li>

            <li className="flex-1 flex justify-center">
              <MobileNavItem to="/prestadores-pedidos" icon={CreditCard} label="Créditos" active={location.pathname === "/prestadores-pedidos"} />
            </li>
            <li className="flex-1 flex justify-center">
              <MobileNavItem to="/profile" icon={User} label="Perfil" active={location.pathname === "/profile"} />
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}

function MobileNavItem({ to, icon: Icon, label, active }: any) {
  return (
    <Link to={to} className="flex flex-col items-center gap-1">
      <div className={`p-2 rounded-xl transition-all ${active ? "bg-orange-500 text-white shadow-md" : "text-zinc-400"}`}>
        <Icon size={22} strokeWidth={active ? 2.5 : 2} />
      </div>
      <span className={`text-[10px] font-bold ${active ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`}>{label}</span>
    </Link>
  );
}

function SearchModal({ trigger, isOnline, coords }: { trigger: React.ReactNode; isOnline: boolean; coords: any }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUsingFallback, setIsUsingFallback] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const { data, isFetching } = useQuery({
    queryKey: ["nearOrders", coords?.latitude, coords?.longitude, isOpen],
    queryFn: async () => {
      const searchCoords = coords?.latitude ? coords : LUANDA_COORDS;
      const results = await SearchNearOrders({
        latitude: searchCoords.latitude,
        longitude: searchCoords.longitude,
        radiusKm: 100,
      });

      if (results.length === 0 && coords?.latitude) {
        setIsUsingFallback(true);
        return await SearchNearOrders({
          latitude: LUANDA_COORDS.latitude,
          longitude: LUANDA_COORDS.longitude,
          radiusKm: 100,
        });
      }
      setIsUsingFallback(false);
      return results;
    },
    enabled: isOpen,
  });

  const { mutateAsync: Interessar, isPending } = useMutation({
    mutationFn: InteressarPedidos,
    onError: () => toast.error("Oops! Você já se candidatou a este pedido."),
    onSettled: () => setLoadingId(null),
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-full h-[95vh] md:h-[85vh] md:max-w-2xl p-0 overflow-hidden flex flex-col rounded-t-[2rem] md:rounded-[2rem]">
        <DialogHeader className="p-6 bg-gradient-to-r from-orange-500 to-pink-500 text-white shrink-0">
          <DialogTitle className="text-2xl font-bold">Serviços Próximos</DialogTitle>
          <DialogDescription className="text-white/80">
            Trabalhos disponíveis em um raio de 100km
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden bg-zinc-50 dark:bg-zinc-950 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4 pb-10">
              {isUsingFallback && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl flex items-center gap-3">
                  <MapPin className="text-amber-600" size={18} />
                  <p className="text-xs text-amber-800 dark:text-amber-200">
                    Nenhum serviço na sua posição. Mostrando resultados de <strong>Luanda</strong>.
                  </p>
                </div>
              )}

              {!isOnline ? (
                <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
                  <WifiOff size={48} className="mb-4" />
                  <p>Sem conexão com a internet.</p>
                </div>
              ) : isFetching ? (
                <div className="space-y-4"><SkeletonsDemo /><SkeletonsDemo /></div>
              ) : data && data.length > 0 ? (
                <AnimatePresence>
                  {data.map((order: any) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      isPending={isPending}
                      loadingId={loadingId}
                      onInteressar={(id:any) => {
                        setLoadingId(id);
                        Interessar({ pedidoId: id });
                      }}
                    />
                  ))}
                </AnimatePresence>
              ) : (
                <div className="text-center py-20 text-zinc-500">
                  <p>Nenhum serviço disponível no momento.</p>
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
    : "Recentemente";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm"
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12 ring-2 ring-orange-500/10 shrink-0">
          <AvatarImage src={order.image_path ? `${api.defaults.baseURL}/uploads/${order.image_path}` : undefined} />
          <AvatarFallback className="bg-orange-100 text-orange-600 font-bold">
            {order.title?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start gap-2">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 leading-tight truncate">{order.title}</h3>
            <span className="text-[10px] text-zinc-400 whitespace-nowrap pt-1">{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-zinc-500 mt-2">
            <User size={14} className="shrink-0" />
            <span className="truncate">{order.dono?.nome}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-orange-600 mt-1">
            <MapPin size={14} className="shrink-0" />
            <span className="truncate font-medium">{order.location}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={() => onInteressar(order.id)}
        disabled={isPending && loadingId === order.id}
        className="w-full mt-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl active:scale-95 transition-transform"
      >
        {isPending && loadingId === order.id ? (
          <Loader className="animate-spin" size={18} />
        ) : (
          <div className="flex items-center gap-2">
            <Handshake size={18} />
            <span>Negociar</span>
          </div>
        )}
      </Button>
    </motion.div>
  );
}