   import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
    import { useUserLocation } from "./location-services"
    import { MapPinX } from "lucide-react"
    import * as FileInput from '@/pages/app/dashboard-admin/sidebar/FileInput'
    import { Skeleton } from "@/components/ui/skeleton"
    import { Button } from "@/components/ui/button"
    import { DialogContent } from "@/components/ui/dialog"
    
    export function FastFazerPedido() {
      const { place, loading } = useUserLocation()
    
      return (
        <DialogContent className="flex flex-col gap-3">
          <header className="font-bold text-lg"></header>
            <div>
                  <h1 className="font-bold">Pedidos</h1>
                  <span>Encontre profissionais de qualidade</span>
            </div>
             <div className="flex gap-2">
                   <Select>
            <SelectTrigger>
                <SelectValue placeholder='Categoria'></SelectValue>
            </SelectTrigger>
            <SelectContent>
                   <SelectItem value="engenheiro">Engenheiro</SelectItem>
                        <SelectItem value="medico">Médico</SelectItem>
                        <SelectItem value="professor">Professor</SelectItem>
                        <SelectItem value="advogado">Advogado</SelectItem>
                        <SelectItem value="contabilista">Contabilista</SelectItem>
                        <SelectItem value="enfermeiro">Enfermeiro</SelectItem>
                        <SelectItem value="motorista">Motorista</SelectItem>
                        <SelectItem value="pedreiro">Pedreiro</SelectItem>
                        <SelectItem value="eletricista">Eletricista</SelectItem>
                        <SelectItem value="carpinteiro">Carpinteiro</SelectItem>
                        <SelectItem value="serralheiro">Serralheiro</SelectItem>
                        <SelectItem value="cozinheiro">Cozinheiro</SelectItem>
                        <SelectItem value="estudante">Estudante</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
            </SelectContent>
          </Select>
             <Select>
            <SelectTrigger>
                <SelectValue placeholder='Brevidade'></SelectValue>
            </SelectTrigger>
            <SelectContent>
               <SelectItem value='URGENTE'>URGENTE</SelectItem>
               <SelectItem value='MEDIA'>MEDIA</SelectItem>
            </SelectContent>
          </Select>
             </div>

          
    
          <div className="flex items-center gap-2">
            <MapPinX className="text-red-400" />
            <span>
              {loading ? (
                <Skeleton className="w-32 h-4" />
              ) : (
                <span>
                  {place?.city},{place?.country},{place?.district} {place?.neighbourhood}
                </span>
              )}
            </span>
          </div>
    
          <textarea
            placeholder="Descrição do serviço que pretende"
            className="dark:bg-gray-950 p-2 rounded-md"
          />
                <FileInput.Root  >
                            <FileInput.Trigger />
                            <FileInput.FileList/>
                            <FileInput.Control multiple />
                </FileInput.Root>
          <Button className="self-start">Solicitar profissional</Button>
        </DialogContent>
      )
    }
