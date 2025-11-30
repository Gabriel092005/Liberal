import { api } from "@/lib/axios";




export async function DeleteVitrine({vitrineId}:{vitrineId:string}){
    await api.post("/delete-vitrine",{vitrineId})
}