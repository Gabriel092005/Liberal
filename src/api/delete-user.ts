import { api } from "@/lib/axios"

interface DeleteUserRequest {
     userId:string
}

export async function Delete({userId}:DeleteUserRequest){
      await api.post(`/usuario/delete/${userId}`)
}