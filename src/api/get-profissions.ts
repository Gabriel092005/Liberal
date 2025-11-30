import { api } from "@/lib/axios";

interface GetProfissionResponse{
     profissao: {
    id: number;
    created_at: Date;
    titulo: string;
    categoryId: number;
}[]
}

export async function GetProfission(){
    const response = await api.get<GetProfissionResponse>("/get")
    console.log("response:",response.data.profissao)
    return response.data
    
}