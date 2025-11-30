import { Bell, File, } from "lucide-react"
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

export function NotificationMenu({ notif }: NotifTypes) {
    const [parent] = useAutoAnimate()
  return (
    <DropdownMenuContent
      align="start"
      sideOffset={8}
      className="w-80 rounded-xl shadow-lg p-3 bg-white dark:bg-muted dark:bg-neutral-900"
    >
      <DropdownMenuLabel className="font-semibold text-base">
        Notificações
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <div ref={parent} className="max-h-80 overflow-y-auto pr-1 scroll-smooth scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {notif.length > 0 ? (
          notif.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className="flex items-start gap-4 p-3 rounded-xl hover:bg-muted cursor-pointer transition-colors duration-200"
            >
              {/* Avatar */}
              <Avatar className="flex-shrink-0">
                {n.image ? (
                  <AvatarImage
                    src={`${api.defaults.baseURL}/uploads/${n.image}`}
                    alt="Avatar do usuário"
                    className="w-10 h-10"
                  />
                ) : (
                  <AvatarFallback className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                    <Bell className="h-5 w-5 text-orange-500" />
                  </AvatarFallback>
                )}
              </Avatar>

              {/* Conteúdo */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">
                  {n.content}
                </span>
                <span className="text-xs text-muted-foreground mt-1">
                  {formatNotificationDate(n.created_at)}
                </span>
              </div>
            </DropdownMenuItem>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center p-4 text-muted-foreground gap-2">
            <File className="h-6 w-6" />
            <span className="text-sm">Nenhuma notificação</span>
          </div>
        )}
      </div>

      <DropdownMenuSeparator />

      {/* Ação final */}
      <Link to='/notif-prestadores'>
        <DropdownMenuItem className="justify-center text-center text-orange-600 font-medium hover:bg-muted cursor-pointer">
        Ver todas
      </DropdownMenuItem>
      </Link>
    
    </DropdownMenuContent>
  )
}
