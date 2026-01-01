import { Bell, CheckCheck, Clock, File, } from "lucide-react"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Notificacao } from "@/api/get-profile"
import { formatNotificationDate } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import { api } from "@/lib/axios"
import { Link } from "react-router-dom"

export interface NotifTypes {
  notif: Notificacao[]
}

export function NotificationMenuCostumer({ notif }: NotifTypes) {
    const [parent] = useAutoAnimate()
  return (
   <DropdownMenuContent
        align="end" // Alinhado à direita para mobile fica melhor
        sideOffset={12}
        className="w-80 md:w-96 rounded-[1.5rem] shadow-2xl p-2 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-xl border-zinc-200/50 dark:border-zinc-800/50 animate-in fade-in zoom-in-95"
      >
        <div className="flex items-center justify-between px-4 py-3">
          <DropdownMenuLabel className="font-black text-lg uppercase tracking-tighter text-zinc-800 dark:text-zinc-100 p-0">
            Notificações
          </DropdownMenuLabel>
          {notif.length > 0 && (
             <span className="text-[10px] font-bold bg-orange-500/10 text-orange-600 px-2 py-0.5 rounded-full uppercase">
               {notif.length} Novas
             </span>
          )}
        </div>
  
        <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800/50" />
  
        <div 
          ref={parent} 
          className="max-h-[420px] overflow-y-auto pr-1 scrollbar-none"
        >
          {notif.length > 0 ? (
            notif.map((n) => (
              <DropdownMenuItem
                key={n.id}
                className="group flex items-start gap-3 p-3 mb-1 rounded-2xl cursor-pointer transition-all duration-200 hover:bg-zinc-100/80 dark:hover:bg-zinc-900/80 focus:bg-zinc-100/80 dark:focus:bg-zinc-900/80 border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800"
              >
                {/* Avatar com Shape Moderno */}
                <div className="relative shrink-0">
                  <Avatar className="h-11 w-11 rounded-xl ring-2 ring-offset-2 ring-transparent group-hover:ring-orange-500/20 transition-all">
                    {n.image ? (
                      <AvatarImage
                        src={`${api.defaults.baseURL}/uploads/${n.image}`}
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="bg-gradient-to-br from-orange-400 to-orange-600 text-white">
                        <Bell className="h-5 w-5" />
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {/* Ponto indicador de "Não lido" (exemplo baseado em lógica de seen) */}
                  {!n.AlreadySeen && (
                     <span className="absolute -top-0.5 -right-0.5 h-3 w-3 bg-orange-600 border-2 border-white dark:border-zinc-950 rounded-full" />
                  )}
                </div>
  
                {/* Conteúdo Info */}
                <div className="flex flex-col min-w-0 flex-1 gap-0.5">
                  <p className="text-[13px] leading-snug font-medium text-zinc-900 dark:text-zinc-100 line-clamp-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {n.content}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-500">
                    <Clock size={10} />
                    {formatNotificationDate(n.created_at)}
                  </div>
                </div>
              </DropdownMenuItem>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="h-16 w-16 bg-zinc-100 dark:bg-zinc-900 rounded-3xl flex items-center justify-center mb-4">
                <File className="h-8 w-8 text-zinc-400 opacity-50" />
              </div>
              <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-tight">Tudo em dia!</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">Você não tem novas notificações no momento.</p>
            </div>
          )}
        </div>
  
        <DropdownMenuSeparator className="bg-zinc-100 dark:bg-zinc-800/50" />
  
        {/* Ação final - Botão estilizado */}
        <div className="p-2">
          <Link to='/notif-cotumer' className="block">
            <button className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-black uppercase tracking-widest hover:opacity-90 active:scale-[0.98] transition-all">
              Ver todas
              <CheckCheck size={14} />
            </button>
          </Link>
        </div>
        </DropdownMenuContent>
  )
}
