import { GetUserProfileById } from "@/api/get-profileById"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { api } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { Globe, MapPinIcon, MessageCircle, Share2, ShieldCheck, Star, ArrowLeft } from "lucide-react"
import { useParams, useNavigate } from "react-router-dom"

export function PrestadoreProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
   
  const { data } = useQuery({
    queryKey: ["profileById", id],
    queryFn: () => GetUserProfileById({ userId: id }),
    enabled: !!id,
  });



  if (!data) return null;

  return (
    /* CONTENTOR PRINCIPAL: 
      - fixed inset-0: Ocupa 100% da largura e altura da janela.
      - bg-white: Fundo limpo sem bordas visíveis.
      - z-[999]: Garante que fica acima de qualquer outro elemento.
    */
    <div className="fixed inset-0 w-full h-screen bg-white dark:bg-zinc-950 z-[999] flex flex-col overflow-hidden border-none outline-none">
      
      {/* SCROLL AREA: 
         Configurado para h-full para permitir o scroll em todo o ecrã do telemóvel.
      */}
      <ScrollArea className="flex-1 w-full h-full border-none">
        <div className="flex flex-col pb-32">
          
          {/* HEADER IMERSIVO (ESTILO INSTAGRAM/TIKTOK) */}
          <div className="relative w-full h-[45vh]">
            {/* Gradiente de proteção para os ícones superiores */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-b from-black/40 to-transparent z-20" />
            
            {/* Botão de Voltar Nativo */}
            <button 
              onClick={() => navigate(-1)}
              className="absolute top-6 left-6 z-30 p-2 rounded-full bg-black/20 backdrop-blur-md text-white active:scale-90 transition-transform"
            >
              <ArrowLeft size={24} />
            </button>

            <Badge className="absolute top-6 right-6 z-30 bg-emerald-500 border-none text-white font-black px-3 py-1 rounded-full text-[10px] tracking-tighter">
              • ONLINE AGORA
            </Badge>

            <img
              src={`${api.defaults.baseURL}/uploads/${data.image_path}`}
              alt="Capa"
              className="w-full h-full object-cover"
            />
            
            {/* Gradiente inferior para leitura do nome */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-zinc-950 to-transparent z-10" />

            {/* Foto de Perfil Flutuante */}
            <div className="absolute -bottom-6 left-8 z-20">
              <div className="relative">
                <img
                  src={`${api.defaults.baseURL}/uploads/${data.image_path}`}
                  alt="Perfil"
                  className="w-24 h-24 rounded-3xl border-4 border-white dark:border-zinc-950 shadow-2xl object-cover"
                />
                <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-zinc-950" />
              </div>
            </div>
          </div>

          {/* CORPO DO PERFIL */}
          <div className="mt-12 px-8 space-y-8">
            
            {/* Nome e Título Profissional */}
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-3xl font-black tracking-tighter text-zinc-900 dark:text-white uppercase italic">
                  {data?.nome}
                </h2>
                <ShieldCheck className="text-blue-500 fill-blue-500/10" size={26} />
              </div>
              <div className="flex items-center gap-3">
                <span className="text-orange-500 text-[11px] font-black uppercase tracking-[0.3em]">
                  {data.profissao}
                </span>
                <div className="h-1 w-1 rounded-full bg-zinc-300" />
                <div className="flex items-center gap-1">
                  <Star className="fill-yellow-400 text-yellow-400" size={14} />
                  <span className="text-sm font-black italic">4.9</span>
                </div>
              </div>
            </div>

            {/* Grid de Informação Local */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col items-start gap-2">
                <MapPinIcon size={20} className="text-orange-500" />
                <div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Município</p>
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{data.municipio}</p>
                </div>
              </div>
              <div className="p-5 rounded-[2rem] bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 flex flex-col items-start gap-2">
                <Globe size={20} className="text-orange-500" />
                <div>
                  <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Província</p>
                  <p className="text-sm font-bold text-zinc-800 dark:text-zinc-200">{data.provincia || "Luanda"}</p>
                </div>
              </div>
            </div>

            {/* Descrição / Bio */}
            <div className="space-y-3">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-3">
                BIOGRAFIA
                <div className="h-px flex-1 bg-zinc-100 dark:bg-zinc-800" />
              </h3>
              <p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-300 font-medium">
                {data?.description || "Especialista verificado e focado em entregar resultados de excelência para os seus clientes."}
              </p>
            </div>

            {/* ACÇÕES DE CONTACTO */}
            <div className="flex flex-col gap-4 pt-6">
              <Button className="w-full h-16 rounded-3xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-black uppercase text-xs tracking-widest shadow-2xl shadow-black/10 flex items-center justify-center gap-3 active:scale-[0.98] transition-all">
                <MessageCircle size={22} fill="currentColor" />
                Solicitar Orçamento
              </Button>
              
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-14 rounded-3xl border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest gap-2">
                  <Share2 size={16} />
                  Partilhar
                </Button>
                <Button variant="outline" className="h-14 rounded-3xl border-zinc-200 dark:border-zinc-800 text-[10px] font-black uppercase tracking-widest gap-2">
                   Portefólio
                </Button>
              </div>
            </div>

          </div>
        </div>
      </ScrollArea>
    </div>
  );
}