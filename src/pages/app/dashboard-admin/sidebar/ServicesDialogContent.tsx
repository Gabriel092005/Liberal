import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUserLocation } from "./location-services"
import { MapPinX } from "lucide-react"
import * as FileInput from '@/pages/app/dashboard-admin/sidebar/FileInput'
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"

export function ServicoDialogContent({ nome }: { nome: string|null }) {
  const { place, loading } = useUserLocation()

  return (
    <div className="flex flex-col gap-3">
      <header className="font-bold text-lg">Tipo de Serviço</header>
      <span className="text-muted-foreground">{nome}</span>
      <Select>
        <SelectTrigger>
            <SelectValue placeholder='Brevidade'></SelectValue>
        </SelectTrigger>
        <SelectContent>
           <SelectItem value='URGENTE'>URGENTE</SelectItem>
           <SelectItem value='MEDIA'>MEDIA</SelectItem>
        </SelectContent>
      </Select>

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
      <Button className="self-start">Solicitar</Button>
    </div>
  )
}