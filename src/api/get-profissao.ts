import { api } from "@/lib/axios";


export async function Profissao() {
    const response = await api.get("/get")
    return response.data
    
}