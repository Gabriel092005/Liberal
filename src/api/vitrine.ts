import { api } from "@/lib/axios"

interface PromoverPerfilRequest{
     title:string,
     description:string
     
}
export async function PromoverServicos({description,title}:PromoverPerfilRequest){
      await api.post("/vitrine",{title,description})
}