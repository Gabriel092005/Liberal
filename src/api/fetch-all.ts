import { api } from "@/lib/axios";

export interface FetchAllOrdersResponse{
    location: string;
    id: number;
    title: string;
    content: string;
    image_path: string | null;
    brevidade: 'MEDIO'|'BAIXO'|'URGENTE';
    accepted: boolean;
    autor:{
          id:number
          nome:string
          image_path:string|null
          municipio:string
          provincia:string
          celular:string

    }
    status: 'PENDING'|'INTERRUPTED'|'ACEPTED'|'CONFIRMED';
    latitude: number;

}
interface FetchAllOrdersRequest{
     query:string|undefined
}
export async function FetchAllOrders({query}:FetchAllOrdersRequest){
    const response  = await api.get<FetchAllOrdersResponse[]>("/all-orders/",{
        params:{
            query
        }
    })
    return response.data
    
}