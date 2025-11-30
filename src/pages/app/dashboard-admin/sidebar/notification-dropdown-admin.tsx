import { useState } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Usuario } from "@/api/get-profile";
import { api } from "@/lib/axios";
import { NotificationMenuContentAdmin } from "@/pages/dash-admin/Notification-content-admin";

export function NotificationDropdownAdmin({ notificacoes, _count }: Usuario) {
  const [unreadCount, setUnreadCount] = useState<number>(_count.notificacoes);
  

  async function handleOpenMenu() {
    if (unreadCount === 0) return; // evita requisições desnecessárias
    setUnreadCount(0);

    try {
      await api.patch("/notifications/mark-as-seen");
    } catch (error) {
      console.error("Erro ao marcar notificações como vistas:", error);
    }
  }
  return (
    <DropdownMenu onOpenChange={(open) => open && handleOpenMenu()}>
      <DropdownMenuTrigger asChild>
          <Button
                        variant="ghost"
                        className="relative rounded-full h-11 w-11 flex items-center justify-center hover:bg-orange-50 dark:bg-zinc-900 transition-colors"
                      >
                    
          <Bell className="h-5 w-5 text-orange-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-md">
              {unreadCount}
            </span>
          )}
          { unreadCount > 9 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-md">
             +9
            </span>
          )}
      
        </Button>
      </DropdownMenuTrigger>

      <NotificationMenuContentAdmin notif={notificacoes} />
    </DropdownMenu>
  );
}
