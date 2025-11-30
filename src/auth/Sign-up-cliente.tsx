import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { provinceMunicipalityMap } from "@/data/province";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signUp } from "@/api/sign-up";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { Role } from "./Role";
import { toast } from "sonner";
import { GetProfission } from "@/api/get-profissions";





export function SignUp() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate()

const registerBodySchema = z.object({
       nome : z.string(),
       celular : z.string(),
       nif : z.string(),
       palavraPasse: z.string(),
       profissao : z.string(),
       provincia : z.string(),
       municipio : z.string(),
       nomeRepresentante : z.string().optional(),
       phone:z.coerce.string().optional(),
       role:z.enum([Role.ADMIN,Role.CLIENTE_COLECTIVO,Role.CLIENTE_INDIVIDUAL,Role.PRESTADOR_COLECTIVO,Role.PRESTADOR_INDIVIDUAL])
    })
    type RegisterUsersBodySchema = z.infer< typeof registerBodySchema>

    const {register, control,handleSubmit} = useForm<RegisterUsersBodySchema>()


  const [photo, setPhoto] = useState<File | null>(null);

  const {data:profissao} = useQuery({
    queryKey:['profissao'],
    queryFn:GetProfission
  })
  

  // Animações de transição entre passos
  const variants = {
    enter: { x: 50, opacity: 0, scale: 0.95 },
    center: { x: 0, opacity: 1, scale: 1 },
    exit: { x: -50, opacity: 0, scale: 0.95 },
  };


  const {mutateAsync:Register} = useMutation({
    mutationFn:signUp
  })

  async function handleRegisterUsers(data:RegisterUsersBodySchema) {
    console.log(data)
    const {nome, celular,municipio,nif,palavraPasse,profissao,provincia,role,nomeRepresentante} = data
       Register({
        celular,
        image_path:photo,
        municipio,
        nif,
        nome,
        nomeRepresentante,
        palavraPasse,
        profissao,
        provincia,
        role
       })
        navigate("/sign-in")
       toast.success('usuario registado com sucesso')
  }

  
  if(!profissao){
    return
  }



  return (
    <>
      <Helmet title="Sign Up" />
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="w-full max-w-md flex flex-col items-center text-center gap-6">
          {/* Cabeçalho */}
          <div className="flex flex-col gap-1 -mt-40 lg:mt-0">
              {/* <Link to="/empresa">
                  <span className="text-muted-foreground relative left-36 bottom-1 text-xs" >
                    skip
                  </span>
                </Link> */}
            <div className="flex items-center justify-center">
             
              <h1 className="text-2xl font-semibold tracking-tight">Sign Up </h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Se  já tiver um conta activa pode simplesmente fazer <Link to='/sign-in' className="text-blue-300">login </Link>para ter aceder à sua conta
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit(handleRegisterUsers)} className="w-full text-left">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step1"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="fullname">Nome</Label>
                    <Input
                      id="fullname"
                       {...register('nome')}
                      placeholder="Nome (cliente / Empresa)"
                      required
                    />
                  </div>
                         <div className="space-y-2">
                    <Label className="font-semibold">Profissão / Área de Atuação</Label>
                   <Controller
                     name="profissao"
                     control={control}
                     render={({field:{name,onChange,value}})=>{
                       return(
                      <Select value={value} name={name} onValueChange={onChange}>
  <SelectTrigger className="h-10 w-full">
    <SelectValue placeholder="Selecione sua profissão" />
  </SelectTrigger>

  <SelectContent>
    {profissao.profissao
      ?.filter((p) => p.titulo && p.titulo.trim() !== "") // evita valores vazios
      .map((p) => (
        <SelectItem key={p.titulo} value={p.titulo}>
          {p.titulo}
        </SelectItem>
      ))}
  </SelectContent>
</Select>

                       )
                     }}
                   />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="nif">NIF</Label>
                    <Input
                    max={30}
                    min={1}
                      id="nif"
                       {...register('nif')}
                      placeholder="Número de Identificação Fiscal"
                      required
                    />
                  </div>

                     <div className="space-y-1">
                    <Label htmlFor="password">Palavra-Passe</Label>
                    <Input
                      id="password"
                       {...register('palavraPasse')}
                      placeholder="Palavra Passe"
                      type="password"
                      max={12}
                      min={6}
                      required
                    />
                  </div>

                       <div className="space-y-1">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"

                      {...register('celular')}
                        type="text"
                            placeholder="Telefone"
                            required
                            maxLength={9} // Limita a 9 caracteres (apenas números)
                            pattern="9\d{8}" // Valida números de telefone de Angola (deve começar com 9 seguido de 8 dígitos)
                            title="Número de telefone inválido. Deve começar com 9, seguido de 8 dígitos."
                            onInput={(e) => {
                                const input = e.target as HTMLInputElement;
                                let value = input.value.replace(/\D/g, ''); // Remove tudo que não for número
                                if (value.length > 9) value = value.slice(0, 9); // Limita a 9 números
                                input.value = value;
                            }}

                    />
                  </div>

                  <Button
                    className="w-full"
                    type="button"
                    onClick={() => setStep(2)}
                  >
                    Próximo
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="space-y-4"
                >
                  {/* Província */}
                  <div className="space-y-2">
                    <Label>Província</Label>
                  <Controller
                    control={control}
                    name="provincia"
                    render={({field:{value,onChange,name}})=>{
                      return(
                    <Select value={value} onValueChange={onChange} name={name} >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a província" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(provinceMunicipalityMap).map((prov) => (
                          <SelectItem key={prov} value={prov}>
                            {prov}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                      )
                    }}
                  />
                  </div>

                  {/* Município */}
                  <div className="space-y-2">
                    <Label>Município</Label>
                 <Controller
  control={control}
  name="municipio"
  render={({ field: { name, onChange, value } }) => (
    <Select
      value={value}
      onValueChange={onChange}
      name={name}
    >
      <SelectTrigger>
        <SelectValue placeholder="Selecione o município" />
      </SelectTrigger>
      <SelectContent className="max-h-48 overflow-y-auto">
          <SelectItem value="Viana">Viana</SelectItem>
      </SelectContent>
    </Select>
  )}
/>


              
      
                  </div>

                  <div className="space-y-2">
                    <Label>Categoría</Label>
                     <Controller
                       control={control}
                       name="role"
                       render={({field:{name,onChange,value}})=>{
                          return(
                            <Select value={value} onValueChange={onChange} name={name}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CLIENTE_INDIVIDUAL">Cliente Individual</SelectItem>
                        <SelectItem value="CLIENTE_COLECTIVO">Cliente Colectivo</SelectItem>
                        <SelectItem value="PRESTADOR_COLECTIVO">Prestador Empresa</SelectItem>
                        <SelectItem value="PRESTADOR_INDIVIDUAL">Prestador Individual</SelectItem>
                      </SelectContent>
                    </Select>
                          )
                       }}
                       
                     />
                  </div>

                  {/* Foto */}
                  <div className="space-y-2">
                    <Label htmlFor="foto">Foto/Logotipo (opcional)</Label>
                    <Input
                      id="foto"
                      type="file"
                      onChange={(e) =>
                        setPhoto(e.target.files ? e.target.files[0] : null)
                      }
                      className="cursor-pointer"
                    />
                  </div>

                    <div className="space-y-2">
                    <Label htmlFor="fullname">Representante Legal (opcional)</Label>
                    <Input
                      id="fullname"
                      {...register('nomeRepresentante')}
                      placeholder="Nome do cliente / Empresa"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-1/2"
                      onClick={() => setStep(1)}
                    >
                      Voltar
                    </Button>
                
                     <Button className="w-56" type="submit">
                       Registar
                    </Button>
               
                   
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        {/* <span className="text-muted-foreground text-xs">Para se registar na plataforma como prestador de serviços (individual/Empresa)  clica em <Link to='/empresa' className="text-blue-300">skip.</Link></span> */}
        </div>
      </div>
    </>
  );
}
