import servicoBeleza from '@/assets/IMG-20250928-WA0058.jpg' // 🔹 coloque a imagem certa aqui
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ChevronRight, MapPinX } from 'lucide-react'
import { useUserLocation } from './location-services'
import { Skeleton } from '@/components/ui/skeleton'

type ServicoButtonProps = {
  nome: string
  selecionado: string
  onSelect: (nome: string) => void
}

function ServicoButton({ nome, selecionado, onSelect }: ServicoButtonProps) {
  return (
    <Dialog>
      <DialogTrigger onClick={() => onSelect(nome)}>
        <Button variant="outline" className="w-80 flex justify-between">
          <span className="text-orange-600">{nome}</span>
          <ChevronRight className="text-orange-600" />
        </Button>
      </DialogTrigger>

      <DialogContent>
        <ServicoDialogContent nome={selecionado} />
      </DialogContent>
    </Dialog>
  )
}

function ServicoDialogContent({ nome }: { nome: string }) {
  const { place, loading } = useUserLocation()

  return (
    <div className="flex flex-col gap-3">
      <header className="font-bold text-lg">Tipo de Serviço</header>
      <span className="text-muted-foreground">{nome}</span>

      <div className="flex items-center gap-2">
        <MapPinX className="text-red-400" />
        <span>
          {loading ? (
            <Skeleton className="w-32 h-4" />
          ) : (
            <span>
              {place?.district}, {place?.neighbourhood}
            </span>
          )}
        </span>
      </div>

      <textarea
        placeholder="Descrição do serviço que pretende"
        className="bg-gray-950 p-2 rounded-md"
      />
      <Button className="self-start">Solicitar</Button>
    </div>
  )
}

export function BelezaModa() {
  const [servicoSelecionado, setServicoSelecionado] = useState<string>('')

  return (
    <div className="relative -mx-10 w-[40rem] h-56 md:h-72 lg:h-96">
      {/* Imagem de capa */}
      <img
        className="w-full h-full object-cover"
        src={servicoBeleza}
        alt="Beleza & Moda"
      />

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Texto centralizado */}
      <div className="absolute inset-0 flex items-center right-56 justify-center">
        <h2 className="text-white text-xl font-bold">Beleza & Moda</h2>
      </div>

      {/* Lista de serviços */}
      <div className="flex flex-col relative right-32 gap-3 mt-3 justify-center items-center">
        <ServicoButton
          nome="Cabeleireiro"
          selecionado={servicoSelecionado}
          onSelect={setServicoSelecionado}
        />
        <ServicoButton
          nome="Manicure & Pedicure"
          selecionado={servicoSelecionado}
          onSelect={setServicoSelecionado}
        />
        <ServicoButton
          nome="Maquiadora"
          selecionado={servicoSelecionado}
          onSelect={setServicoSelecionado}
        />
        <ServicoButton
          nome="Costureira & Estilista"
          selecionado={servicoSelecionado}
          onSelect={setServicoSelecionado}
        />
      </div>
    </div>
  )
}
