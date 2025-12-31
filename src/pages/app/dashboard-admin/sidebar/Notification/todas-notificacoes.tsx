import { useQuery } from "@tanstack/react-query"
import { Bell,  RefreshCw, Inbox, Check } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { formatDistanceToNow } from "date-fns"
import { pt } from "date-fns/locale"
import { GetUserProfile } from "@/api/get-profile"
import { api } from "@/lib/axios"

export function NotificacoesMobile() {
  const { data: user, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["user-profile"],
    queryFn: GetUserProfile
  })

  // Skeleton otimizado para preencher a tela mobile
  if (isLoading) {
    return (
      <div className="p-4 space-y-4 w-full max-w-md mx-auto">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-[1.5rem]" />
        ))}
      </div>
    )
  }

  const notificacoes = user?.notificacoes || []

  return (
    <motion.div
      // h-[100dvh] usa a unidade dinâmica para evitar bugs de scroll no Safari/Chrome mobile
      // pb-[safe-area-inset-bottom] protege contra a barra de gestos do iOS
      className="w-full max-w-md mx-auto bg-white dark:bg-zinc-950 flex flex-col h-[100dvh] sm:h-[85vh] sm:rounded-[2.5rem] sm:shadow-2xl overflow-hidden border-x border-zinc-100 dark:border-zinc-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* Header com padding-top para Safe Area (Notch) */}
      <header className="pt-[calc(env(safe-area-inset-top)+1rem)] px-6 pb-4 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg z-10">
        <div className="space-y-0.5">
          <h2 className="font-black text-2xl tracking-tight text-zinc-900 dark:text-zinc-50">
            Inbox
          </h2>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
            <p className="text-[10px] uppercase tracking-[0.15em] font-bold text-zinc-500">
              {notificacoes.filter((n: any) => !n.AlreadySeen).length} Pendentes
            </p>
          </div>
        </div>
        
        <Button 
          variant="secondary" 
          size="icon" 
          onClick={() => refetch()}
          className={`rounded-full h-10 w-10 shrink-0 ${isFetching ? 'animate-spin' : 'active:scale-90 transition-transform'}`}
        >
          <RefreshCw className="w-5 h-5 text-zinc-500" />
        </Button>
      </header>

      {/* Área de Notificações */}
      <ScrollArea className="flex-1 px-4">
        <AnimatePresence mode="popLayout" initial={false}>
          {notificacoes.length === 0 ? (
            <motion.div
              key="empty"
              className="flex flex-col items-center justify-center h-[60vh] text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-20 h-20 bg-zinc-100 dark:bg-zinc-900 rounded-3xl flex items-center justify-center mb-4 rotate-12">
                <Inbox className="w-10 h-10 text-zinc-400" />
              </div>
              <h3 className="text-zinc-900 dark:text-zinc-100 font-bold">Inbox Vazio</h3>
              <p className="text-sm text-zinc-500 max-w-[200px] mt-1">
                Você está em dia com todas as suas atividades.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-3 pb-[env(safe-area-inset-bottom)] mt-2">
              {notificacoes.map((n: any, i: number) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2, delay: i * 0.03 }}
                >
                  <Card
                    className={`group relative border-none transition-all duration-200 active:scale-[0.98] rounded-[1.8rem] ${
                      n.AlreadySeen
                        ? "bg-zinc-50 dark:bg-zinc-900/40"
                        : "bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-none ring-1 ring-zinc-100 dark:ring-zinc-800"
                    }`}
                  >
                    <div className="p-4 flex gap-4 items-center">
                      {/* Avatar com Shape de App (iOS style) */}
                      <div className="relative shrink-0">
                        {n.image ? (
                          <img
                            src={`${api.defaults.baseURL}/uploads/${n.image}`}
                            alt=""
                            className="w-12 h-12 rounded-[1.1rem] object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-[1.1rem] bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center">
                            <Bell className="w-6 h-6 text-orange-500" />
                          </div>
                        )}
                        {!n.AlreadySeen && (
                          <div className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 border-2 border-white dark:border-zinc-900 rounded-full" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1">
                        <p className={`text-[13px] leading-tight line-clamp-2 ${
                          n.AlreadySeen ? "text-zinc-500" : "text-zinc-900 dark:text-zinc-100 font-semibold"
                        }`}>
                          {n.content}
                        </p>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-medium text-zinc-400">
                            {formatDistanceToNow(new Date(n.created_at), {
                              addSuffix: false,
                              locale: pt
                            })}
                          </span>
                          {n.AlreadySeen && (
                            <div className="flex items-center gap-0.5 text-zinc-300">
                               <Check className="w-3 h-3" />
                               <span className="text-[9px] font-bold uppercase tracking-tighter">Lida</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </ScrollArea>
    </motion.div>
  )
}