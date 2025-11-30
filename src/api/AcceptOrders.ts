import { api } from "@/lib/axios";


interface AcceptOrdersRequest{
    pedidoId:number
    prestadorId:number
}

export async function AcceptOrders({pedidoId,prestadorId}:AcceptOrdersRequest){
    await api.put("/fechar",{pedidoId,prestadorId} )
}