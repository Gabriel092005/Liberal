import { DialogContent } from "@/components/ui/dialog"
import { BriefcaseBusinessIcon, MapPinIcon, Phone, ShieldCheck, Star} from "lucide-react"
import { api } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { GetUserProfileById } from "@/api/get-profileById"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

export function PrestadoreProfile({ id }: { id: string | null }) {
  const { data } = useQuery({
    queryKey: ["profileById", id],
    queryFn: () => GetUserProfileById({ userId: id }),
    enabled: !!id,
  });

  if (!data) return null;

  return (
    <DialogContent 
      // 1. max-w-lg limita a largura em desktop
      // 2. w-[95vw] garante que em mobile ele não cole nas bordas
      // 3. overflow-hidden + p-0 para o design fluir até as bordas
      className="max-w-lg w-[95vw]   p-0 border-none bg-white dark:bg-slate-950 rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] focus:ring-0"
    >
      {/* ScrollArea para garantir que o conteúdo nunca quebre em telas pequenas (iPhone SE, etc) */}
      <ScrollArea className="max-h-[80vh] w-full">
        <div className="relative">
          {/* Banner */}
          <div className="h-20 md:h-48 w-full relative">
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
            <img
              src={`${api.defaults.baseURL}/uploads/${data.image_path}`}
              alt="Capa"
              className="w-full h-full object-cover"
            />
            <Badge className="absolute top-4 right-4 z-20 bg-orange-500 border-none text-white font-bold px-3 py-1 rounded-full animate-pulse">
              Online agora
            </Badge>
          </div>

          {/* Foto de perfil */}
          <div className="absolute -bottom-10 left-6 md:left-8 z-20">
            <div className="relative">
              <img
                src={`${api.defaults.baseURL}/uploads/${data.image_path}`}
                alt="Perfil"
                className="w-20 h-20 md:w-24 md:h-24 rounded-[1.8rem] border-[5px] border-white dark:border-slate-950 shadow-2xl object-cover"
              />
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 md:w-6 md:h-6 rounded-full border-[3px] border-white dark:border-slate-950 shadow-sm" />
            </div>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="mt-12 px-6 md:px-8 pb-8">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                  {data?.nome}
                </h2>
                <ShieldCheck className="text-blue-500 fill-blue-500/10" size={20} />
              </div>
              
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 bg-orange-50 dark:bg-orange-500/10 px-2.5 py-1 rounded-lg">
                  <BriefcaseBusinessIcon className="text-orange-600" size={12} />
                  <span className="text-[10px] md:text-[11px] font-black text-orange-600 uppercase tracking-wider">
                    {data.profissao}
                  </span>
                </div>
                <div className="flex items-center gap-1 bg-slate-50 dark:bg-slate-900 px-2.5 py-1 rounded-lg">
                  <Star className="fill-yellow-400 text-yellow-400" size={12} />
                  <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300">4.9</span>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de Informações Rápidas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                <MapPinIcon size={16} className="text-orange-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Localização</span>
                <span className="text-xs md:text-sm font-bold truncate">{data.municipio}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
              <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                <Phone size={16} className="text-orange-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Contato</span>
                <span className="text-xs md:text-sm font-bold">+{data.celular}</span>
              </div>
            </div>
          </div>

          {/* Bio */}
          <div className="mt-8">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Sobre</h3>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
              {data?.description || "Este profissional ainda não adicionou uma descrição detalhada."}
            </p>
          </div>

          {/* Ações Fixas na Base do Modal */}
          {/* <div className="mt-8 flex gap-3">
            <Button className="flex-1 h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-[0_12px_24px_-8px_rgba(249,115,22,0.5)] transition-all active:scale-95 gap-2">
              <MessageCircle size={18} />
              Contratar Agora
            </Button>
            <Button variant="outline" className="h-14 w-14 rounded-2xl border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all active:scale-95">
              <Phone size={20} className="text-slate-600 dark:text-slate-400" />
            </Button>
          </div> */}
        </div>
      </ScrollArea>
    </DialogContent>
  )
}