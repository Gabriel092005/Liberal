import { useState, useCallback, useEffect } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { NotificationMenu } from "./Notification-Content";
import { Usuario } from "@/api/get-profile";
import { api } from "@/lib/axios";

export function NotificationDropdown({ notificacoes, _count }: Usuario) {

  const [unreadCount, setUnreadCount] = useState<number>(_count?.notificacoes || 0);

  // SINCRONIZAÇÃO EM TEMPO REAL:
  // Sempre que o _count vindo das props (do cache do React Query/API) mudar, 
  // ele atualiza o estado interno do badge.
  useEffect(() => {
    if (_count?.notificacoes !== undefined) {
      setUnreadCount(_count.notificacoes);
    }
  }, [_count?.notificacoes]);

  const handleOpenMenu = useCallback(async () => {
    if (unreadCount === 0) return;

    // "Optimistic Update": Zera o badge visualmente na hora do clique
    setUnreadCount(0);

    try {
      await api.patch("/notifications/mark-as-seen");
      
      // DICA: Se você usa React Query, o ideal aqui seria dar um 
      // queryClient.invalidateQueries(['profile']) para o back-end confirmar o zero.
    } catch (error) {
      console.error("Erro ao marcar como lidas:", error);
      // Se falhar, volta o valor original
      setUnreadCount(_count?.notificacoes || 0);
    }
  }, [unreadCount, _count?.notificacoes]);

  return (
    <DropdownMenu onOpenChange={(open) => open && handleOpenMenu()}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`
            relative rounded-2xl h-11 w-11 flex items-center justify-center 
            transition-all duration-300 group
            bg-zinc-100/50 dark:bg-zinc-800/40 
            hover:bg-orange-500/10 dark:hover:bg-orange-500/20
            border border-transparent hover:border-orange-500/20
            active:scale-90
          `}
        >
          {/* Ícone com animação de balanço sutil */}
          <motion.div
            animate={unreadCount > 0 ? {
              rotate: [0, -10, 10, -10, 10, 0],
              scale: [1, 1.1, 1],
            } : {}}
            transition={{
              repeat: Infinity,
              duration: 1.5,
              repeatDelay: 4
            }}
          >
            <Bell 
              className={`h-[1.3rem] w-[1.3rem] transition-all duration-500 ${
                unreadCount > 0 
                  ? "text-orange-500 fill-orange-500/20 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]" 
                  : "text-zinc-500 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100"
              }`} 
            />
          </motion.div>

          {/* Badge Minimalista de Alta Definição */}
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.div
                initial={{ scale: 0, y: 5 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0, y: 5 }}
                className="absolute -top-1 -right-1 z-10"
              >
                <div className="relative flex items-center justify-center">
                  {/* Glow de fundo */}
                  <span className="absolute inset-0 rounded-full bg-red-500/40 animate-pulse blur-[4px]" />
                  
                  {/* Badge Principal */}
                  <span className="
                    relative flex items-center justify-center
                    min-w-[1.1rem] h-[1.1rem] px-1
                    bg-gradient-to-tr from-red-600 to-red-500 
                    text-white text-[9px] font-black leading-none
                    rounded-full border-[1.5px] border-white dark:border-zinc-950
                    shadow-[0_2px_4px_rgba(0,0,0,0.2)]
                  ">
                    {unreadCount > 9 ? "9+" : unreadCount}
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </Button>
      </DropdownMenuTrigger>

      {/* Menu com animação e estilo Glass */}
      <NotificationMenu notif={notificacoes} />
    </DropdownMenu>
  );
}