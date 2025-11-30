import servico1 from '@/assets/IMG-20250928-WA0054.jpg'
import { Button } from '@/components/ui/button'
import { Dialog,DialogTrigger } from '@/components/ui/dialog'
import { ChevronRight} from 'lucide-react'
import { useState } from 'react'
import { FastFazerPedido } from '../DialogFastPrestadoresPedido'


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

        <FastFazerPedido selecionado={selecionado} />
    </Dialog>
  )
}



export function Electricidade() {
  const [servicoSelecionado, setServicoSelecionado] = useState<string>('')

  const servicos = [
    'Electricista',
    'Radiotécnico',
    'Técnico de Frio & Climatização',
    'Mecânico Auto',
  ]

  return (
    <div className="relative -mx-10 w-[40rem] h-56 md:h-72 lg:h-96">
      {/* Imagem de capa */}
      <img
        className="w-full h-full object-cover"
        src={servico1}
        alt="Eletricidade & Manutenção"
      />

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Texto centralizado */}
      <div className="absolute inset-0 flex items-center right-56 justify-center">
        <h2 className="text-white text-xl font-bold">Eletricidade & Manutenção</h2>
      </div>

      {/* Lista de serviços */}
      <div className="flex flex-col relative right-32 gap-3 mt-3 justify-center items-center">
        {servicos.map((nome) => (
          <ServicoButton
            key={nome}
            nome={nome}
            selecionado={servicoSelecionado}
            onSelect={setServicoSelecionado}
          />
        ))}
      </div>
    </div>
  )
}
