import { api } from "@/lib/axios";

interface RemoveFavoritosRequest{
    prestadorId:string
}

export async function RemoveFavoritos({prestadorId}:RemoveFavoritosRequest){
    await api.delete("/remove/",{
        params:{
            prestadorId
        }
    })
} 