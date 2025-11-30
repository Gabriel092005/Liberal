import { api } from "@/lib/axios";

interface GraphicsSalesMonthlyResponse {
     data: {
    month: string;
    amount: number;
}[]
}

export async function GraphicsSales(){
   const response = await api.get<GraphicsSalesMonthlyResponse>("/admin/metrics/sales")
   return response.data.data
    
}