import { GetUserProfile } from "@/api/get-profile";
import { InteressarPedidos } from "@/api/interessar-pedido";
import { SearchNearOrders } from "@/api/search-nearOrders";
import { ModeToggle } from "@/components/theme/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { api } from "@/lib/axios";
import { useMutation, useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { AnimatePresence, motion } from "framer-motion";
import {
  Box,
  Clock,
  CreditCard,
  Home,
  Loader2,
  MapPin,
  Menu,
  Search,
  Sparkles,
  User,
  WifiOff,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useUserLocation } from "../dashboard-admin/sidebar/location-services";
import { NotificationDropdown } from "../dashboard-admin/sidebar/Notification/notification-dropdown";
import { SkeletonsDemo } from "./NearClientsSearch";
import { OrderCallSystem } from "./order-call-system";
import { Vitrine } from "./Vitrine";
import logo from "@/assets/logo-01.png";

// ─── Constants ────────────────────────────────────────────────────────────────

const LUANDA_COORDS = { latitude: -8.8147, longitude: 13.2302 };

const NAV_ITEMS = [
  { label: "Início",   icon: Home,       path: "/servicos" },
  { label: "Pacotes",  icon: Box,        path: "/package" },
  { label: "Créditos", icon: CreditCard, path: "/prestadores-pedidos" },
  { label: "Perfil",   icon: User,       path: "/profile" },
];

// ─── Navigation ───────────────────────────────────────────────────────────────

export function Navigation() {
  const [isOnline] = useState(navigator.onLine);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { coords } = useUserLocation();

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: GetUserProfile,
  });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <OrderCallSystem />

      {/* ── Desktop header ── */}
      <header
        className={`hidden md:flex fixed top-0 inset-x-0 z-[100] h-[68px] items-center transition-all duration-500 ${
          scrolled
            ? "bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-200/60 dark:border-zinc-800/60 shadow-sm"
            : "bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-zinc-200/30 dark:border-zinc-800/30"
        }`}
      >
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between px-6 lg:px-10">

          {/* Logo */}
          <Link to="/servicos" className="flex items-center gap-3 group min-w-[180px]">
            <div className="relative">
              <div className="absolute -inset-3 bg-orange-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={logo}
                alt="Liberal Angola"
                className="relative h-9 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col select-none leading-none">
              <span className="font-black text-sm uppercase tracking-[0.2em] text-zinc-900 dark:text-zinc-50">
                Liberal
              </span>
              <span className="text-[8px] font-black text-orange-500 tracking-widest uppercase">
                Angola Business
              </span>
            </div>
          </Link>

          {/* Pill nav */}
          <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1 p-1 rounded-2xl bg-zinc-100/80 dark:bg-zinc-900/80 border border-zinc-200/60 dark:border-zinc-800/60 backdrop-blur-sm shadow-sm">
            {NAV_ITEMS.map((item) => {
              const active = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <div className="relative">
                    {active && (
                      <motion.div
                        layoutId="desktopPill"
                        className="absolute inset-0 bg-white dark:bg-zinc-800 rounded-xl shadow-sm border border-zinc-200/60 dark:border-zinc-700/50"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                      />
                    )}
                    <div
                      className={`relative flex items-center gap-2 px-5 h-9 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors duration-200 ${
                        active
                          ? "text-zinc-900 dark:text-white"
                          : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                      }`}
                    >
                      <item.icon
                        size={14}
                        strokeWidth={active ? 2.5 : 2}
                        className={active ? "text-orange-500" : ""}
                      />
                      {item.label}
                    </div>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 min-w-[180px] justify-end">
            <SearchModal coords={coords} isOnline={isOnline} trigger={
              <button className="h-9 w-9 flex items-center justify-center rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800/60 text-zinc-500 hover:text-orange-500 transition-colors">
                <Search size={17} />
              </button>
            } />

            <div className="h-5 w-px bg-zinc-200 dark:bg-zinc-800" />

            <div className="flex items-center gap-0.5 bg-zinc-100/60 dark:bg-zinc-900/60 p-1 rounded-xl border border-zinc-200/60 dark:border-zinc-800/50">
              {profile && <NotificationDropdown {...profile} />}
              <ModeToggle />
            </div>

            <Sheet>
              <SheetTrigger asChild>
                <button className="flex items-center gap-2 h-9 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:bg-orange-500 hover:text-white border border-zinc-200 dark:border-zinc-800 hover:border-transparent transition-all duration-200 group">
                  <Sparkles size={13} className="group-hover:fill-white/30" />
                  <span className="hidden lg:block">Vitrine</span>
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[400px] p-0 border-l border-zinc-200 dark:border-zinc-800">
                <Vitrine />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* ── Desktop spacer ── */}
      <div className="hidden md:block h-[68px]" />

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50">
        <div className="relative bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-t border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_-8px_32px_rgba(0,0,0,0.07)] dark:shadow-none">
          <ul className="flex items-end justify-around h-[60px] px-2">

            {/* Início */}
            <li className="flex-1">
              <MobileNavItem
                to="/servicos"
                icon={Home}
                label="Início"
                active={location.pathname === "/servicos"}
              />
            </li>

            {/* Pacotes */}
            <li className="flex-1">
              <MobileNavItem
                to="/package"
                icon={Box}
                label="Pacotes"
                active={location.pathname === "/package"}
              />
            </li>

            {/* Search FAB — centre */}
            <li className="flex-1 flex flex-col items-center justify-end pb-1 relative">
              <SearchModal
                coords={coords}
                isOnline={isOnline}
                trigger={
                  <button className="relative -translate-y-4 h-[58px] w-[58px] rounded-full bg-gradient-to-br from-orange-500 to-orange-600 shadow-[0_6px_20px_rgba(249,115,22,0.45)] border-[4px] border-white dark:border-zinc-950 flex items-center justify-center active:scale-90 transition-transform duration-200">
                    <Search size={22} className="text-white" strokeWidth={2.5} />
                  </button>
                }
              />
            </li>

            {/* Créditos */}
            <li className="flex-1">
              <MobileNavItem
                to="/prestadores-pedidos"
                icon={CreditCard}
                label="Créditos"
                active={location.pathname === "/prestadores-pedidos"}
              />
            </li>

            {/* Perfil */}
            <li className="flex-1">
              <MobileNavItem
                to="/profile"
                icon={User}
                label="Perfil"
                active={location.pathname === "/profile"}
              />
            </li>
          </ul>

          {/* iOS home indicator safe area */}
          <div className="h-[env(safe-area-inset-bottom,0px)]" />
        </div>
      </nav>

      {/* Mobile bottom spacer */}
      <div className="md:hidden h-[calc(60px+env(safe-area-inset-bottom,0px))]" />
    </>
  );
}

// ─── MobileNavItem ────────────────────────────────────────────────────────────

function MobileNavItem({
  to,
  icon: Icon,
  label,
  active,
}: {
  to: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
}) {
  return (
    <Link to={to} className="flex flex-col items-center justify-end gap-1 h-full pb-1 group">
      <div className="relative flex items-center justify-center">
        {active && (
          <motion.div
            layoutId="mobileActive"
            className="absolute inset-0 -m-1.5 rounded-xl bg-orange-50 dark:bg-orange-500/10"
            transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
          />
        )}
        <div
          className={`relative p-1.5 rounded-xl transition-all duration-200 ${
            active ? "scale-105" : "group-active:scale-90"
          }`}
        >
          <Icon
            size={20}
            strokeWidth={active ? 2.5 : 2}
            className={active ? "text-orange-500" : "text-zinc-400"}
          />
        </div>
      </div>
      <span
        className={`text-[9px] font-black uppercase tracking-tight leading-none ${
          active ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"
        }`}
      >
        {label}
      </span>
    </Link>
  );
}

// ─── SearchModal ──────────────────────────────────────────────────────────────

function SearchModal({
  trigger,
  isOnline,
  coords,
}: {
  trigger: React.ReactNode;
  isOnline: boolean;
  coords: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const { data, isFetching } = useQuery({
    queryKey: ["nearOrders", coords?.latitude, coords?.longitude, isOpen],
    queryFn: async () => {
      const c = coords?.latitude ? coords : LUANDA_COORDS;
      return SearchNearOrders({ latitude: c.latitude, longitude: c.longitude, radiusKm: 100 });
    },
    enabled: isOpen,
  });

  const { mutateAsync: interessar, isPending } = useMutation({
    mutationFn: InteressarPedidos,
    onError: () => toast.error("Falha ao se candidatar."),
    onSettled: () => setLoadingId(null),
  });

  // Auto-focus search input when dialog opens
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 200);
  }, [isOpen]);

  const filtered = data?.filter((o: any) =>
    !search ||
    o.title?.toLowerCase().includes(search.toLowerCase()) ||
    o.location?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-xl h-[88dvh] p-0 overflow-hidden flex flex-col rounded-3xl border border-zinc-200/60 dark:border-zinc-800/60 shadow-2xl gap-0">

        {/* Header */}
        <div className="bg-zinc-900 dark:bg-zinc-950 px-5 pt-5 pb-4 flex-shrink-0">
          <DialogHeader>
            <div className="flex items-center justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Search size={18} className="text-white" strokeWidth={2.5} />
                </div>
                <div>
                  <DialogTitle className="text-white font-black text-lg tracking-tighter leading-none">
                    Serviços Próximos
                  </DialogTitle>
                  <DialogDescription className="text-zinc-400 text-xs mt-0.5 font-medium">
                    {filtered?.length ?? data?.length ?? 0} oportunidades disponíveis
                  </DialogDescription>
                </div>
              </div>

              {coords?.latitude && (
                <div className="flex items-center gap-1 bg-zinc-800/80 border border-zinc-700/50 text-zinc-300 text-[10px] font-bold px-2.5 py-1.5 rounded-full">
                  <MapPin size={10} className="text-orange-400" />
                  Localização activa
                </div>
              )}
            </div>

            {/* Search bar */}
            <div className="relative">
              <Search size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                ref={inputRef}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filtrar por título ou localização..."
                className="w-full h-10 pl-9 pr-4 rounded-xl bg-zinc-800/80 border border-zinc-700/50 text-white placeholder:text-zinc-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500/50 transition-all"
              />
            </div>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="flex-1 bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 space-y-3 pb-6">
              {!isOnline ? (
                <EmptyState
                  icon={<WifiOff size={28} className="text-zinc-400" />}
                  title="Sem conexão"
                  description="Verifique a sua ligação à internet"
                />
              ) : isFetching ? (
                <>
                  <SkeletonsDemo />
                  <SkeletonsDemo />
                  <SkeletonsDemo />
                </>
              ) : filtered && filtered.length > 0 ? (
                <AnimatePresence mode="popLayout">
                  {filtered.map((order: any, i: number) => (
                    <OrderCard
                      key={order.id}
                      order={order}
                      index={i}
                      isPending={isPending}
                      loadingId={loadingId}
                      onInteressar={(id: number) => {
                        setLoadingId(id);
                        interessar({ pedidoId: id });
                      }}
                    />
                  ))}
                </AnimatePresence>
              ) : (
                <EmptyState
                  icon={<Search size={28} className="text-zinc-400" />}
                  title="Nenhum serviço encontrado"
                  description={search ? "Tente outro filtro de busca" : "Tente expandir o raio de busca"}
                />
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── EmptyState ───────────────────────────────────────────────────────────────

function EmptyState({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
      <div className="p-4 rounded-2xl bg-zinc-100 dark:bg-zinc-900">{icon}</div>
      <div>
        <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{title}</p>
        <p className="text-xs text-zinc-400 font-medium mt-0.5">{description}</p>
      </div>
    </div>
  );
}

// ─── OrderCard ────────────────────────────────────────────────────────────────

function OrderCard({
  order,
  index,
  loadingId,
  onInteressar,
  isPending,
}: {
  order: any;
  index: number;
  loadingId: number | null;
  onInteressar: (id: number) => void;
  isPending: boolean;
}) {
  const isLoading = isPending && loadingId === order.id;

  const formattedDate = order.created_at
    ? formatDistanceToNow(new Date(order.created_at), { addSuffix: true, locale: pt })
    : "Agora";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, delay: index * 0.04 }}
      className="p-4 rounded-2xl border border-zinc-200/70 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/60 hover:border-orange-200 dark:hover:border-orange-900/50 hover:shadow-md transition-all duration-200"
    >
      {/* Top row */}
      <div className="flex gap-3 items-start mb-4">
        <Avatar className="h-12 w-12 rounded-2xl ring-2 ring-zinc-200 dark:ring-zinc-800 flex-shrink-0">
          <AvatarImage
            src={
              order.image_path
                ? `${api.defaults.baseURL}/uploads/${order.image_path}`
                : undefined
            }
            className="object-cover"
          />
          <AvatarFallback className="rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white font-black text-sm">
            {order.title?.slice(0, 2).toUpperCase() ?? "??"}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-2 leading-snug">
              {order.title}
            </h3>
            <div className="flex items-center gap-1 text-[9px] font-black text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded-full flex-shrink-0">
              <Clock size={9} />
              {formattedDate}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 text-[10px] font-semibold text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              <MapPin size={10} className="text-orange-500" />
              {order.location || "Luanda"}
            </span>
            {order.dono?.nome && (
              <>
                <span className="text-zinc-300 dark:text-zinc-700">·</span>
                <span className="flex items-center gap-1">
                  <User size={10} />
                  {order.dono.nome.split(" ")[0]}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={() => onInteressar(order.id)}
        disabled={isLoading}
        className="w-full h-11 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 hover:bg-orange-500 dark:hover:bg-orange-500 dark:hover:text-white text-[11px] font-black uppercase tracking-wider transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm hover:shadow-md hover:shadow-orange-500/20"
      >
        {isLoading ? (
          <>
            <Loader2 size={14} className="animate-spin" />
            Processando...
          </>
        ) : (
          "Candidatar-me"
        )}
      </button>
    </motion.div>
  );
}