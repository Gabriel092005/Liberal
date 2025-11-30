import { api } from "@/lib/axios";


interface FetchMyVitrinePostsResponse {
    vitrine: {
    id: number;
    created_at: Date;
    description: string | null;
    image_path: string | null;
    usuarioId: number;
    titulo: string;
}[]
}

export async function FetchPostsVitrine(){
  const response  = await api.get<FetchMyVitrinePostsResponse>("/vitrine")
  
  return response.data.vitrine
    
}