// NotificationDropdownCostumer.tsx
import { useState, useEffect } from "react";
import { Bell, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuLabel,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Usuario } from "@/api/get-profile";
import { api } from "@/lib/axios";
import { socket } from "@/lib/socket"; // <-- Importe seu socket aqui
import { NotificationMenuCostumer } from "./notif-costumer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AnimatePresence, motion } from "framer-motion";

export function NotificationDropdownCostumer({ notificacoes, _count }: Usuario) {
  const [unreadCount, setUnreadCount] = useState<number>(_count.notificacoes);

  // Lógica de Socket.io para tempo real
  useEffect(() => {
    socket.on("new_notification", () => {
      setUnreadCount(prev => prev + 1);
    });
    return () => { socket.off("new_notification"); };
  }, []);

  async function handleOpenMenu(open: boolean) {
    if (open && unreadCount > 0) {
      setUnreadCount(0);
      try {
        await api.patch("/notifications/mark-as-seen");
      } catch (error) {
        console.error("Erro:", error);
      }
    }
  }

  return (
    <DropdownMenu onOpenChange={handleOpenMenu}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative rounded-full h-11 w-11 flex items-center justify-center bg-zinc-100/50 dark:bg-zinc-900/50 border border-transparent hover:border-orange-500/20 transition-all"
        >
          <Bell className={`h-5 w-5 ${unreadCount > 0 ? "text-orange-500 fill-orange-500/10" : "text-zinc-500"}`} />
          
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-950 shadow-sm"
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
        onCloseAutoFocus={(e) => e.preventDefault()} // <-- CORRIGE O TRAVAMENTO DA TELA
        className="w-80 sm:w-[350px] rounded-[1.5rem] p-0 overflow-hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 shadow-2xl"
      >
        <div className="p-4 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <DropdownMenuLabel className="p-0 font-bold text-sm flex items-center gap-2">
            Notificações <Sparkles className="h-3 w-3 text-orange-500" />
          </DropdownMenuLabel>
        </div>
        <DropdownMenuSeparator className="m-0" />
        
        <ScrollArea className="max-h-[400px]">
          <div className="p-2">
            <NotificationMenuCostumer notif={notificacoes} />
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}