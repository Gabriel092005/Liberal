import servico3 from '@/assets/IMG-20250928-WA0056.jpg'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { ChevronRight, Hammer, HardHat, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'
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
          className="w-full flex justify-between items-center group hover:border-orange-500 hover:bg-orange-50/50 dark:hover:bg-orange-500/10 transition-all duration-300 rounded-xl h-12 px-6 border-zinc-200 dark:border-zinc-800 shrink-0"
        >
          <span className="text-zinc-700 dark:text-zinc-200 group-hover:text-orange-600 font-medium transition-colors text-sm">
            {nome}
          </span>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
        </Button>
      </DialogTrigger>
      
        <FastFazerPedido selecionado={selecionado} />
    
    </Dialog>
  )
}

export function MadeiraOficios() {
  const [servicoSelecionado, setServicoSelecionado] = useState<string>('')

  const servicos = [
    'Canalizador',
    'Motorista',
    'Carpinteiro',
    'Pintor',
    'Serralheiro & Soldador',
    'Sapateiro',
    'Pedreiro',
  ]

  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col md:flex-row my-8">
      
      {/* Lado Esquerdo: Identidade Visual de Ofícios */}
      <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[350px]">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={servico3}
          alt="Madeira e Ofícios"
        />
        {/* Overlay Profissional */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/90 via-black/20 to-transparent"></div>
        
        {/* Conteúdo flutuante na imagem */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-2 text-orange-400 mb-3">
            <Hammer size={20} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Mão de Obra Qualificada</span>
          </div>
          <h2 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight leading-none mb-4">
            Serviços & <br /> Ofícios
          </h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-zinc-300 text-xs font-medium">
              <CheckCircle2 size={14} className="text-orange-500" />
              Profissionais verificados
            </div>
            <div className="flex items-center gap-2 text-zinc-300 text-xs font-medium">
              <CheckCircle2 size={14} className="text-orange-500" />
              Orçamentos sem compromisso
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito: Listagem com Scroll */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/30">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <HardHat size={16} className="text-orange-600" />
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">
              Especialistas
            </p>
          </div>
          <h3 className="text-zinc-900 dark:text-white text-xl font-bold">
            Selecione o Profissional
          </h3>
        </header>
        
        {/* ScrollArea: Crucial para listas longas no Mobile */}
        <ScrollArea className="h-[320px] md:h-[400px] w-full pr-4">
          <div className="flex flex-col gap-3 pb-4">
            {servicos.map((nome) => (
              <ServicoButton
                key={nome}
                nome={nome}
                selecionado={servicoSelecionado}
                onSelect={setServicoSelecionado}
              />
            ))}
          </div>
        </ScrollArea>

        <footer className="mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-[10px] text-zinc-500 leading-relaxed italic">
            * A qualidade do serviço é garantida pelos nossos parceiros selecionados.
          </p>
        </footer>
      </div>
    </div>
  )
}