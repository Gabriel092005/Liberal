import { GetUserProfile } from "@/api/get-profile";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function LoadingPage(){
    const navigate = useNavigate()
      const { data: profile, isLoading: isLoadingUserProfile } = useQuery({
      queryKey: ["profile"],
      refetchOnWindowFocus: true,     // Rebusca ao voltar ao foco
      refetchOnReconnect: true,       // Rebusca se a internet voltar
      refetchOnMount: true,           // Rebusca sempre que o componente monta
      staleTime: 0,    
      queryFn: GetUserProfile,
      });
       if(profile?.role =='PRESTADOR_COLECTIVO' || profile?.role=='PRESTADOR_INDIVIDUAL'){
     navigate("/servicos")
  }

     if(profile?.role=='ADMIN'){
     navigate("/início")
  }

   useEffect(()=>{
    
        const interceptorId = api.interceptors.response.use(
          response=>response,
          error=>{
            if(isAxiosError(error)){
              
              const status = error.response?.status
              const code = error.response?.data.code
    
              if(status===401 || code==='UNAUTHORIZED'){
                navigate('/sign-in', {replace:true})
                toast.warning('Faça login novamente')
                // replace para nao permitir o usuario nao voltar a dashboard caso ele nao esteja autenticado
              }
            }
          }
        )
        return ()=>{
          api.interceptors.response.eject(interceptorId)
        }
        //interceptando as respostas http para redirecionar o usuario no componente de autenticação
      },[navigate])
  

 return(


         <div className="w-full p-36 h-full flex items-center justify-center">
                {isLoadingUserProfile && (
                     <div className="flex items-center justify-center">
                         <Loader2 className="text-orange-400 animate-spin"></Loader2>
                     </div>
                )}
        </div>
 )
}