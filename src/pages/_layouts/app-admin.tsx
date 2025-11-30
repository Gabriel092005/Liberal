
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/lib/axios";
import { useEffect } from "react";
import { isAxiosError } from "axios";
import { TopHeader } from "../app/dashboard-admin/sidebar/top-header";
import { GetUserProfile } from "@/api/get-profile";
import { useQuery } from "@tanstack/react-query";



export  function AppLayoutAdmin(){
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
         navigate("/servicos")
      }
    
                 if(profile?.role =='PRESTADOR_COLECTIVO' || profile?.role=='PRESTADOR_INDIVIDUAL'){
         navigate("/servicos")
      }
      //    if(profile?.role=='ADMIN'){
      //    navigate("/início")
      // }
    

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
    <div className="flex min-h-screen fixed  w-full right-5   antialiased ">
      <TopHeader></TopHeader>
         <div className="flex ml-[40px]    flex-1 flex-col ">
          {/* <Header></Header> */}
        <Outlet/>
      </div>
    </div>
  )

}