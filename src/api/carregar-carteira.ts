import { api } from "@/lib/axios"

interface CarregarCarteiraRequest{
   metodo:string
   pacoteId:number
}

export async function assinarPacote({metodo,pacoteId}:CarregarCarteiraRequest){
    console.log("pacoteId", pacoteId)
       await api.post("/recarregar", {metodo, pacoteId})
}