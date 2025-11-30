import { Button } from "@/components/ui/button"
import { Pencil, MapPin,LogOut,Phone,Briefcase} from "lucide-react"
import { api } from "@/lib/axios"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { GetUserProfile } from "@/api/get-profile"
import { Logout } from "@/api/log-out"
import { Link } from "react-router-dom"
import { useForm } from "react-hook-form"
import z from "zod"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { EditarBio } from "@/api/editar-bio"
import { Config } from "./app/Prestadores-dash/config-prestadores"

export function Profile() {

  const queryClient = useQueryClient()

  const { data: profile} = useQuery({
    queryKey: ["profile"],
    refetchOnWindowFocus: true,     // Rebusca ao voltar ao foco
    refetchOnReconnect: true,       // Rebusca se a internet voltar
    refetchOnMount: true,           // Rebusca sempre que o componente monta
    staleTime: 0,    
    queryFn: GetUserProfile,
    });
  
    const {mutateAsync:Sair} = useMutation({
      mutationFn:Logout
    })
 

        const editarBioBodySchema = z.object({
       description:z.string()
    })

    type EditarBodySchemaTypes = z.infer< typeof editarBioBodySchema>
    
    const {register:registar, handleSubmit:submeter} = useForm<EditarBodySchemaTypes>()

    const {mutateAsync:salvar, isPending} = useMutation({
      mutationFn:EditarBio,
        onMutate: async (newDescription) => {
      // 👇 Atualização otimista (reage instantaneamente)
      await queryClient.cancelQueries({ queryKey: ["profile"] })

      const previousData = queryClient.getQueryData<{ description: string }>(["profile"])

      queryClient.setQueryData(["bio"], { description: newDescription })

      return { previousData }
    },
   
    onSettled: () => {
      // 👇 Garante que sincroniza com o backend depois
      queryClient.invalidateQueries({ queryKey: ["profile"] })
    },

    })

    async function  handleEditarBio(data:EditarBodySchemaTypes) {
        const {description} = data
        salvar({
          description
        })
    }
    
    // const {handleSubmit, formState, register} = useForm<PromoverPerfilBodySchemaTypes>()
  
    // async function handleCreateNewPostsVitrine(data:PromoverPerfilBodySchemaTypes) {
    //      try {
    //        const {
    //       title,
    //       description
    //     } = data
  
    //     await Promover({
    //       description,
    //       title
    //     })
          
    //      } catch (error) {
          
    //      }
      
    // }
  
    async function handleSignOut(){
      await Sair()
      
    }
  return (
    <div className="min-h-screen h-full w-full right-5 relative dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      {/* Foto de capa */}
  
       <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex justify-center relative -left-5 -top-14 items-center min-h-screen  dark:from-slate-900 dark:to-slate-800"
        >
          <Card className="w-full max-w-md border border-gray-200 dark:border-slate-700 rounded-2xl shadow-lg overflow-hidden backdrop-blur-sm">
            <div className="relative">
              {/* Capa */}
              <div className="h-40 md:h-48 w-full">
                <img
                 src={`${api.defaults.baseURL}/uploads/${profile?.image_path}`}
                  alt="Capa do perfil"
                  className="w-full h-full object-cover"
                />
              </div>
    
              {/* Foto de perfil */}
              <motion.img
                src={`${api.defaults.baseURL}/uploads/${profile?.image_path}`}
                alt="Foto de perfil"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 w-28 h-28 rounded-full border-4 border-white dark:border-slate-800 shadow-xl object-cover"
              />
            </div>
    
            {/* Conteúdo */}
            <CardContent className="mt-16 w-[22rem] text-center px-6 pb-6">
        
              
    
              {/* Ações */}
              <div className="flex flex-col sm:flex-row justify-center gap-3 mt-5">
             
                <Dialog>
                    <DialogTrigger asChild>
                                  <Button
                    variant="default"
                    className="flex items-center justify-center gap-2 w-full sm:w-auto  text-white font-medium transition-all duration-200"
                  >
                    <Pencil size={18} />
                    Editar Perfil
                  </Button>
                    </DialogTrigger>
                    <DialogContent className="h-full">
                      <Config></Config>
                    </DialogContent>
                </Dialog>
                
               
              </div>
    
              {/* Sobre mim */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 text-left"
              >
                <h3 className="font-semibold text-base text-gray-900 dark:text-white mb-2">
                  Sobre mim
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                       <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {profile?.nome}
              </h2>
              <div className="flex items-center ">
                <MapPin className="text-muted-foreground text-red-500 size-5"></MapPin>
                 <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  {profile?.provincia} | {profile?.municipio} 
              </p>
              </div>
               <div className="flex items-center ">
                <Phone className=" text-blue-500 size-5"></Phone>
                 <p className="  dark:text-gray-400 text-sm mt-1">
                  +244 {profile?.celular}  
              </p>
              </div>
    
               <div className="flex items-center ">
                <Briefcase className="text-muted-foreground size-5"></Briefcase>
                 <p className="text-gray-500 lowercase dark:text-gray-400 text-sm mt-1">
                  @{profile?.role}
              </p>

               
 
              </div>
              <Accordion type="single">
                  <AccordionItem value="Mais">
                  <AccordionTrigger>Ver mais</AccordionTrigger>
                   <AccordionContent>
                    <Dialog>
                       <DialogTrigger className="flex items-center justify-center gap-3">
                             {profile?.description}
                             <Pencil className="text-muted-foreground" size={14}></Pencil>
                       </DialogTrigger>
                       <DialogContent>
                        <DialogHeader className="flex">
                           <div className="flex flex-col justify-start items-start">
                               <DialogTitle className="">Editar</DialogTitle>
                            <DialogDescription>Edite sua bio, para ter um perfil mais aceitavel</DialogDescription>
                           </div>
                        </DialogHeader>
                        <form className="flex gap-2 flex-col" onSubmit={submeter(handleEditarBio)}>
                                          <Textarea {...registar('description')} placeholder={`${profile?.description}`}></Textarea>
                                           <Button disabled={isPending} type="submit" variant='default'>Salvar</Button>
                        </form>
                  
                       </DialogContent>
                    </Dialog>
                   </AccordionContent>
                  </AccordionItem>
              </Accordion>
                </p>
              </motion.div>

        
           <div className="flex  gap-4 mt-3">
        <Link to='/sign-in'>
           <Button onClick={handleSignOut} className="text-red-500" variant='outline'>
             <LogOut></LogOut>
             <span>Sair</span>
          </Button></Link>
           </div>
        
      
            </CardContent>
          </Card>
        </motion.div>
    </div>
  )
}
