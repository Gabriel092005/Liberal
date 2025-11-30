import { api } from "@/lib/axios";


export async function AtivarConta({Id}:{Id:number}) {
 console.log("id:",Id)
    await api.post("/ativarConta", {Id})
}