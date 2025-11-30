import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import z from "zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signIn } from "@/api/sign-in";
import { toast } from "sonner";
import { GetUserProfile } from "@/api/get-profile";
import { Loader } from "lucide-react";


export function SignIn() {
  const signInBodySchema = z.object({
     phone:z.string(),
     password:z.string()
  })

  type SignInBodySchemaTypes = z.infer< typeof signInBodySchema>

  const {register, reset, handleSubmit} = useForm<SignInBodySchemaTypes>()
  const navigate = useNavigate()

  const {mutateAsync:authenticate,isPending,data} = useMutation({
    mutationFn:signIn,
    onError(_,) {
              toast.error("oops, credencials inválidas")
    },
    onSuccess(){
       navigate("/loading")
    }
  })

    const {data:profile}=useQuery({
    queryKey:['profile'],
    queryFn:GetUserProfile
  })


  if(data?.role==="ADMIN"){
      navigate("/início")
    }
        if(data?.role==="CLIENTE_COLECTIVO" || data?.role=='CLIENTE_INDIVIDUAL'){
      navigate("/")
    }

         if(data?.role==="PRESTADOR_COLECTIVO" || data?.role=='PRESTADOR_INDIVIDUAL'){
      navigate("/servicos")
    }

   
async function handleSignIn(data: SignInBodySchemaTypes) {
  const { phone, password } = data

  try {
    await authenticate({ phone, password }) // aguarda o login terminar

    if(data){
       const updatedProfile = profile // busca o perfil manualmente após login

    if (updatedProfile?.role === "ADMIN") {
      navigate('/Início')
    } else if (
      updatedProfile?.role === 'CLIENTE_INDIVIDUAL' ||
      updatedProfile?.role === 'CLIENTE_COLECTIVO'
    ) {
      navigate('/')
    } else if(updatedProfile?.role === 'PRESTADOR_INDIVIDUAL' || updatedProfile?.role==='PRESTADOR_COLECTIVO') { 
      navigate('/servicos')
    }
    }



    reset()
  } catch (error) {
    toast.error("Oops, credenciais inválidas")
  }
}

   

   const variants = {
    enter: { x: 50, opacity: 0, scale: 0.95 },
    center: { x: 0, opacity: 1, scale: 1 },
    exit: { x: -50, opacity: 0, scale: 0.95 },
  };

  return (
    <>
      <Helmet title="Login" />
      <div className="p-8">
        <div className="w-[350px] flex flex-col justify-center gap-6">
          <div className="flex flex-col gap-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">Acessar Painel</h1>
            <p className="text-sm text-muted-foreground">
             Conecte-se a Liberal : Conectá-se a Liberal onde prestadores e clientes se encontram para crescer juntos .
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit(handleSignIn)} >
               <motion.div
                              key="step1"
                              variants={variants}
                              initial="enter"
                              animate="center"
                              exit="exit"
                              transition={{ duration: 0.5, ease: "easeInOut" }}
                              className="space-y-4"
                            >
            <div>
              <Label htmlFor="">Palavra Passe</Label>
              <Input {...register('password')} placeholder="Palavra-Passe"></Input>
            </div>
              <div>
              <Label htmlFor="">Phone</Label>
              <Input {...register('phone')} placeholder="+244 952 xxx xxx"></Input>
            </div>
               {/* <Link to='/loading'> */}
                <Button className="flex flex-1 w-full mt-4" variant='default'>Acessar
                   {isPending && <>
                     <Loader className="animate-spin"></Loader>
                   </>}
                </Button>
               {/* </Link> */}
                          </motion.div>
                   
          </form>
          <span className="text-muted-foreground text-xs">Se já tiver uma conta deve <Link className="border-b border-solid text-blue-400" to='/sign-up'>registrar-se</Link> primeiro para poder navegar normalmente e obter oportunidades.</span>
        </div>
      </div>
    </>
  );
}

