import { GetCarteira } from "@/api/get-carteira";
import { GetUserProfile } from "@/api/get-profile";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { HomeContent } from "./home-content";
import { SkeletonsCard } from "./prestadores-home-skeletons/creditcard-skeletons";
import { TableSkeletons } from "./prestadores-home-skeletons/table-sketons";

export function PrestadoresDash() {
 
  
  const navigate = useNavigate();

  // const {data} = useQuery({
  //   queryKey:['carteira1'],
  //   queryFn:useHistoricoCarteira
  // })

  const { data: profile, isLoading: isLoadingUserProfile} = useQuery({
    queryKey: ["profile"],
    queryFn: GetUserProfile,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    refetchOnMount: true,
    staleTime: 0,
  });

  //  const { data: vitrine} = useQuery({
  //   queryKey: ["vitrine"],
  //   queryFn: FetchPostsVitrine,
  //   refetchOnWindowFocus: true,
  //   refetchOnReconnect: true,
  //   refetchOnMount: true,
  //   staleTime: 0,
  // });
  
  const { data: carteira } = useQuery({
    queryKey: ["carteira"],
    queryFn: GetCarteira,
  });
  // const carteiraId = localStorage.getItem("carteiraId")
  
  // const { data:historico } = useQuery({
  //   queryKey:['historico'],
  //   queryFn:()=>GetHistorico({carteiraId:Number(carteiraId)})
  // })
  // 🔔 Configura som

  if(profile?.role =='CLIENTE_INDIVIDUAL' || profile?.role=='CLIENTE_COLECTIVO'){
     navigate("/")
  }

     if(profile?.role =='ADMIN'){
     navigate("/início")
  }    



if (isLoadingUserProfile) {
  return (
    <div className="flex flex-col h-screen w-full items-center mr-1 justify-center gap-4 p-6">
         <div className="flex justify-center ">
            <SkeletonsCard></SkeletonsCard>
         </div>
         <div>
          <TableSkeletons></TableSkeletons>
         </div>
       {/* <SkeletonsDemo></SkeletonsDemo>
       <SkeletonsDemo></SkeletonsDemo>
       <SkeletonsDemo></SkeletonsDemo> */}
    </div>
  );
}



  if (!profile || !carteira) return null;

  return (
    <div className="flex flex-col h-screen w-full left-[0.1rem] fixed overflow-hidden bg-background text-foreground">
      <motion.div
        className="flex flex-col flex-1 px-4 py-4 gap-4 items-center justify-center pb-20"
        initial={{ x: "-100%", opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        {/* HEADER */}
  
<HomeContent></HomeContent>
      </motion.div>
    </div>
  );
}

// 🔸 Componente de botão auxiliar (para evitar repetição)
// function ActionButton({ icon, label }: { icon: React.ReactNode; label: string }) {
//   return (
//     <div className="flex flex-col items-center">
//       <Button
//         variant="ghost"
//         className="relative rounded-full h-11 w-11 flex items-center justify-center hover:bg-orange-50 dark:bg-zinc-900"
//       >
//         {icon}
//       </Button>
//       <span className="text-xs font-bold text-muted-foreground">{label}</span>
//     </div>
//   );
// }
