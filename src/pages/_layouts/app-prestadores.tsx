import { Outlet, useNavigate } from "react-router-dom";
import { BottomNavPrestadores } from "../app/Prestadores-dash/BottomNavPrestadores";
import { useQuery } from "@tanstack/react-query";
import { GetUserProfile } from "@/api/get-profile";
import { useEffect } from "react";
import { api } from "@/lib/axios";
import { isAxiosError } from "axios";
import { toast } from "sonner";

export  function AppLayoutPestadores(){
  const navigate = useNavigate();

        const { data: profile } = useQuery({
        queryKey: ["profile"],
        refetchOnWindowFocus: true,     // Rebusca ao voltar ao foco
        refetchOnReconnect: true,       // Rebusca se a internet voltar
        refetchOnMount: true,           // Rebusca sempre que o componente monta
        staleTime: 0,    
        queryFn: GetUserProfile,
        });

          if(profile?.role =='CLIENTE_COLECTIVO' || profile?.role=='CLIENTE_INDIVIDUAL'){
     navigate("/")
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
            }
            else if(status==406 || code==="Not Acceptable"){
              toast.error("Saldo insuficiente precisa no minímo de 1000kz")
            }
          }
        }
      )
      return ()=>{
        api.interceptors.response.eject(interceptorId)
      }
      //interceptando as respostas http para redirecionar o usuario no componente de autenticação
    },[navigate])
     
          
  // if(profile?.estado_conta ==='DESATIVADA') navigate('/home')

   if(profile?.estado_conta ==='DESATIVADA' || profile?.estado_conta==='PENDENTE'){
     navigate("/home")
  }
  
  return(
    <div className="flex min-h-screen fixed     antialiased ">
         <div className="flex ml-[40px]    flex-1 flex-col ">
        <BottomNavPrestadores/>
        <Outlet/>
      </div>
    </div>
  )

}