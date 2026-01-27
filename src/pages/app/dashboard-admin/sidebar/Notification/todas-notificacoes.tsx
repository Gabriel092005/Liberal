import { GetUserProfile } from "@/api/get-profile"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { api } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { formatDistanceToNow } from "date-fns"
import { pt } from "date-fns/locale"
import { AnimatePresence, motion } from "framer-motion"
import { Bell, Check, ChevronLeft, Inbox } from "lucide-react"
import { Link } from "react-router-dom"

export function NotificacoesMobile() {
  const { data: user, isLoading, isFetching } = useQuery({
    queryKey: ["user-profile"],
    queryFn: GetUserProfile
  })

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-white dark:bg-zinc-950 z-[100] flex flex-col items-center p-6 space-y-4">
        <Skeleton className="h-10 w-32 rounded-full mb-8" />
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full max-w-md rounded-[2rem]" />
        ))}
      </div>
    )
  }

  const notificacoes = user?.notificacoes || []

  return (
    <div className="fixed inset-0 bg-zinc-100/50 dark:bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-0 sm:p-4">
      <motion.div
        // Container que se adapta: 100% no mobile, Card centralizado no Desktop
        className="w-full h-full max-w-md sm:h-[85vh] bg-white dark:bg-zinc-950 sm:rounded-[3rem] shadow-2xl overflow-hidden flex flex-col relative border-x border-zinc-100 dark:border-zinc-900"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 100 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
      >
        {/* Barra superior estilo iOS */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full hidden sm:block" />

        <header className="pt-[calc(env(safe-area-inset-top)+1.5rem)] px-6 pb-6 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-zinc-950/90 backdrop-blur-xl z-20">
          <div className="flex flex-col">
            <h2 className="font-black text-3xl tracking-tight text-zinc-900 dark:text-zinc-50">
              Inbox
            </h2>
            <div className="flex items-center gap-1.5 mt-1">
              <div className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)] animate-pulse" />
              <p className="text-[11px] uppercase tracking-widest font-black text-zinc-400">
                {notificacoes.filter((n: any) => !n.AlreadySeen).length} Novas Mensagens
              </p>
            </div>
          </div>

          <Link to='/servicos'>
          <Button
            variant="link"
            size="icon"
            className={`rounded-2xl bg-zinc-100 dark:bg-zinc-900 h-12 w-12 ${isFetching ? 'animate-spin' : 'active:scale-90 transition-transform'}`}
          >
            <ChevronLeft></ChevronLeft>
          </Button>
          
          </Link>
       
        </header>

        <ScrollArea className="flex-1 px-4">
          <div className="pb-32 sm:pb-12 mt-2">
            <AnimatePresence mode="popLayout">
              {notificacoes.length === 0 ? (
                <motion.div
                  key="empty"
                  className="flex flex-col items-center justify-center py-20 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="w-24 h-24 bg-zinc-50 dark:bg-zinc-900/50 rounded-[2.5rem] flex items-center justify-center mb-6 shadow-inner">
                    <Inbox className="w-12 h-12 text-zinc-300" />
                  </div>
                  <h3 className="text-zinc-900 dark:text-zinc-100 font-black text-xl">Nada por aqui</h3>
                  <p className="text-sm text-zinc-500 max-w-[220px] mt-2 font-medium">
                    Sua caixa de entrada está limpa e organizada.
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {notificacoes.map((n: any, i: number) => (
                    <motion.div
                      key={n.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Card
                        className={`group border-none transition-all cursor-pointer rounded-[2.2rem] ${
                          n.AlreadySeen
                            ? "bg-transparent opacity-70"
                            : "bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/40 dark:shadow-none ring-1 ring-zinc-100 dark:ring-zinc-800"
                        }`}
                      >
                        <div className="p-5 flex gap-4 items-center">
                          <div className="relative shrink-0">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                              {n.image ? (
                                <img
                                  src={`${api.defaults.baseURL}/uploads/${n.image}`}
                                  className="w-full h-full object-cover"
                                  alt=""
                                />
                              ) : (
                                <Bell className="w-7 h-7 text-orange-500" />
                              )}
                            </div>
                            {!n.AlreadySeen && (
                              <span className="absolute -top-1 -right-1 h-4 w-4 bg-orange-500 border-2 border-white dark:border-zinc-950 rounded-full" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <h4 className={`text-[14px] leading-tight mb-1 ${
                              n.AlreadySeen ? "text-zinc-500 font-medium" : "text-zinc-900 dark:text-zinc-50 font-black"
                            }`}>
                              {n.content}
                            </h4>
                            <div className="flex items-center gap-3">
                              <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-tighter">
                                {formatDistanceToNow(new Date(n.created_at), {
                                  addSuffix: true,
                                  locale: pt
                                })}
                              </span>
                              {n.AlreadySeen && (
                                <div className="flex items-center gap-1 text-emerald-500/80">
                                  <Check className="w-3 h-3" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">Vista</span>
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
          </div>
        </ScrollArea>

        {/* Botão flutuante para fechar ou ação extra (Estilo Mobile) */}
      </motion.div>
    </div>
  )
}