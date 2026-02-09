"use client";

import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback } from './ui/avatar';
import { ModeToggle } from './theme/theme-toggle';
import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { GetUserProfile } from "@/api/get-profile";
import { Skeleton } from "./ui/skeleton";
import { getInialts } from "@/lib/utils";
import { NotificationDropdown } from "@/pages/app/dashboard-admin/sidebar/Notification/notification-dropdown";
import { Handshake } from "lucide-react";

export function Header() {
      const { data: profile , isLoading} = useQuery({
            queryKey: ["profile"],
            refetchOnWindowFocus: true,     // Rebusca ao voltar ao foco
            refetchOnReconnect: true,       // Rebusca se a internet voltar
            refetchOnMount: true,           // Rebusca sempre que o componente monta
            staleTime: 0,    
            queryFn: GetUserProfile,
            });
    
  const navItems = ["Início", "Clientes", "Serviços", "@Pedidos"];
  const navRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [underlineStyle, setUnderlineStyle] = useState({ left: 0, width: 0 });

  // Atualiza underline quando o activeIndex muda
  useEffect(() => {
    const currentRef = navRefs.current[activeIndex];
    if (currentRef) {
      const { offsetLeft, offsetWidth } = currentRef;
      setUnderlineStyle({ left: offsetLeft, width: offsetWidth });
    }
  }, [activeIndex]);

  // Atualiza o activeIndex baseado na rota atual
  useEffect(() => {
    const currentIndex = navItems.findIndex((item) => {
      const path = `/${item.replace("@", "").toLowerCase()}`;
      return location.pathname.toLowerCase().includes(path);
    });
    if (currentIndex !== -1) setActiveIndex(currentIndex);
  }, [location.pathname]);

  if(!profile){
    return
  }

  return (
    <header className="w-full fixed top-0 left-0 right-0 px-4 py-3 border-b border-zinc-200  bg-white bg-white dark:bg-black  z-50">
      <div className="flex items-center justify-between w-full max-w-screen-xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-gradient-to-tr from-orange-500 to-orange-400 shadow-md">
            <Handshake className="text-white" size={22} />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-orange-600 to-yellow-500 bg-clip-text text-transparent">
            Liberal
          </span>
        </div>

        {/* Menu de navegação */}
        <nav className="relative hidden md:flex gap-6">
          {navItems.map((item, index) => (
            <Link
              key={item}
              to={`/${item.replace("", "").toLowerCase()}`}
              ref={(el) => (navRefs.current[index] = el)}
              onClick={() => setActiveIndex(index)} // garante que clique atualiza underline
              className={`relative font-medium text-gray-700 dark:text-gray-200 hover:text-orange-500 transition-colors ${
                activeIndex === index ? "text-orange-500 dark:text-orange-400" : ""
              }`}
            >
              {item}
            </Link>
          ))}

          {/* Underline animado */}
          <motion.span
            className="absolute bottom-0 h-0.5 bg-orange-500 rounded-full"
            animate={{ left: underlineStyle.left, width: underlineStyle.width }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </nav>

        {/* Avatar, notificações e modo */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Avatar className="bg-blue-800">
              <AvatarFallback>
                <strong>
                   {getInialts(profile?.nome)}
                </strong>
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col leading-none">
             {isLoading ? (
                 <div>
                    <Skeleton className="w-8 h-4"></Skeleton>
                    <Skeleton className="w-8 h-4"></Skeleton>
                 </div>
              ):(
                 <div className="flex flex-col">
                  <span>
                    {profile?.nome}
                  </span>
                  <span className="lowercase text-muted-foreground text-xs ">

                    @{profile?.role}
                  </span>
                 </div>
              )}
            </div>
          </div>

          <Separator orientation="vertical" className="h-6" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative rounded-full h-11 w-11 flex items-center justify-center hover:bg-orange-50 dark:bg-zinc-900 transition-colors"
              >
            
              </Button>
            </DropdownMenuTrigger>
             <NotificationDropdown {...profile} />
          </DropdownMenu>

          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
