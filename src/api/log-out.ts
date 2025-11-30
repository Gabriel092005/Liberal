import { api } from "@/lib/axios"
import { redirect } from "react-router-dom"


export async function Logout(){
await api.post('/log-out')
redirect("/sign-in")
}