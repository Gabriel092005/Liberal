import { UpdateProfile } from "@/api/update-profile"
import { ModeToggle } from "@/components/theme/theme-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { provinceMunicipalityMap } from "@/data/province"
import { useMutation } from "@tanstack/react-query"
import { Settings } from "lucide-react"
import { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"
export function Config() {

  const [municipalities] = useState<string[]>(
    provinceMunicipalityMap["Luanda"]
  )


    const updateProfileSchema = z.object({
      nome:z.string().nullable(),
      province:z.string().optional(),
      municipio:z.string().optional(),
      celular:z.string().nullable()
  })
  const {mutateAsync:update} = useMutation({
    mutationFn:UpdateProfile,
    onSuccess(_, ) {
       toast.success("perfil atualizado com sucesso")
    },
  })
  type UpdateProfileSchema = z.infer< typeof updateProfileSchema>
  const {register, control, reset, handleSubmit}= useForm<UpdateProfileSchema>()
   async function handleUpdateProfile(data:UpdateProfileSchema) {
       const {celular,nome,municipio,province,} = data
       update({
        celular,
        municipio,
        nome,
        province
       })
       reset()
   }

  return (
    <>
 <header className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-full">
            <Settings className="text-primary" />
          </div>
          <span className="text-lg sm:text-xl font-semibold">
            Configurações
          </span>
        </div>
        <ModeToggle />
      </header>
     <form onSubmit={handleSubmit(handleUpdateProfile)} className="flex flex-col min-h-screen -px-20 py-6 mt-4 sm:px-8 bg-background">
      {/* Header */}
      {/* Form Section */}
      <div className="flex flex-col gap-5 sm:gap-6 bg-muted/40 p-2 w-72 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col gap-2">
          <Label>Nome</Label>
          <Input
          {...register('nome')}
            type="text"
            placeholder="Seu nome completo"
            className="h-10 rounded-xl"
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label>Telefone</Label>
          <Input
          {...register('celular')}
            type="number"
            placeholder="Ex: 923 456 789"
            className="h-10 rounded-xl"
          />
        </div>

        {/* <div className="space-y-2">
          <Label className="font-semibold">Profissão / Área de Atuação</Label>
          <Select>
            <SelectTrigger className="h-10 w-full rounded-xl">
              <SelectValue placeholder="Selecione sua profissão" />
            </SelectTrigger>
            <SelectContent>
              {[
                "Engenheiro",
                "Médico",
                "Professor",
                "Advogado",
                "Contabilista",
                "Enfermeiro",
                "Motorista",
                "Pedreiro",
                "Eletricista",
                "Carpinteiro",
                "Serralheiro",
                "Cozinheiro",
                "Estudante",
                "Outro",
              ].map((p) => (
                <SelectItem key={p} value={p.toLowerCase()}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div> */}

        <div className="space-y-2">
          <Label>Província</Label>
           <Controller
           control={control}
           name="province"
           render={({field:{name,onChange,value}})=>{
               return(
                    <Select value={value} name={name} onValueChange={onChange} >
            <SelectTrigger className="h-10 w-full rounded-xl">
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

        <div className="space-y-2">
          <Label>Município</Label>
          <Controller
          control={control}
          name="municipio"
          render={({field:{name,onChange,value}})=>{
            return(
                   <Select value={value} onValueChange={onChange} name={name}>
            <SelectTrigger className="h-10 w-full rounded-xl">
              <SelectValue placeholder="Selecione o município" />
            </SelectTrigger>
            <SelectContent>
              {municipalities.map((mun) => (
                <SelectItem key={mun} value={mun}>
                  {mun}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
            )
          }}
          />
        </div>

    
      </div>

              <div className="mt-5 relative top-1 sm:mt-8">
        <Button
          variant="default"
          type="submit"
          className="w-full h-11 text-base font-medium rounded-xl shadow-md sm:w-auto sm:px-10"
        >
          Salvar Alterações
        </Button>
      </div>

      {/* Footer - botão fixo em telas pequenas */}
  
    </form>
    </>
   
  )
}
