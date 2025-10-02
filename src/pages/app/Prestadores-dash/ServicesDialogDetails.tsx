import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DialogContent } from "@/components/ui/dialog";
import { Handshake, Layers, MapPin, X } from "lucide-react";

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
          <div className="flex items-center gap-1 mt-3 text-orange-500 text-sm">
            <MapPin size={16} />
            <span className="font-medium">Estalagem, Luanda</span>
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-1 mt-6">
          <X size={16} className="mr-1 text-red-500" />
          <div>
          <Handshake className="text-blue-500" size={16}/>
          </div>
          <div>
            <Layers className="text-orange-500" size={16}/>
          </div>
      </div>
    </DialogContent>
  );
}
