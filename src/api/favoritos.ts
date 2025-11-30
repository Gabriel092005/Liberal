import { api } from "@/lib/axios";

export interface UsuarioFavorito {
  id: number;
  nome: string;
  celular: string;
  profissao: string;
  image_path: string | null;
  provincia: string;
  municipio: string;
}

export interface FavoritoCustom {
  id: number;
  created_at: string; // melhor usar string, pois vem do JSON
  prestador: UsuarioFavorito;
}

interface FetchFavoritosResponse {
  favoritos: FavoritoCustom[];
}
interface FetchFavoritosRequest{
    search:string|undefined
}

export async function FetchFavoritos({search}:FetchFavoritosRequest){
    console.log(search)
  const response = await api.get<FetchFavoritosResponse>("/fetch/",{
    params:{
        search:search
    }
  }); // ✅ endpoint correto
  return response.data.favoritos; // ✅ acessa o array dentro do objeto
}
