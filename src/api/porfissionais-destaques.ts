import { api } from "@/lib/axios";
interface UsuarioDestaque {
  id:number
  nome: string;
  estrelas: number | null;
  profissao: string;
  provincia: string;
  role: string;
  image_path?: string | null;
  municipio: string;
  celular: string;
}

interface FetchPrestadoresDestaquesResponse{
      usuarios:UsuarioDestaque[]
}

export  async function PrestadoresDestaques(){
    const response = await api.get<FetchPrestadoresDestaquesResponse>("/destaques")
    return response.data
}