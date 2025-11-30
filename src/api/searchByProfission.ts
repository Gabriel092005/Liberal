import { api } from "@/lib/axios";

interface FetchByProfissionRequest{
     query:string | null
}
export interface FetchByProfissionResponse{
 Usuario: {
    id: number;
    nome: string;
    celular: string;
    nif: string;
    palavraPasse: string;
    estrelas: number | null;
    profissao: string;
    estado_conta: 'ACTIVA'|'DESATIVADA'|'PENDENTE';
    created_at: Date;
   role: 'ADMIN' | 'PRESTADOR_INDIVIDUAL' | 'PRESTADOR_COLECTIVO' | 'CLIENTE_COLECTIVO' | 'CLIENTE_INDIVIDUAL';
    image_path: string | null;
    provincia: string;
    municipio: string;
    nomeRepresentante: string | null;
    postsvitrineId: number | null;
}[]
}
export async function FetchByProfission({query}:FetchByProfissionRequest){
    try {
          const response  = await api.get<FetchByProfissionResponse>("/ByProfission/",{
            params:{
                query
            }
          })
          return response.data
    } catch (error) {
        
    }
}