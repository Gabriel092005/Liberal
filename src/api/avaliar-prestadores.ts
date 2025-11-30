import { api } from "@/lib/axios"

interface AvaliarPrestadoresRequest{
    prestadorId:number
}
export async function AvaliarPrestadores({prestadorId}:AvaliarPrestadoresRequest){
    await api.post("/avaliar", {prestadorId})   
}