import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { api } from "@/lib/axios";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, BellOff, CheckCheck, Sparkles } from "lucide-react";
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
    // Só dispara a API se houver algo para ler e o menu estiver abrindo
    if (open && unreadCount > 0) {
      setUnreadCount(0);
      try {
        await api.patch("/notifications/mark-as-seen");
      } catch (error) {
        console.error("Erro ao sincronizar notificações:", error);
      }
    }
  }, [unreadCount]);

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full h-12 w-12 flex items-center justify-center bg-white/10 dark:bg-zinc-900/50 backdrop-blur-md border border-zinc-200/50 dark:border-zinc-800/50 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all duration-500 group"
        >
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={unreadCount > 0 ? {
              rotate: [0, -10, 10, -10, 10, 0],
            } : {}}
            transition={{ repeat: Infinity, duration: 2, repeatDelay: 3 }}
          >
            <Bell 
              className={`h-5 w-5 transition-colors duration-300 ${
                unreadCount > 0 
                  ? "text-orange-500 fill-orange-500/20" 
                  : "text-zinc-500 group-hover:text-orange-500"
              }`} 
            />
          </motion.div>

          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute top-2.5 right-2.5 flex h-4 w-4"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                <span className="relative flex items-center justify-center rounded-full h-4 w-4 bg-orange-600 text-[9px] font-black text-white border border-white dark:border-zinc-900">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent 
        align="end" 
        sideOffset={15}
        // IMPORTANTE: Evita que o site fique desabilitado/travado ao fechar
        onCloseAutoFocus={(e) => e.preventDefault()}
        className="w-[380px] rounded-[2rem] p-0 overflow-hidden bg-white/80 dark:bg-zinc-950/90 backdrop-blur-2xl border-zinc-200/50 dark:border-zinc-800/50 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-[999]"
      >
        {/* Header Customizado */}
        <div className="relative p-5 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950/50">
          <div className="flex items-center justify-between">
            <div>
              <DropdownMenuLabel className="p-0 text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                Notificações 
                <Sparkles className="h-4 w-4 text-orange-500" />
              </DropdownMenuLabel>
              <p className="text-[11px] text-zinc-500 font-medium">
                {unreadCount > 0 ? `Tens ${unreadCount} novas mensagens` : "Estás atualizado!"}
              </p>
            </div>
            
            {unreadCount === 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
                <CheckCheck className="h-3.5 w-3.5 text-green-500" />
                <span className="text-[10px] font-bold text-green-600 uppercase tracking-tighter">Lido</span>
              </div>
            )}
          </div>
        </div>
        
        <DropdownMenuSeparator className="m-0 bg-zinc-200/50 dark:bg-zinc-800/50" />
        
        <ScrollArea className="h-[420px] bg-transparent">
          <div className="p-3">
            {notificacoes.length > 0 ? (
              <motion.div 
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <NotificationMenuCostumer notif={notificacoes} />
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="relative mb-4">
                   <div className="absolute inset-0 bg-orange-500/10 blur-2xl rounded-full" />
                   <BellOff size={48} className="text-zinc-300 dark:text-zinc-700 relative" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest">Silêncio total</h3>
                <p className="text-xs text-zinc-400 mt-1">Não há nada novo para mostrar.</p>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Footer elegante */}
        <div className="p-3 bg-zinc-50/50 dark:bg-zinc-900/30 border-t border-zinc-100 dark:border-zinc-800/50">
           <Button variant="ghost" className="w-full rounded-xl text-[11px] font-bold uppercase tracking-widest text-zinc-500 hover:text-orange-600 hover:bg-orange-50 transition-all">
             Ver histórico completo
           </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}