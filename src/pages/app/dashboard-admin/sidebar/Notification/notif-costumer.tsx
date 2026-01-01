import { Notificacao } from "@/api/get-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/axios";
import { formatNotificationDate } from "@/lib/utils";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { motion } from "framer-motion";
import { Bell, Clock, Inbox } from "lucide-react";

export function NotificationMenuCostumer({ notif }: { notif: Notificacao[] }) {
  const [parent] = useAutoAnimate();

  return (
    <div ref={parent} className="flex flex-col gap-1 p-2">
      {notif.length > 0 ? (
        notif.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group relative flex items-start gap-4 p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-zinc-100 dark:hover:border-white/10"
          >
            {/* Indicador visual de nova notificação */}
            {!n.AlreadySeen && (
              <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
            )}

            <Avatar className="h-10 w-10 border shadow-sm flex-shrink-0">
              {n.image ? (
                <AvatarImage src={`${api.defaults.baseURL}/uploads/${n.image}`} className="object-cover" />
              ) : (
                <AvatarFallback className="bg-orange-50 dark:bg-orange-950/20 text-orange-600">
                  <Bell className="h-4 w-4" />
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex flex-col gap-1 overflow-hidden">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug line-clamp-2 font-medium group-hover:text-zinc-900 dark:group-hover:text-zinc-100 transition-colors">
                {n.content}
              </p>
              <div className="flex items-center gap-1.5 text-[10px] text-zinc-400 font-bold uppercase tracking-tight">
                <Clock className="h-3 w-3" />
                {formatNotificationDate(n.created_at)}
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
          <Inbox className="h-10 w-10 mb-2 opacity-20" />
          <span className="text-xs font-bold uppercase tracking-widest opacity-50">Tudo em dia</span>
        </div>
      )}
    </div>
  );
}