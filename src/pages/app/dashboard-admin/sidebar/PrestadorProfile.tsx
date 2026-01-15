
import { GetUserProfileById } from "@/api/get-profileById"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { Globe, MapPinIcon, MessageCircle, Share2, ShieldCheck, Star } from "lucide-react"
import { useParams } from "react-router-dom"

export function PrestadoreProfile() {
  const { id } = useParams();
   
  const { data } = useQuery({
    queryKey: ["profileById", id],
    queryFn: () => GetUserProfileById({ userId: id }),
    enabled: !!id,
  });

  if (!data) return null;

  return (
    /* IMPORTANTE: Removi o 'right-6' e '-top-14'. 
       Para centralizar no Shadcn Dialog, o ideal é que o container seja simples.
    */
    <div className="mx-auto max-w-lg w-full relative right-5  -top-10 border-none bg-white dark:bg-zinc-950 rounded-[2.5rem] overflow-hidden shadow-2xl focus:ring-0 outline-none">
      
      {/* Ajustei o ScrollArea para h-[85vh] para garantir que em qualquer celular 
          o conteúdo seja rolável e os botões não sumam.
      */}
      <ScrollArea className="h-[85vh] w-full outline-none">
        <div className="flex flex-col pb-10">
          
          {/* Header/Banner */}
          <div className="relative">
            <div className="aspect-[16/9] w-full relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
              <img
                src={`${api.defaults.baseURL}/uploads/${data.image_path}`}
                alt="Capa"
                className="w-full h-full object-cover"
              />
              <Badge className="absolute top-4 right-4 z-20 bg-emerald-500 border-none text-white font-black px-3 py-1 rounded-full text-[10px] animate-pulse">
                • ONLINE AGORA
              </Badge>
            </div>

            {/* Foto de Perfil Flutuante */}
            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 md:left-10 md:translate-x-0 z-20">
              <div className="relative">
                <img
                  src={`${api.defaults.baseURL}/uploads/${data.image_path}`}
                  alt="Perfil"
                  className="w-24 h-24 md:w-28 md:h-28 rounded-[2rem] border-[6px] border-white dark:border-zinc-950 shadow-xl object-cover"
                />
                <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-[4px] border-white dark:border-zinc-950" />
              </div>
            </div>
          </div>

          {/* Dados do Profissional */}
          <div className="mt-16 px-6 md:px-10 space-y-8">
            
            {/* Nome e Título */}
            <div className="text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <h2 className="text-2xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase">
                  {data?.nome}
                </h2>
                <ShieldCheck className="text-blue-500" size={22} />
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-2">
                <span className="bg-orange-500/10 text-orange-600 text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest">
                  {data.profissao}
                </span>
                <div className="flex items-center gap-1 bg-zinc-100 dark:bg-zinc-900 px-3 py-1 rounded-lg">
                  <Star className="fill-yellow-400 text-yellow-400" size={12} />
                  <span className="text-xs font-bold">4.9</span>
                </div>
              </div>
            </div>

            {/* Info Cards Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 flex flex-col items-center md:items-start">
                <MapPinIcon size={18} className="text-orange-500 mb-2" />
                <span className="text-[9px] font-black text-zinc-400 uppercase">Cidade</span>
                <span className="text-xs font-bold truncate w-full text-center md:text-left">{data.municipio}</span>
              </div>
              <div className="p-4 rounded-3xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800 flex flex-col items-center md:items-start">
                <Globe size={18} className="text-orange-500 mb-2" />
                <span className="text-[9px] font-black text-zinc-400 uppercase">Província</span>
                <span className="text-xs font-bold">{data.provincia || "Luanda"}</span>
              </div>
            </div>

            {/* Bio/Descrição */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2">
                <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
                Sobre mim
              </h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 font-medium">
                {data?.description || "Este profissional é verificado e especialista em sua área de atuação, oferecendo serviços de alta qualidade."}
              </p>
            </div>

            {/* CTA Final (Botões) */}
            <div className="flex flex-col gap-3 pt-4">
              <Button className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase text-xs shadow-lg shadow-orange-500/20 gap-3">
                <MessageCircle size={20} />
                Entrar em contacto agora
              </Button>
              <Button variant="ghost" className="w-full h-12 rounded-2xl text-zinc-500 font-bold text-[10px] uppercase tracking-widest gap-2">
                <Share2 size={16} />
                Partilhar Perfil
              </Button>
            </div>

          </div>
        </div>
      </ScrollArea>
    </div>
  );
}