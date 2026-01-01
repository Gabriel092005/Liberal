import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/axios";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, BellOff } from "lucide-react";
import { useCallback, useState } from "react";
import { NotificationMenuCostumer } from "./notif-costumer";

interface NotificationProps {
  notificacoes?: any[];
  _count?: {
    notificacoes: number;
  };
}

export function NotificationDropdownCostumer({ 
  notificacoes = [], 
  _count 
}: NotificationProps) {
  const [unreadCount, setUnreadCount] = useState<number>(_count?.notificacoes || 0);

  const handleOpenChange = useCallback(async (open: boolean) => {
    if (open && unreadCount > 0) {
      setUnreadCount(0);
      try {
        await api.patch("/notifications/mark-as-seen");
      } catch (error) {
        console.error("Erro ao atualizar status:", error);
      }
    }
  }, [unreadCount]);

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-2xl h-12 w-12 flex items-center justify-center bg-zinc-100/50 dark:bg-zinc-900/50 hover:bg-orange-500/10 border border-transparent hover:border-orange-500/20 active:scale-95 transition-all"
        >
          <motion.div
            animate={unreadCount > 0 ? { rotate: [0, -15, 15, -15, 15, 0] } : {}}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 2 }}
          >
            <Bell className={`h-6 w-6 ${unreadCount > 0 ? "text-orange-500 fill-orange-500/10" : "text-zinc-500"}`} />
          </motion.div>

          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute top-2 right-2"
              >
                <span className="relative flex h-4 w-4">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative flex items-center justify-center rounded-full h-4 w-4 bg-red-600 text-[9px] font-bold text-white border-2 border-white dark:border-zinc-900">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        sideOffset={12}
        // Removemos o padding extra para que o conteúdo encoste nas bordas se necessário
        className="w-80 sm:w-96 rounded-[1.5rem] p-0 overflow-hidden bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800 shadow-2xl"
      >
        <div className="p-4 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-100 dark:border-zinc-800/50">
          <DropdownMenuLabel className="p-0 font-black uppercase tracking-widest text-[10px] text-zinc-500">
            Notificações
          </DropdownMenuLabel>
          {unreadCount === 0 && (
            <span className="text-[10px] font-bold text-green-500 uppercase">Tudo lido</span>
          )}
        </div>
        
        {/* ScrollArea sem bordas internas */}
        <ScrollArea className="flex flex-col max-h-[400px]">
          <div className="flex flex-col">
            {notificacoes && notificacoes.length > 0 ? (
              <NotificationMenuCostumer notif={notificacoes} />
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center opacity-40">
                <BellOff size={32} className="mb-2" />
                <p className="text-[10px] font-bold uppercase tracking-widest">Vazio</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}