import { api } from "@/lib/axios"
import { Usuario } from "./get-profile"

interface FetchCostumersFiltersRequest {
    province?:string|null,
    municipality?:string|null,
    nome?:string|null
    page?:number|null
}

interface FetchCostumersFiltersResponse{

      	pagination: {
		perPage: number,
		currentPage: number,
		total: number,
		totalPages: number
   }
  users:Usuario[]
}

export async function GetCostumers({municipality,nome,page,province}:FetchCostumersFiltersRequest) {
    
    console.log("provincia:", province)
    console.log("muni:", municipality)
    console.log("nome:", nome)
   

     const response  = await api.get<FetchCostumersFiltersResponse>("/users/costumers/",{
        params:{
            province,
            nome,
            municipality,
            page
        }
     })
     return response.data
}