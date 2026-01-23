import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { api } from "@/lib/axios";
import { getInialts } from "@/lib/utils";
import { CheckCircle2, MapPin, Phone } from "lucide-react";
import { OpenOnFullScreenPhoto } from "./OpenOnFullPhotoDialog";

type Autor = {
  nome: string;
  provincia: string;
  municipio: string;
  isSucces: boolean;
  celular: string;
  image_path: string | null;
};

export function ServicesDialogDetails({
  image_path,
  municipio,
  nome,
  provincia,
  celular,
  isSucces,
}: Autor) {
  return (
    <DialogContent className="sm:max-w-[400px] w-[92%] rounded-[2.5rem] p-0 overflow-hidden bg-white dark:bg-zinc-950 border-none shadow-2xl">
      {/* Header Estilo Card Nativo */}
      <div className="bg-orange-500/5 dark:bg-orange-500/10 p-8 pb-6 flex flex-col items-center text-center">
        
        {/* Avatar com efeito de profundidade */}
        <div className="relative mb-4">
          <Avatar className="w-24 h-24 ring-4 ring-white dark:ring-zinc-900 shadow-xl">
            <Dialog>
              <DialogTrigger asChild>
                <button className="outline-none">
                  <AvatarImage
                    src={`${api.defaults.baseURL}/uploads/${image_path}`}
                    alt={nome}
                    className="object-cover"
                  />
                </button>
              </DialogTrigger>
              <OpenOnFullScreenPhoto imagePath={image_path} />
            </Dialog>
            <AvatarFallback className="bg-orange-100 text-orange-600 text-2xl font-black italic">
              {getInialts(nome)}
            </AvatarFallback>
          </Avatar>
          
          {isSucces && (
            <div className="absolute bottom-1 right-1 bg-white dark:bg-zinc-900 rounded-full p-1">
              <CheckCircle2 className="text-green-500 w-6 h-6 fill-green-500/10" />
            </div>
          )}
        </div>

        <h2 className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-100 uppercase italic">
          {nome}
        </h2>
        
        <div className="flex items-center gap-1.5 mt-2 text-zinc-500 dark:text-zinc-400">
          <MapPin size={14} className="text-orange-500" />
          <span className="text-xs font-bold uppercase tracking-widest">
            {municipio} • {provincia}
          </span>
        </div>
      </div>

      {/* Info Body */}
      <div className="p-6 pt-0 space-y-3">
        {isSucces ? (
          <div className="bg-zinc-50 dark:bg-zinc-900/50 rounded-[1.5rem] p-4 flex items-center justify-between border border-zinc-100 dark:border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-full text-orange-600">
                <Phone size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-zinc-400 uppercase tracking-tighter">Telemóvel</span>
                <span className="text-sm font-bold text-zinc-800 dark:text-zinc-200">
                  {celular}
                </span>
              </div>
            </div>
            <a 
              href={`tel:${celular}`}
              className="bg-orange-500 text-white px-4 py-2 rounded-xl text-xs font-black uppercase italic shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
            >
              Ligar
            </a>
          </div>
        ) : (
          <div className="p-4 text-center border-2 border-dashed border-zinc-100 dark:border-zinc-800 rounded-[1.5rem]">
            <p className="text-[10px] font-bold text-zinc-400 uppercase">
              Contrate para ver o contacto
            </p>
          </div>
        )}

      
      </div>
    </DialogContent>
  );
}