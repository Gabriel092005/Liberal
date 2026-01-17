import servicoBeleza from '@/assets/IMG-20250928-WA0058.jpg'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { ChevronRight,  } from 'lucide-react'
import { FastFazerPedido } from '../DialogFastPrestadoresPedido'
import { ScrollArea } from '@/components/ui/scroll-area'

type ServicoButtonProps = {
  nome: string
  selecionado: string
  onSelect: (nome: string) => void
}

function ServicoButton({ nome, selecionado, onSelect }: ServicoButtonProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          onClick={() => onSelect(nome)}
          variant="outline" 
          className="w-full max-w-sm flex justify-between items-center group hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-500/10 transition-all duration-300 rounded-xl h-12 px-6 border-zinc-200 dark:border-zinc-800"
        >
          <span className="text-zinc-700 dark:text-zinc-200 group-hover:text-orange-600 font-medium transition-colors">
            {nome}
          </span>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="rounded-[2rem] p-0 overflow-hidden border-none max-w-md w-[95vw]">
        <FastFazerPedido selecionado={selecionado} />
      </DialogContent>
    </Dialog>
  )
}

export function BelezaModa() {
  const [servicoSelecionado, setServicoSelecionado] = useState<string>('')

  const servicos = [
    "Cabeleireiro",
    "Manicure & Pedicure",
    "Maquiadora",
    "Costureira & Estilista",
    "Esteticista"
  ]

  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col md:flex-row">
      
      {/* Lado Esquerdo: Imagem de Capa com Texto */}
      <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[300px]">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={servicoBeleza}
          alt="Beleza & Moda"
        />
        {/* Overlay Gradiente Profissional */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent md:bg-gradient-to-r"></div>
        
        {/* Texto Posicionado */}
        <div className="absolute bottom-8 left-8 right-8 md:top-1/2 md:-translate-y-1/2">
 
          <h2 className="text-white text-3xl md:text-4xl font-extrabold tracking-tight">
            Beleza & <br className="hidden md:block" /> Moda
          </h2>
          <p className="text-zinc-300 text-sm mt-2 max-w-[250px]">
            Encontre os melhores profissionais para realçar sua essência.
          </p>
        </div>
      </div>

      {/* Lado Direito: Lista de Serviços */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-zinc-50/50 dark:bg-zinc-900/30">
        <div className="space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">
            Selecione um serviço
          </p>
        <ScrollArea className="h-full max-h-[130px] w-full rounded-3xl border border-transparent">
    <div className="flex flex-col gap-3 pr-4 pb-4"> 
      {/* O pr-4 evita que o conteúdo fique colado na barra de scroll */}
      {servicos.map((servico) => (
        <ServicoButton
          key={servico}
          nome={servico}
          selecionado={servicoSelecionado}
          onSelect={setServicoSelecionado}
        />
      ))}
    </div>
  </ScrollArea>
        </div>
        
      
      </div>
    </div>
  )
}