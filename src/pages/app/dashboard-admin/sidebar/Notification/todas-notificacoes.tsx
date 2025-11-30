import { useQuery } from "@tanstack/react-query"
import { Bell,  Clock, AlertCircle, RefreshCw, List } from "lucide-react"
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
  const { data: user, isLoading, isError, refetch } = useQuery({
    queryKey: ["user-profile"],
    queryFn: GetUserProfile
  })

  if (isLoading) {
    return (
      <div className="p-4 flex flex-col gap-3">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (isError ) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="text-red-500 w-8 h-8 mb-2" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Não foi possível carregar as notificações.
        </p>
        <Button onClick={() => refetch()} className="mt-3">
          Tentar novamente
        </Button>
      </div>
    )
  }

  const notificacoes = user?.notificacoes || []

  return (
    <motion.div
      className="w-full  max-w-md mx-auto bg-white dark:bg-neutral-900 relative right-[1rem] shadow-md rounded-2xl p-3 flex flex-col h-[90vh]"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <header className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell className="text-orange-500 w-6 h-6" />
          <h2 className="font-bold text-lg text-gray-800 dark:text-gray-100">
            Notificações
          </h2>
        </div>
        {notificacoes.length > 0 && (
            <RefreshCw   onClick={() => refetch()} className="text-muted-foreground"></RefreshCw>
        )}
      </header>

      {/* Lista de notificações */}
      <ScrollArea className="flex-1 pr-2">
        <AnimatePresence mode="popLayout">
          {notificacoes.length === 0 ? (
            <motion.div
              key="empty"
              className="flex flex-col items-center justify-center mt-10 text-center text-gray-500 dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <List className="w-20 h-20 text-muted-foreground mb-2" />
              <p>Você não possui novas notificações 🎉</p>
            </motion.div>
          ) : (
            notificacoes.map((n:any) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                layout
              >
                <Card
                  className={`flex gap-3  items-start p-3 mb-3 rounded-xl border ${
                    n.AlreadySeen
                      ? "border-neutral-200 dark:border-neutral-700 bg-transparent"
                      : "border-orange-500/40 bg-orange-50 dark:bg-orange-950/30"
                  }`}
                >
                  {n.image ? (
                    <img
                      src={`${api.defaults.baseURL}/uploads/${n.image}`}
                      alt="Imagem da notificação"
                      className="w-10 h-10 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                      <Bell className="w-5 h-5 text-orange-500" />
                    </div>
                  )}

                  <div className="flex flex-col flex-1">
                    <p className="text-sm text-gray-800 dark:text-gray-100 leading-snug">
                      {n.content}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 gap-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {formatDistanceToNow(new Date(n.created_at), {
                          addSuffix: true,
                          locale: pt
                        })}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </ScrollArea>
    </motion.div>
  )
}
