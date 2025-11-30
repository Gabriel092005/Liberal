import { api } from "@/lib/axios";

interface GetCategoriesRequest {
    query?:string|null
}

interface GetCategoryResponse {
    id: number;
    titulo: string;
    image_path: string | null;
    created_at: Date;

}

export async function GetCategory ({query}:GetCategoriesRequest){
     const response = await api.get<GetCategoryResponse[]>("/fetch-category/", {
        params:{
            query
        }
     })

     return response.data
}