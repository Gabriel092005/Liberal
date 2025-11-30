import { api } from "@/lib/axios";


interface OrdersRequest{
    pedidoId:number
    prestadorId:number
}

export async function InterruptOrders({pedidoId,prestadorId}:OrdersRequest){
    await api.put("/interromper",{pedidoId,prestadorId} )
}