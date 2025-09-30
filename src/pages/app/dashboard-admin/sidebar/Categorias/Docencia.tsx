
import servico5 from '@/assets/IMG-20250928-WA0059.jpg'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { ChevronRight} from 'lucide-react'
import { ServicoDialogContent } from '../ServicesDialogContent'

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
export function Docencia() {
  const [servicoSelecionado, setServicoSelecionado] = useState<string>('')
  return (
    <div className="relative -mx-10  w-[40rem] h-56 md:h-72 lg:h-96">
      {/* Imagem de capa */}
      <img
        className="w-full h-full object-cover"
        src={servico5}
        alt="Serviços de ensino"
      />
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 flex items-center right-56 justify-center">
        <h2 className="text-white text-xl font-bold">Professores</h2>
      </div>
      {/* Lista de serviços */}
      <div className="flex flex-col relative right-32 gap-3 mt-3 justify-center items-center">
    
        <ServicoButton
          nome="Inglês"
          selecionado={servicoSelecionado}
          onSelect={setServicoSelecionado}
        />
        <ServicoButton
          nome="Matemática"
          selecionado={servicoSelecionado}
          onSelect={setServicoSelecionado}
        />

          <ServicoButton
          nome="Lingua Portuguesa"
          selecionado={servicoSelecionado}
          onSelect={setServicoSelecionado}
        />
           <ServicoButton
          nome="Oratória & Retórica"
          selecionado={servicoSelecionado}
          onSelect={setServicoSelecionado}
        />
      </div>
    </div>
  )
}
