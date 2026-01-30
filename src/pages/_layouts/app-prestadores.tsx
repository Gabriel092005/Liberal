import { GetUserProfile } from "@/api/get-profile";
import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Navigation } from "../app/Prestadores-dash/Navigation";



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
  if(profile) localStorage.setItem("@liberal:userId", String(profile.id))
  return(
    <div className="h-[100dvh] w-full bg-background flex flex-col overflow-hidden antialiased select-none">
      
    {/* AREA DE CONTEUDO CENTRALIZADA */}
    <div className="flex-1 w-full flex justify-center overflow-hidden">
      {/* max-w-7xl impede que o conteúdo espalhe demais em telas grandes */}
      <main className="w-full max-w-7xl h-full  flex flex-col relative px-0">
        <Outlet />
      </main>
    </div>

    {/* NAVEGAÇÃO INFERIOR COM SUPORTE A IPHONE (Safe Area) */}
    {/* <footer className="flex-none w-full border-t bg-background/95 backdrop-blur-xl z-[100] flex justify-center pb-[env(safe-area-inset-bottom)]"> */}
      <div className="w-full max-w-7xl px-4 h-16 flex items-center justify-center">
        <Navigation />
      </div>
    {/* </footer> */}
  </div>

  )

}











