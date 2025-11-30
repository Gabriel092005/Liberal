import { api } from "@/lib/axios";



export async function Deletar({pedidoId}:{pedidoId:number}) {
      await api.delete("/revoke", {
        params:{
            pedidoId
        }
      })
    
}