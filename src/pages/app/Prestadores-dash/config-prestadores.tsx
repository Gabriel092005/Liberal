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
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Loader2, MapPin, Settings, User } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import z from "zod"

const updateProfileSchema = z.object({
  nome: z.string().min(3, "Nome muito curto").nullable(),
  province: z.string().min(1, "Selecione uma província"),
  municipio: z.string().min(1, "Selecione um município"),
  celular: z.string().min(9, "Número inválido").nullable()
})

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>

export function Config() {
  const queryClient = useQueryClient()

  const { register, control, handleSubmit, watch, setValue, formState: { } } = useForm<UpdateProfileSchema>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      province: "Luanda",
    }
  })

  // Monitora a província selecionada para filtrar municípios
  const selectedProvince = watch("province")
  const municipalities = provinceMunicipalityMap[selectedProvince as keyof typeof provinceMunicipalityMap] || []

  const { mutateAsync: update, isPending } = useMutation({
    mutationFn: UpdateProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] })
      toast.success("Perfil atualizado com sucesso!")
    },
    onError: () => toast.error("Erro ao atualizar perfil.")
  })

  async function handleUpdateProfile(data: UpdateProfileSchema) {
    await update(data)
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto pb-10">
      {/* HEADER ESTRUTURADO */}
      <header className="flex items-center justify-between px-4 py-6 border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-md z-10">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-blue-500/10 rounded-2xl text-blue-600 dark:text-blue-400">
            <Settings size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black uppercase tracking-tight">Definições</h2>
            <p className="text-xs text-muted-foreground font-medium">Gerencie suas informações pessoais</p>
          </div>
        </div>
        <ModeToggle />
      </header>

      <form onSubmit={handleSubmit(handleUpdateProfile)} className="px-4 py-8 space-y-8">
        
        {/* SEÇÃO: INFORMAÇÕES BÁSICAS */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <User size={16} className="text-blue-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Identidade</span>
          </div>
          
          <div className="grid gap-4 bg-muted/30 p-5 rounded-[2rem] border border-border/50">
            <div className="space-y-2">
              <Label htmlFor="nome" className="text-xs font-bold ml-1 uppercase">Nome Completo</Label>
              <Input
                {...register('nome')}
                id="nome"
                placeholder="Ex: João Manuel"
                className="h-12 rounded-2xl bg-background border-none ring-1 ring-border focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="celular" className="text-xs font-bold ml-1 uppercase">Telefone (Angola)</Label>
              <div className="relative">
                <Input
                  {...register('celular')}
                  id="celular"
                  type="tel"
                  placeholder="9XX XXX XXX"
                  className="h-12 rounded-2xl bg-background border-none ring-1 ring-border pl-12 focus-visible:ring-2 focus-visible:ring-blue-500 transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground border-r pr-2 border-border">
                  +244
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* SEÇÃO: LOCALIZAÇÃO */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 mb-2 px-1">
            <MapPin size={16} className="text-orange-500" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Localização</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-muted/30 p-5 rounded-[2rem] border border-border/50">
            <div className="space-y-2">
              <Label className="text-xs font-bold ml-1 uppercase">Província</Label>
              <Controller
                control={control}
                name="province"
                render={({ field }) => (
                  <Select 
                    onValueChange={(val) => {
                      field.onChange(val)
                      setValue("municipio", "") // Reseta município ao trocar província
                    }} 
                    value={field.value}
                  >
                    <SelectTrigger className="h-12 rounded-2xl bg-background border-none ring-1 ring-border">
                      <SelectValue placeholder="Selecionar..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {Object.keys(provinceMunicipalityMap).map((prov) => (
                        <SelectItem key={prov} value={prov} className="rounded-xl">{prov}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-bold ml-1 uppercase">Município</Label>
              <Controller
                control={control}
                name="municipio"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value} disabled={!selectedProvince}>
                    <SelectTrigger className="h-12 rounded-2xl bg-background border-none ring-1 ring-border">
                      <SelectValue placeholder="Selecionar..." />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl">
                      {municipalities.map((mun) => (
                        <SelectItem key={mun} value={mun} className="rounded-xl">{mun}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>
        </section>

        {/* BOTÃO DE AÇÃO */}
        <div className="pt-4 px-1">
          <Button
            disabled={isPending}
            type="submit"
            className="w-full h-14 text-sm font-black uppercase tracking-[0.2em] rounded-[1.5rem] shadow-xl bg-blue-600 hover:bg-blue-700 transition-all active:scale-95 gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Salvando...
              </>
            ) : (
              "Guardar Alterações"
            )}
          </Button>
          <p className="text-[10px] text-center mt-4 text-muted-foreground uppercase font-bold tracking-tighter">
            Suas informações são armazenadas de forma segura.
          </p>
        </div>
      </form>
    </div>
  )
}