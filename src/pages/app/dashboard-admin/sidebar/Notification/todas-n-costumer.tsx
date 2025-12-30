import { useQuery } from "@tanstack/react-query";
import { Bell, Clock, AlertCircle, RefreshCw, Inbox, CheckCheck, Circle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { pt } from "date-fns/locale";
import { GetUserProfile } from "@/api/get-profile";
import { api } from "@/lib/axios";
import { useState } from "react";

export function NotificacoesMobileCostumer() {
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const { data: user, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["user-profile"],
    queryFn: GetUserProfile,
  });

  const notificacoesRaw = user?.notificacoes || [];
  const notificacoes = filter === "all" 
    ? notificacoesRaw 
    : notificacoesRaw.filter((n: any) => !n.AlreadySeen);

  const unreadCount = notificacoesRaw.filter((n: any) => !n.AlreadySeen).length;

  if (isLoading) {
    return (
      <div className="p-6 space-y-4 bg-white dark:bg-neutral-950 h-screen">
        <Skeleton className="h-10 w-40" />
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] p-8 text-center space-y-4">
        <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-full">
          <AlertCircle className="text-red-500 w-10 h-10" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-lg">Ops! Algo deu errado</h3>
          <p className="text-sm text-muted-foreground">Não conseguimos sintonizar suas notificações.</p>
        </div>
        <Button onClick={() => refetch()} variant="outline" className="rounded-full px-8">
          Tentar novamente
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      className="w-full max-w-md mx-auto bg-slate-50/50 dark:bg-neutral-950 flex flex-col h-screen overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header Estilizado */}
      <header className="p-6 pb-4 space-y-4 bg-white dark:bg-neutral-900 border-b dark:border-neutral-800 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Bell className="text-orange-500 w-7 h-7" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-orange-500"></span>
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black tracking-tight text-neutral-800 dark:text-neutral-100">
              Inbox
            </h1>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => refetch()}
            className={`rounded-full transition-transform ${isFetching ? 'animate-spin' : ''}`}
          >
            <RefreshCw className="w-5 h-5 text-neutral-500" />
          </Button>
        </div>

        {/* Filtros de Categoria */}
        <div className="flex gap-2">
          <Button 
            onClick={() => setFilter("all")}
            variant={filter === "all" ? "default" : "secondary"}
            className="rounded-full h-8 text-xs font-bold px-4"
          >
            Todas
          </Button>
          <Button 
            onClick={() => setFilter("unread")}
            variant={filter === "unread" ? "default" : "secondary"}
            className="rounded-full h-8 text-xs font-bold px-4 gap-2"
          >
            Não lidas
            {unreadCount > 0 && <Badge className="bg-orange-500 hover:bg-orange-500 text-[10px] h-4 px-1">{unreadCount}</Badge>}
          </Button>
        </div>
      </header>

      {/* Lista de notificações */}
      <ScrollArea className="flex-1 px-4 pt-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {notificacoes.length === 0 ? (
            <motion.div
              key="empty"
              className="flex flex-col items-center justify-center py-20 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                <Inbox className="w-10 h-10 text-neutral-300 dark:text-neutral-600" />
              </div>
              <h3 className="font-bold text-neutral-700 dark:text-neutral-300">Tudo limpo por aqui!</h3>
              <p className="text-sm text-neutral-500 max-w-[200px] mt-1">
                {filter === "all" ? "Você ainda não recebeu nenhuma notificação." : "Nenhuma notificação não lida."}
              </p>
            </motion.div>
          ) : (
            notificacoes.map((n: any, index: number) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="mb-3"
              >
                <div
                  className={`group relative flex gap-4 p-4 rounded-2xl border transition-all active:scale-[0.97] ${
                    n.AlreadySeen
                      ? "bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800"
                      : "bg-white dark:bg-neutral-900 border-orange-200 dark:border-orange-900/50 shadow-sm ring-1 ring-orange-500/10"
                  }`}
                >
                  {/* Status Indicator */}
                  {!n.AlreadySeen && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-orange-500 rounded-r-full" />
                  )}

                  {/* Icon/Image Avatar */}
                  <div className="relative shrink-0">
                    {n.image ? (
                      <img
                        src={`${api.defaults.baseURL}/uploads/${n.image}`}
                        alt=""
                        className="w-12 h-12 rounded-2xl object-cover shadow-sm border dark:border-neutral-700"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center">
                        <Bell className="w-6 h-6 text-orange-500" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <p className={`text-sm leading-tight transition-colors ${
                        n.AlreadySeen ? "text-neutral-600 dark:text-neutral-400" : "text-neutral-900 dark:text-neutral-100 font-semibold"
                      }`}>
                        {n.content}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                       <div className="flex items-center text-[10px] font-medium text-neutral-400 uppercase tracking-wider gap-1.5">
                        <Clock className="w-3 h-3" />
                        {formatDistanceToNow(new Date(n.created_at), {
                          addSuffix: true,
                          locale: pt
                        })}
                      </div>
                      
                      {!n.AlreadySeen && (
                         <Badge variant="outline" className="text-[9px] border-orange-500/20 text-orange-500 px-1.5 h-4">
                           Nova
                         </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
        <div className="h-20" /> {/* Spacer para o scroll não bater no final */}
      </ScrollArea>

      {/* Footer Discreto */}
      <footer className="p-4 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-t dark:border-neutral-800 text-center">
         <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-widest flex items-center justify-center gap-2">
           <CheckCheck size={12} className="text-orange-500" />
           Liberal Angola Notificações
         </p>
      </footer>
    </motion.div>
  );
}