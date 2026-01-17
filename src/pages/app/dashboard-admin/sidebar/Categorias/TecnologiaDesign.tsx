import servico3 from '@/assets/IMG-20250928-WA0069.jpg'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { ChevronRight, Laptop, Palette, Code2, Globe } from 'lucide-react'
import { useState } from 'react'
import { FastFazerPedido } from '../DialogFastPrestadoresPedido'
// CORREÇÃO 1: Importe do local correto (Shadcn) e não do Radix puro
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
          className="w-full flex justify-between items-center group hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-500/10 transition-all duration-300 rounded-xl h-12 px-6 border-zinc-200 dark:border-zinc-800 shrink-0"
        >
          <span className="text-zinc-700 dark:text-zinc-200 group-hover:text-indigo-600 font-medium transition-colors text-sm">
            {nome}
          </span>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
        </Button>
      </DialogTrigger>
      <FastFazerPedido selecionado={selecionado} />
    </Dialog>
  )
}

export function TecnologiaDesign() {
  const [servicoSelecionado, setServicoSelecionado] = useState<string>('')

  const servicos = [
    'Programador', 'Engenheiro Informático', 'Gestor de Projectos',
    'Designer Gráfico', 'UX/UI Designer', 'Fotógrafo', 'DJ',
    'Administrador de Redes', 'Analista de Dados', 'Social Media'
  ]

  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col md:flex-row lg:my-8 min-h-[500px] md:h-[600px]">
      
      {/* LADO ESQUERDO: Imagem */}
      <div className="relative w-full md:w-1/2 h-64 md:h-full shrink-0">
        <img className="absolute inset-0 w-full h-full object-cover" src={servico3} alt="Tech" />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-black/20 to-transparent"></div>
        <div className="absolute bottom-8 left-8 right-8 z-10">
          <div className="flex items-center gap-2 text-indigo-400 mb-3 text-[10px] font-bold uppercase tracking-[0.2em]">
            <Code2 size={18} /> Inovação Digital
          </div>
          <h2 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight leading-none">Tech & Criatividade</h2>
        </div>
      </div>

      {/* LADO DIREITO: Listagem */}
      <div className="w-full md:w-1/2 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/30 overflow-hidden">
        <div className="p-8 md:p-12 pb-4 shrink-0">
          <header>
            <div className="flex items-center gap-2 mb-1 text-indigo-600">
              <Laptop size={16} />
              <p className="text-[10px] font-black uppercase tracking-widest">Especialistas Digitais</p>
            </div>
            <h3 className="text-zinc-900 dark:text-white text-xl font-bold">O que vamos criar hoje?</h3>
          </header>
        </div>
        
        {/* CORREÇÃO 2: flex-1 min-h-0 força o ScrollArea a entender o limite do container */}
        <div className="flex-1 min-h-0 px-8 md:px-12">
          <ScrollArea className="h-full w-full">
            <div className="flex flex-col gap-3 pb-12 pr-4">
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
        </div>

        <footer className="p-8 md:px-12 py-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-4 bg-white/50 dark:bg-zinc-950/50 shrink-0">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase">
            <Globe size={14} className="text-indigo-600" /> Remoto/Presencial
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase">
            <Palette size={14} className="text-indigo-600" /> Portfólio
          </div>
        </footer>
      </div>
    </div>
  )
}