import servico1 from '@/assets/IMG-20250928-WA0054.jpg'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { ChevronRight, Zap, Wrench, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { FastFazerPedido } from '../DialogFastPrestadoresPedido'
import { ScrollArea } from '@/components/ui/scroll-area' // Certifique-se de importar

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
      
      <DialogContent className="rounded-[2rem] p-0 overflow-hidden border-none max-w-md w-[95vw]">
        <FastFazerPedido selecionado={selecionado} />
      </DialogContent>
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
    'Instalador de Painéis Solares', // Adicionei mais um para testar o scroll
    'Reparação de Geradores'
  ]

  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col md:flex-row my-8">
      
      {/* Lado Esquerdo: Identidade Visual */}
      <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[300px] md:min-h-[450px]">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={servico1}
          alt="Eletricidade & Manutenção"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-orange-950/90 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-2 text-orange-400 mb-3">
            <Zap size={20} fill="currentColor" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Técnicos Certificados</span>
          </div>
          <h2 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight leading-none mb-4">
            Energia & <br /> Manutenção
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-zinc-300 text-[10px] font-semibold uppercase">
              <ShieldCheck size={14} className="text-orange-500" />
              Segurança
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300 text-[10px] font-semibold uppercase">
              <Wrench size={14} className="text-orange-500" />
              Reparo Rápido
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito: Grid de Seleção com ScrollArea */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/40">
        <header className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-orange-600 mb-1">
            Escolha um serviço
          </p>
          <h3 className="text-zinc-900 dark:text-white text-lg font-bold">
            Assistência Especializada
          </h3>
        </header>
        
        {/* ScrollArea: Altura limitada no mobile, flexível no desktop */}
        <ScrollArea className="h-[280px] md:h-auto w-full pr-4">
          <div className="flex flex-col gap-3 pb-2">
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

        <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800">
          <p className="text-[10px] text-zinc-400 italic">
            * Clique no serviço para solicitar um orçamento gratuito.
          </p>
        </div>
      </div>
    </div>
  )
}