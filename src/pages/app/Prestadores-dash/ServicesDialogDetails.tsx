import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/axios";
import { getInialts } from "@/lib/utils";
import { MapPin} from "lucide-react";
import { OpenOnFullScreenPhoto } from "./OpenOnFullPhotoDialog";

type Autor = {
   nome:string
   provincia:string
   municipio:string
   isSucces:boolean
   celular:string
   image_path:string|null
}
export function ServicesDialogDetails({image_path,municipio,nome,provincia,celular,isSucces}:Autor) {
  
  return (
      <DialogContent className="rounded-2xl p-6  dark:bg-black shadow-xl border border-orange-200">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <Avatar className="w-14 h-14 ring-2 ring-orange-400 shadow-md">
      <Dialog>
          <DialogTrigger>
            <AvatarImage src={`${api.defaults.baseURL}/uploads/${image_path}`} alt="User" />
          </DialogTrigger>
          <OpenOnFullScreenPhoto imagePath={image_path}></OpenOnFullScreenPhoto>
      </Dialog>
            <AvatarFallback className="bg-orange-100 text-orange-600 font-semibold">
              {getInialts(nome)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 flex flex-col">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-[5rem]">
                 <div>
                   <h2 className="text-lg font-semibold text-nowrap text-muted-foreground dark:text-muted-foreground">
                  {nome}
                </h2>
                 </div>
              </div>
              <span className="text-[0.65rem] text-muted-foreground"></span>
            </div>
              {isSucces && (
                   <div className="flex justify-between items-start">
              <div className="flex items-center gap-[5rem]">
                 <div>
                   <h2 className="text-lg font-semibold text-nowrap text-muted-foreground dark:text-muted-foreground">
                  {celular}
                </h2>
                 </div>
              </div>
              <span className="text-[0.65rem] text-muted-foreground"></span>
            </div>
              )}
            <div className="flex items-center gap-1 mt-3 text-orange-500 text-sm">
              <MapPin size={16} />
              <span className="font-medium">{municipio}, {provincia}</span>
            </div>
          </div>
        </div>
        {/* <div className="flex justify-end gap-1 mt-6">
            <X size={16} className="mr-1 text-red-500" />
            <div>
            <Handshake className="text-blue-500" size={16}/>
            </div>
            <div>
              <Layers className="text-orange-500" size={16}/>
            </div>
        </div> */}
    </DialogContent>
  );
}
