import { api } from "@/lib/axios"
import { redirect} from "react-router-dom"


interface SignInRequest{
     phone:string
     password:string
}
interface SignInResponse{
    token:string
    role:'ADMIN'|'PRESTADOR_INDIVIDUAL'|'PRESTADOR_COLECTIVO' |'CLIENTE_COLECTIVO'|'CLIENTE_INDIVIDUAL';
    
}

export async function signIn({password,phone}:SignInRequest) {
    
      try {
          const response  = await api.post<SignInResponse>("/sessions",{password, phone})
          console.log(response.data.role)

     const  token  = response.data.token
     document.cookie=`token=${token}; Secure; SameSite=Lax; Path=/`;  

     if(response.data.role==='ADMIN'){
         redirect("/início")
     }

     if(response.data.role==='CLIENTE_COLECTIVO' || response.data.role=='CLIENTE_INDIVIDUAL'){
         redirect("/")
     }

         if(response.data.role==='PRESTADOR_COLECTIVO' || response.data.role=='PRESTADOR_INDIVIDUAL'){
         redirect("/servicos")
     }else{
         redirect("/sign-in")
     }

    
     return response.data
      } catch (error) {
         

          
      }
}