import { Bell, FileText, Clock } from "lucide-react";
import { Notificacao } from "@/api/get-profile";
import { formatNotificationDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { api } from "@/lib/axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export interface NotifTypes {
  notif: Notificacao[];
}

export function NotificationMenuCostumer({ notif }: NotifTypes) {
  const [parent] = useAutoAnimate();

  return (
    <div ref={parent} className="flex flex-col gap-1">
      {notif.length > 0 ? (
        notif.map((n, index) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group relative flex items-start gap-4 p-3 rounded-2xl hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 cursor-pointer transition-all duration-300 border border-transparent hover:border-zinc-200/50 dark:hover:border-zinc-800/50"
          >
            {/* Indicador de Não Lida (se n.seen for false) */}
            {!n.AlreadySeen && (
               <span className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-orange-500 rounded-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
            )}

            <Avatar className="h-11 w-11 border-2 border-white dark:border-zinc-800 shadow-sm flex-shrink-0">
              {n.image ? (
                <AvatarImage
                  src={`${api.defaults.baseURL}/uploads/${n.image}`}
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-orange-50 dark:bg-orange-950/20">
                  <Bell className="h-5 w-5 text-orange-500" />
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex flex-col gap-0.5 overflow-hidden">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-tight line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors">
                {n.content}
              </p>
              
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 font-medium">
                <Clock className="h-3 w-3" />
                {formatNotificationDate(n.created_at)}
              </div>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-zinc-400 gap-3">
          <div className="p-4 rounded-full bg-zinc-50 dark:bg-zinc-900">
            <FileText className="h-8 w-8 opacity-20" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest opacity-50">Sem novas notificações</span>
        </div>
      )}

      {notif.length > 0 && (
        <Link 
          to='/notif-costumer' 
          className="mt-2 p-3 text-center text-[11px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-600 transition-colors border-t border-zinc-100 dark:border-zinc-800/50"
        >
          Ver histórico completo
        </Link>
      )}
    </div>
  );
}