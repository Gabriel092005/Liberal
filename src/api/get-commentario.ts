import { api } from "@/lib/axios";

interface GetCommentResponse {
      prestador: {
        id: number;
        nome: string;
        estrelas: number | null;
        image_path: string | null;
        provincia: string;
        municipio: string;
    } 
    id: number;
    comentario: string;
    usuarioId: number;
    
} 

export async function getComments() {
    const response = await api.get<GetCommentResponse[]>("/comment")
    return response.data
}