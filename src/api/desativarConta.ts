import { api } from "@/lib/axios";

export async function DesativarConta({Id}:{Id:number}) {
    await api.post("/desativarConta", {Id})
}