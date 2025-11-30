import { api } from "@/lib/axios";


export async function SuspenderConta({Id}:{Id:number}) {
    await api.post("/suspenderConta", {Id})
}