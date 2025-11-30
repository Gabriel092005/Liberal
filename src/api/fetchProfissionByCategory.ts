import { api } from "@/lib/axios";


interface FetchProfissionByCategory{
    categoryId:number
}

interface FetchProfissionByCategoryResponse{

    id: number;
    created_at: Date;
    titulo: string;
    categoryId: number;
}

export async function GetProfissaoByCategory({categoryId}:FetchProfissionByCategory) {
    const response = await api.get<FetchProfissionByCategoryResponse[]>(`/byCategory/${categoryId}`)
    return response.data
    
}