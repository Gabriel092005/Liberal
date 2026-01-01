// notif-costumer.tsx
import { Bell, FileText, Clock } from "lucide-react";
import { Notificacao } from "@/api/get-profile";
import { formatNotificationDate } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { api } from "@/lib/axios";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function NotificationMenuCostumer({ notif }: { notif: Notificacao[] }) {
  const [parent] = useAutoAnimate();

  return (
    <div ref={parent} className="flex flex-col gap-1">
      {notif.length > 0 ? (
        notif.map((n, i) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex items-start gap-4 p-3 rounded-2xl hover:bg-zinc-50 dark:hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-zinc-100 dark:hover:border-white/10"
          >
            <Avatar className="h-10 w-10 border shadow-sm flex-shrink-0">
              {n.image ? (
                <AvatarImage src={`${api.defaults.baseURL}/uploads/${n.image}`} />
              ) : (
                <AvatarFallback className="bg-orange-50 dark:bg-orange-950/20 text-orange-600">
                  <Bell className="h-4 w-4" />
                </AvatarFallback>
              )}
            </Avatar>

            <div className="flex flex-col gap-1 overflow-hidden">
              <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-snug line-clamp-2 font-medium">
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
        <div className="flex flex-col items-center justify-center py-10 opacity-40">
          <FileText className="h-10 w-10 mb-2" />
          <span className="text-xs font-bold uppercase tracking-widest">Vazio</span>
        </div>
      )}
    </div>
  );
}