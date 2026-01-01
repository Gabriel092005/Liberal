import { useState, useEffect } from "react";
import { Bell, Sparkles, LayoutList } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Usuario, Notificacao, GetUserProfile } from "@/api/get-profile";
import { api } from "@/lib/axios";
import { socket } from "@/lib/socket"; 
import { NotificationMenuCostumer } from "./notif-costumer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

export function NotificationDropdownCostumer({ notificacoes, _count }: Usuario) {
  const [unreadCount, setUnreadCount] = useState<number>(_count.notificacoes);
  const [list, setList] = useState<Notificacao[]>(notificacoes);

    const { data: profile, refetch } = useQuery({
      queryKey: ["profile"],
      queryFn: GetUserProfile,
      refetchOnMount: true,
      staleTime: 0,
    });

  // Lógica de Socket.io em Tempo Real
  useEffect(() => {
    // Escuta evento genérico ou específico (ajuste 'user' se seu backend emitir outro nome)
    socket.on("user", (newNotif: Notificacao) => {
      setUnreadCount(prev => prev + 1);
      setList(prev => [newNotif, ...prev]);
      
      // Feedback tátil/sonoro opcional
      if ("vibrate" in navigator) navigator.vibrate(100);
    });

    return () => { socket.off("user"); };
  }, []);

  async function handleOpenChange(open: boolean) {
    // SOLUÇÃO PARA O TRAVAMENTO: Forçar desbloqueio do mouse ao fechar
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = "auto";
      }, 150);
      return;
    }

     useEffect(() => {
        if (!notificacoes) return;
        socket.emit("register", profile?.id);
        socket.on("user", () => {
          refetch();
        });
        return () => { socket.off("user"); };
      }, [profile, refetch]);
    // Se abrir e tiver notificações novas, marca como visto
    if (open && unreadCount > 0) {
      setUnreadCount(0);
      try {
        await api.patch("/notifications/mark-as-seen");
        // Opcional: atualizar 'seen' na lista local
        setList(prev => prev.map(n => ({ ...n, seen: true })));
      } catch (error) {
        console.error("Falha ao sincronizar notificações:", error);
      }
    }
  }

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative rounded-full h-11 w-11 flex items-center justify-center bg-zinc-100/50 dark:bg-zinc-900/50 hover:bg-orange-500/10 transition-all border-none focus-visible:ring-0"
        >
          <Bell className={`h-5 w-5 transition-all ${unreadCount > 0 ? "text-orange-500 fill-orange-500/10 scale-110" : "text-zinc-500"}`} />
          
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-950 shadow-lg"
              >
                {unreadCount > 9 ? "9+" : unreadCount}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        sideOffset={12}
        onCloseAutoFocus={(e) => {
          e.preventDefault();
          document.body.style.pointerEvents = "auto";
        }}
        className="w-80 sm:w-[380px] rounded-[2rem] p-0 overflow-hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 shadow-2xl z-[999]"
      >
        <div className="p-5 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <DropdownMenuLabel className="p-0 font-bold text-sm flex items-center gap-2">
            Notificações <Sparkles className="h-3.5 w-3.5 text-orange-500" />
          </DropdownMenuLabel>
        </div>
        
        <DropdownMenuSeparator className="m-0 opacity-50" />
        
        <ScrollArea className="h-[400px]">
          <NotificationMenuCostumer notif={list} />
        </ScrollArea>

        <DropdownMenuSeparator className="m-0 opacity-50" />

        <div className="p-3 bg-zinc-50/50 dark:bg-zinc-900/50">
          <Link to='/notif-costumer'>
            <Button variant="ghost" className="w-full justify-center gap-2 text-zinc-500 hover:text-orange-600 font-bold text-[10px] uppercase tracking-widest transition-all">
              <LayoutList className="h-4 w-4" />
              Ver tudo
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}