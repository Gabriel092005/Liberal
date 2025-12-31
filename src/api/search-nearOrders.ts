import { api } from "@/lib/axios";

export interface SearchNewOrdersResponse{
    latitude: number;
    longitude: number;
    status: 'PENDING'|'INTERRUPTED'|'ACEPTED';
    id: number;
    title: string;
    content: string;
    image_path: string | null;
    dono :{
      id:number
      provincia:string
      celular:string
      nome:string
    }
    brevidade: 'MEDIO'|'BAIXO' |'URGENTE';
    location: string;
    created_at: Date;
    usuarioId: number;

}
export interface SearchNewOrdersRequest {
  latitude: number | undefined
  longitude: number | undefined
  radiusKm: number | undefined // ✅ nome certo
}

export async function SearchNearOrders({latitude,longitude,radiusKm}:SearchNewOrdersRequest) {
    
   console.log(latitude,longitude)
  const response = await api.get<SearchNewOrdersResponse[]>("/orders/",{
        params:{
            latitude,
            longitude,
            radiusKm
        }
     } )
     return response.data
    
}