import { api } from "@/lib/axios";

export interface VitrinePost {
  id: number;
  titulo: string;
  description: string | null;
  image_path: string | null;
  created_at: string; // O JSON do axios vem como string, o formatDistance converterá
  usuarioId: number;
  usuario: {
    nome: string;
    image_path: string | null;
  };
  likes: Array<{ usuarioId: number }>;
  comments: Array<{ id: number; content: string }>;
  _count: {
    likes: number;
    comments: number;
  };
  isLiked?: boolean; // Campo virtual para o Frontend
}

interface FetchMyVitrinePostsResponse {
  vitrine: VitrinePost[];
}

export async function FetchPostsVitrineAll() {
  const response = await api.get<FetchMyVitrinePostsResponse>("/vitrine");
  
  // Retornamos a lista pura para o useQuery
  return response.data.vitrine;
}