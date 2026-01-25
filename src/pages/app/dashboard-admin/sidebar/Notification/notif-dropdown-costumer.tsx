import { Notificacao, Usuario } from "@/api/get-profile";
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
import { socket } from "@/lib/socket";
import { useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { Bell, BellOff, LayoutList, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { NotificationMenuCostumer } from "./notif-costumer";

export function NotificationDropdownCostumer({ notificacoes, _count, id }: Usuario) {
  const queryClient = useQueryClient();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Estados locais sincronizados com as props iniciais
  const [unreadCount, setUnreadCount] = useState<number>(_count?.notificacoes || 0);
  const [list, setList] = useState<Notificacao[]>(notificacoes || []);

  // Sincroniza estados locais quando as props vindas do pai (Home) mudarem
  useEffect(() => {
    setUnreadCount(_count?.notificacoes || 0);
  }, [_count?.notificacoes]);

  useEffect(() => {
    setList(notificacoes || []);
  }, [notificacoes]);

  // 1. GERENCIAMENTO DE SOCKET (Unificado e Protegido)
  useEffect(() => {
    if (!id) return;

    // Inicializa áudio apenas no cliente
    if (!audioRef.current) {
      audioRef.current = new Audio("/bell-98033.mp3");
      audioRef.current.volume = 0.5;
    }

    // Registro limpo
    socket.emit("register", id);
    console.log("🚀 [Socket] Registrado com sucesso - ID:", id);

    const handleNotification = (data: any) => {
      console.log("🔔 [Socket] Nova notificação recebida:", data);
      
      // Toca o som
      audioRef.current?.play().catch(() => {});

      // Se o backend envia a LISTA completa, atualizamos tudo
      if (Array.isArray(data)) {
        setList(data);
        setUnreadCount(data.filter(n => !n.seen).length);
      } else {
        // Se envia apenas o OBJETO da nova notificação
        setList((prev) => [data, ...prev]);
        setUnreadCount((prev) => prev + 1);
      }

      // Notifica o React Query que os dados de perfil mudaram globalmente
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    };

    socket.on("user", handleNotification);

    return () => {
      console.log("🧹 [Socket] Limpando listener para evitar duplicidade");
      socket.off("user", handleNotification);
    };
  }, [id, queryClient]);
  console.log(list)

  // 2. LÓGICA AO ABRIR O MENU (Marcar como visto)
  const handleOpenChange = async (open: boolean) => {
    if (open && unreadCount > 0) {
      // Optimistic UI: zera o contador na hora
      const previousCount = unreadCount;
      setUnreadCount(0);
      
      try {
        await api.patch("/notifications/mark-as-seen");
        setList((prev) => prev.map((n) => ({ ...n, seen: true })));
        queryClient.invalidateQueries({ queryKey: ["profile"] });
      } catch (error) {
        console.error("Falha ao sincronizar leitura:", error);
        setUnreadCount(previousCount); // Reverte em caso de erro
      }
    }

    // Fix para o bug de scroll do Radix/Shadcn
    if (!open) {
      setTimeout(() => { document.body.style.pointerEvents = "auto"; }, 100);
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative rounded-full h-12 w-12 flex items-center justify-center bg-zinc-100/50 dark:bg-zinc-900/50 hover:bg-orange-500/10 transition-all border-none focus-visible:ring-0 active:scale-90"
        >
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
                key={unreadCount} // Força animação a cada novo número
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                className="absolute top-1.5 right-1.5 bg-red-600 text-white text-[10px] font-black h-5 w-5 flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-950 shadow-sm"
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
            </div>
          )}
        </ScrollArea>

        <DropdownMenuSeparator className="m-0 opacity-50" />

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