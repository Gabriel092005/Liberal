import { api } from "@/lib/axios";
 // adicione se ainda não tiver

export interface Notificacao {
  id: number;
  created_at: Date;
  content: string;
  AlreadySeen: boolean;
  image:string|null,
  authorId: number;
}

export interface Usuario {
  id: number;
  nome: string;
  celular: string;
  nif: string;
  description: string
  palavraPasse: string;
  estrelas: number | null;
  profissao: string;
  estado_conta: 'ACTIVA'|'DESATIVADA'|'PENDENTE';
  created_at: Date;
  role:'ADMIN'|'PRESTADOR_INDIVIDUAL'|'PRESTADOR_COLECTIVO' |'CLIENTE_COLECTIVO'|'CLIENTE_INDIVIDUAL';
  image_path: string | undefined
  provincia: string;
  municipio: string;
  	carteira: {
				receita: string
			}
  nomeRepresentante: string | null;
  postsvitrineId: number | null;
  _count:{
    notificacoes:number
  }
  notificacoes: Notificacao[];
}

export interface GetUserProfileResponse {
  usuario: Usuario | null;
}

export async function GetUserProfile() {
  const response = await api.get<GetUserProfileResponse>("/me");
  return response.data.usuario;
}
