import { api } from "@/lib/axios"

interface CommentarPrestadoresRequest{
    content:string
    userId:Number
}

export async function Commentar({content,userId}:CommentarPrestadoresRequest){
     await api.post("/commentar", {content, userId}) 
}