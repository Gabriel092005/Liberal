import { api } from "@/lib/axios"

interface EditarBioRequest{
    description:string
}

export async function EditarBio({description}:EditarBioRequest) {
      await api.put("/usuario/bio", {description})
    
}