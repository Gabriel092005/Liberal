import { DialogContent } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { BriefcaseBusinessIcon, MapPinIcon,  Phone} from "lucide-react"
import { api } from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"
import { GetUserProfileById } from "@/api/get-profileById"

export function PrestadoreProfile({id}:{id:string|null}) {


   const { data} = useQuery({
  queryKey: ["profileById"],
  refetchOnWindowFocus: true,     // Rebusca ao voltar ao foco
  refetchOnReconnect: true,       // Rebusca se a internet voltar
  refetchOnMount: true,           // Rebusca sempre que o componente monta
  staleTime: 0,    
  queryFn:()=> GetUserProfileById({userId:id}),
  });
  if(!data){
      return
  }
  return (
    <DialogContent className="max-w-2xl p-10 rounded-xl overflow-hidden">
      <div className="relative">
        {/* Capa */}
        <div className="h-40 md:h-56 w-full">
          <img
            src={`${api.defaults.baseURL}/uploads/${data.image_path}`}
            alt="Capa"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Foto de perfil */}
        <div className="absolute -bottom-12 left-6">
          <img
           src={`${api.defaults.baseURL}/uploads/${data.image_path}`}
            alt="Perfil"
            className="w-28 h-28 rounded-full border-4 border-background shadow-md object-cover"
          />
        </div>
      </div>

      {/* Conteúdo */}
      <div className="mt-16 px-6 pb-6">
        {/* Nome e bio */}
        <h2 className="text-xl font-bold">{}</h2>
        <p className="text-muted-foreground text-sm">
        {data?.nome}
        </p>
           <div className="flex items-center gap-1">
            <BriefcaseBusinessIcon className="text-red-500" size={14}></BriefcaseBusinessIcon>
            <span className="text-muted-foreground">{data.profissao}</span>
        
          </div>   

        {/* Ações */}
        <div className="flex gap-3 mt-4">
          <div className="flex items-center ">
            <Phone size={18} />
            <span className="text-muted-foreground">+{data.celular}</span>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPinIcon className="text-red-500" size={14}></MapPinIcon>
            <span>{data.municipio}</span>
            <span>{data.provincia}</span>
          </div>     

          
          
        </div>

        {/* Sobre mim */}
        <Card className="mt-6">
          <CardContent className="p-4">
            <h3 className="font-semibold text-base mb-2">Sobre</h3>
            <p className="text-sm text-muted-foreground">
              {data?.description}
            </p>
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  )
}
