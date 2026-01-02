import { useState, useEffect } from "react";
import { Bell, Sparkles, LayoutList, BellOff } from "lucide-react";
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

export function NotificationDropdownCostumer({ notificacoes, _count, id }: Usuario) {
  // Estados locais para feedback instantâneo na UI
  const [unreadCount, setUnreadCount] = useState<number>(_count?.notificacoes || 0);
  const [list, setList] = useState<Notificacao[]>(notificacoes || []);

  const { refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: GetUserProfile,
    staleTime: 0,
  });

  // 1. GERENCIAMENTO DE SOCKET (Real-time)
  useEffect(() => {
    if (!id) return;

    // Registrar usuário no socket
    socket.emit("register", id);

    // Ouvir novas notificações
    socket.on("user", (newNotif: Notificacao) => {
      setUnreadCount((prev) => prev + 1);
      setList((prev) => [newNotif, ...prev]);
      
      // Feedback tátil para mobile
      if ("vibrate" in navigator) navigator.vibrate(80);
      
      // Sincroniza dados do perfil em background
      refetch();
    });

    return () => {
      socket.off("user");
    };
  }, [id, refetch]);

  // 2. LÓGICA DE VISUALIZAÇÃO (Badge desaparece aqui)
  const handleOpenChange = async (open: boolean) => {
    // Corrige o bug de "pointer-events" do Radix UI no fechamento
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = "auto";
      }, 100);
      return;
    }

    // Ao abrir, se houver notificações não lidas:
    if (open && unreadCount > 0) {
      // Passo 1: Feedback Visual Imediato (Zerar Badge)
      setUnreadCount(0);
      
      try {
        // Passo 2: Sincronizar com o Servidor
        await api.patch("/notifications/mark-as-seen");
        
        // Passo 3: Atualizar lista local para remover estilos de "não lido"
        setList((prev) => prev.map((n) => ({ ...n, seen: true })));
      } catch (error) {
        console.error("Erro ao marcar notificações como vistas:", error);
      }
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative rounded-full h-12 w-12 flex items-center justify-center bg-zinc-100/50 dark:bg-zinc-900/50 hover:bg-orange-500/10 transition-all border-none focus-visible:ring-0 active:scale-90"
        >
          {/* O ícone muda de estilo baseado no estado das notificações */}
          <Bell 
            className={`h-5 w-5 transition-all duration-300 ${
              unreadCount > 0 
                ? "text-orange-500 fill-orange-500/20 scale-110" 
                : "text-zinc-500"
            }`} 
          />
          
          <AnimatePresence>
            {unreadCount > 0 && (
              <motion.span
                key="notification-badge"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-950 shadow-sm shadow-red-500/20"
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
        className="w-[90vw] sm:w-[380px] rounded-[2.5rem] p-0 overflow-hidden bg-white/95 dark:bg-zinc-950/95 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 shadow-2xl z-[999]"
      >
        {/* HEADER DO DROPDOWN */}
        <div className="p-5 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/50">
          <DropdownMenuLabel className="p-0 font-black text-sm uppercase tracking-tighter flex items-center gap-2">
            Notificações 
            <div className="flex items-center gap-1 bg-orange-500/10 px-2 py-0.5 rounded-full">
                <Sparkles className="h-3 w-3 text-orange-600" />
                <span className="text-[9px] text-orange-600">Novidades</span>
            </div>
          </DropdownMenuLabel>
        </div>
        
        <DropdownMenuSeparator className="m-0 opacity-50" />
        
        {/* CORPO DO DROPDOWN */}
        <ScrollArea className="h-[350px] sm:h-[400px]">
          {list.length > 0 ? (
            <div className="py-2">
               <NotificationMenuCostumer notif={list} />
            </div>
          ) : (
            <div className="h-[300px] flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 rounded-full bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-4">
                <BellOff className="h-8 w-8 text-zinc-300 dark:text-zinc-700" />
              </div>
              <p className="text-zinc-500 font-bold text-sm">Tudo limpo por aqui!</p>
              <p className="text-zinc-400 text-xs mt-1">Você não tem novas notificações no momento.</p>
            </div>
          )}
        </ScrollArea>

        <DropdownMenuSeparator className="m-0 opacity-50" />

        {/* FOOTER DO DROPDOWN */}
        <div className="p-3 bg-zinc-50/50 dark:bg-zinc-900/50">
          <Link to='/notif-costumer' className="block">
            <Button 
              variant="ghost" 
              className="w-full h-12 justify-center gap-2 text-zinc-500 hover:text-orange-600 font-black text-[10px] uppercase tracking-widest transition-all rounded-2xl"
            >
              <LayoutList className="h-4 w-4" />
              Ver Histórico Completo
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}