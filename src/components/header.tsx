"use client";

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from './ui/avatar';
import { ModeToggle } from './theme/theme-toggle';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { GetUserProfile } from "@/api/get-profile";
import { Skeleton } from "./ui/skeleton";
import { getInialts } from "@/lib/utils";
import { NotificationDropdown } from "@/pages/app/dashboard-admin/sidebar/Notification/notification-dropdown";
import { Handshake, Menu, X } from "lucide-react";
import { DropdownMenu, DropdownMenuTrigger } from "./ui/dropdown-menu";

const NAV_ITEMS = [
  { label: "Início",      path: "/início" },
  { label: "Clientes",    path: "/clientes" },
  { label: "Serviços",    path: "/serviços" },
  { label: "Pedidos",     path: "/pedidos" },
];

export function Header() {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile"],
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 0,
    queryFn: GetUserProfile,
  });

  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });
  const [mobileOpen, setMobileOpen] = useState(false);

  // Underline animado no desktop
  useEffect(() => {
    const ref = navRefs.current[activeIndex];
    if (ref) setUnderlineStyle({ left: ref.offsetLeft, width: ref.offsetWidth });
  }, [activeIndex]);

  // Sincroniza com a rota actual
  useEffect(() => {
    const idx = NAV_ITEMS.findIndex((item) =>
      location.pathname.toLowerCase().includes(item.path.toLowerCase())
    );
    if (idx !== -1) setActiveIndex(idx);
  }, [location.pathname]);

  // Fecha menu mobile ao mudar de rota
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <>
      <header className="w-full fixed top-0 left-0 right-0 z-50 bg-white dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto px-4 py-3">

          {/* ── Logo ── */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-500 to-orange-400 shadow-md shadow-orange-500/25">
              <Handshake className="text-white" size={20} />
            </div>
            <span className="font-black text-lg bg-gradient-to-r from-orange-500 to-orange-400 bg-clip-text text-transparent tracking-tight">
              Liberal
            </span>
          </Link>

          {/* ── Nav desktop (md+) ── */}
          <nav className="relative hidden md:flex gap-6">
            {NAV_ITEMS.map((item, i) => (
              <Link
                key={item.label}
                to={item.path}
                ref={(el) => (navRefs.current[i] = el)}
                onClick={() => setActiveIndex(i)}
                className={`relative text-sm font-semibold transition-colors pb-1 ${
                  activeIndex === i
                    ? "text-orange-500 dark:text-orange-400"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <motion.span
              className="absolute -bottom-[13px] h-0.5 bg-orange-500 rounded-full"
              animate={{ left: underlineStyle.left, width: underlineStyle.width }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </nav>

          {/* ── Direita: avatar + notifs + tema + hamburger ── */}
          <div className="flex items-center gap-2 sm:gap-3">

            {/* Avatar + nome (só desktop) */}
            <div className="hidden sm:flex items-center gap-2.5">
              <Avatar className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 ring-2 ring-orange-200 dark:ring-orange-900">
                <AvatarFallback className="rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xs font-black">
                  {getInialts(profile?.nome ?? "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col leading-none">
                {isLoading ? (
                  <div className="space-y-1">
                    <Skeleton className="w-20 h-3 rounded-md" />
                    <Skeleton className="w-14 h-3 rounded-md" />
                  </div>
                ) : (
                  <>
                    <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate max-w-[120px]">
                      {profile?.nome}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-medium lowercase truncate max-w-[120px]">
                      @{profile?.role}
                    </span>
                  </>
                )}
              </div>
            </div>

            <Separator orientation="vertical" className="hidden sm:block h-6" />

            {/* Notificações */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon"
                  className="relative h-9 w-9 rounded-xl hover:bg-orange-50 dark:hover:bg-zinc-800 transition-colors">
                  {/* ícone de sino pode ser adicionado aqui */}
                </Button>
              </DropdownMenuTrigger>
              {profile && <NotificationDropdown {...profile} />}
            </DropdownMenu>

            <ModeToggle />

            {/* Hamburger — só mobile */}
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="md:hidden h-9 w-9 rounded-xl flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
            >
              {mobileOpen
                ? <X size={18} className="text-zinc-700 dark:text-zinc-300" />
                : <Menu size={18} className="text-zinc-700 dark:text-zinc-300" />
              }
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile menu drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="fixed top-[65px] left-4 right-4 z-50 md:hidden rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden"
            >
              {/* Perfil no topo do drawer */}
              <div className="px-4 py-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 ring-2 ring-orange-200 dark:ring-orange-900">
                  <AvatarFallback className="rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xs font-black">
                    {getInialts(profile?.nome ?? "")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col leading-none min-w-0">
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 truncate">
                    {profile?.nome ?? "—"}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-medium lowercase truncate">
                    @{profile?.role ?? "—"}
                  </span>
                </div>
              </div>

              {/* Links */}
              <nav className="p-2">
                {NAV_ITEMS.map((item, i) => {
                  const isActive = activeIndex === i;
                  return (
                    <Link
                      key={item.label}
                      to={item.path}
                      onClick={() => { setActiveIndex(i); setMobileOpen(false); }}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-colors ${
                        isActive
                          ? "bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400"
                          : "text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                      }`}
                    >
                      {isActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                      )}
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}