import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DialogContent } from "@/components/ui/dialog";
import { MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ServicesDialogDetails() {
  return (
    <DialogContent className="rounded-2xl p-6  dark:bg-black shadow-xl border border-orange-200">
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <Avatar className="w-14 h-14 ring-2 ring-orange-400 shadow-md">
          <AvatarImage src="https://i.pravatar.cc/150?img=12" alt="User" />
          <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
            JV
          </AvatarFallback>
        </Avatar>

        {/* Conteúdo */}
        <div className="flex-1 flex flex-col">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-semibold text-zinc-800 dark:text-zinc-800">
                Manuel Pedro
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                   +244 865  737 635
              </p>
            </div>

            <span className="text-[0.65rem] text-muted-foreground">1 min</span>
          </div>

          {/* Localização */}
          <div className="flex items-center gap-1 mt-3 text-orange-500 text-sm">
            <MapPin size={16} />
            <span className="font-medium">Estalagem, Luanda</span>
          </div>
        </div>
      </div>

      {/* Ações */}
      <div className="flex justify-end gap-3 mt-6">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <X size={16} className="mr-1" />
          Recusar
        </Button>
        <Button
          variant="default"
          size="sm"
          className="rounded-full bg-orange-500 hover:bg-orange-600 text-white shadow-md"
        >
          Negociar
        </Button>
      </div>
    </DialogContent>
  );
}
