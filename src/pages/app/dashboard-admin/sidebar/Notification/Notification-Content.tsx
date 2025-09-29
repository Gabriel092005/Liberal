import { Bell, CheckCircle, XCircle } from "lucide-react"
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export function NotificationMenu() {
  return (
    <DropdownMenuContent
      align="start"
      sideOffset={8} // joga um pouco mais à direita
      className="w-80 rounded-xl shadow-lg p-3 bg-white dark:bg-black"
    >
      <DropdownMenuLabel className="font-semibold text-base">
        Notificações
      </DropdownMenuLabel>
      <DropdownMenuSeparator />

      {/* Notificação 1 */}
      <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 rounded-lg hover:bg-muted cursor-pointer">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5 text-green-500" />
          <span className="text-sm font-medium">Sua solicitação foi aceite pelo Gabriel!</span>
        </div>
        <span className="text-xs text-muted-foreground ml-7">Hoje, 09:45</span>
      </DropdownMenuItem>

      {/* Notificação 2 */}
      <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 rounded-lg hover:bg-muted cursor-pointer">
        <div className="flex items-center gap-2">
          <XCircle className="h-5 w-5 text-red-500" />
          <span className="text-sm font-medium">O Gabriel Negou seu pedido.</span>
        </div>
        <span className="text-xs text-muted-foreground ml-7">Ontem, 22:10</span>
      </DropdownMenuItem>

      {/* Notificação 3 */}
      <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 rounded-lg hover:bg-muted cursor-pointer">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium">Você recebeu uma nova mensagem.</span>
        </div>
        <span className="text-xs text-muted-foreground ml-7">Hoje, 08:30</span>
      </DropdownMenuItem>

      <DropdownMenuSeparator />

      {/* Ação final */}
      <DropdownMenuItem className="justify-center text-center text-orange-600 font-medium hover:bg-muted cursor-pointer">
        Ver todas
      </DropdownMenuItem>
    </DropdownMenuContent>
  )
}
