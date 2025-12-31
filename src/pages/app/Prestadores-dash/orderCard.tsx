import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";
import { formatDistanceToNow } from "date-fns/formatDistanceToNow";
import { pt } from "date-fns/locale";
import { motion } from "framer-motion";
import { Handshake, Loader, MapPin, User } from "lucide-react";

// Componente interno para exibir cada pedido na lista
export function OrderCard({ order, loadingId, onInteressar, isPending }: { 
  order: any, 
  loadingId: number | null, 
  onInteressar: (id: number) => void,
  isPending: boolean 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        <Avatar className="h-12 w-12 ring-2 ring-orange-500/10">
          <AvatarImage src={`${api.defaults.baseURL}/uploads/${order.image_path}`} />
          <AvatarFallback className="bg-orange-100 text-orange-600 font-bold">
            {order.title?.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
              {order.title}
            </h3>
            <span className="text-[10px] text-zinc-400 whitespace-nowrap ml-2">
              {formatDistanceToNow(new Date(order.created_at), {
                addSuffix: true,
                locale: pt,
              })}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-500 mt-2">
            <User size={14} className="text-zinc-400" />
            <span>{order.dono?.nome}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-orange-600 mt-1">
            <MapPin size={14} />
            <span className="truncate max-w-[150px] font-medium">{order.location}</span>
          </div>
        </div>
      </div>

      <Button
        onClick={() => onInteressar(order.id)}
        disabled={isPending && loadingId === order.id}
        className="w-full mt-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl shadow-sm hover:opacity-90"
      >
        {isPending && loadingId === order.id ? (
          <Loader className="animate-spin" size={18} />
        ) : (
          <div className="flex items-center gap-2">
            <Handshake size={18} />
            <span>Negociar</span>
          </div>
        )}
      </Button>
    </motion.div>
  );
}