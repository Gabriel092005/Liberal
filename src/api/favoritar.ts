import { api } from "@/lib/axios";


export async function Favoritar({prestadorId}:{prestadorId:number}) {
      console.log("chegueiii")
      const response = await api.post("/favoritar", {prestadorId})
      return response.data
}