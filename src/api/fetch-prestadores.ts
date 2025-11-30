import { api } from "@/lib/axios"
import { Usuario } from "./get-profile"

interface FetchPrestadoresFiltersRequest {
    province?:string|null,
    municipality?:string|null,
    nome?:string|null
    page?:number|null
}

interface FetchPrestadoresFiltersResponse{

        pagination: {
        perPage: number,
        currentPage: number,
        total: number,
        totalPages: number
   }
  users:Usuario[]
}

export async function getPrestadores({municipality,nome,page,province}:FetchPrestadoresFiltersRequest) {
     const response  = await api.get<FetchPrestadoresFiltersResponse>("/users/prestadores/",{
        params:{
            province,
            nome,
            municipality,
            page
        }
     })
     return response.data
}