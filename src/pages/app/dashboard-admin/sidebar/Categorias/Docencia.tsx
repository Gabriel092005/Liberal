import servico5 from '@/assets/IMG-20250928-WA0059.jpg'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { BookOpen, ChevronRight, GraduationCap, ShieldCheck } from 'lucide-react'
import { useState } from 'react'
import { FastFazerPedido } from '../DialogFastPrestadoresPedido'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion } from 'framer-motion'

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
          className="w-full flex justify-between items-center group hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 transition-all duration-300 rounded-xl h-12 px-6 border-zinc-200 dark:border-zinc-800 shrink-0"
        >
          <span className="text-zinc-700 dark:text-zinc-200 group-hover:text-blue-600 font-medium transition-colors text-sm">
            {nome}
          </span>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </Button>
      </DialogTrigger>
      
      {/* Conteúdo do Modal padronizado */}
      <DialogContent className="rounded-[2rem] p-0 overflow-hidden border-none max-w-md w-[95vw]">
        <FastFazerPedido selecionado={selecionado} />
      </DialogContent>
    </Dialog>
  )
}

export function Docencia() {
  const [servicoSelecionado, setServicoSelecionado] = useState<string>('')

  const disciplinas = [
    "Inglês",
    "Matemática",
    "Língua Portuguesa",
    "Oratória & Retórica",
    "Física",
    "Química"
  ]

  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col md:flex-row lg:my-8">
      
      {/* Lado Esquerdo: Identidade Visual (Igual ao Electricidade) */}
      <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[300px] md:min-h-[450px]">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={servico5}
          alt="Educação & Reforço"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-2 text-blue-400 mb-3">
            <GraduationCap size={20} fill="currentColor" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Educação & Reforço</span>
          </div>
          <h2 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight leading-none mb-4">
            Corpo <br /> Docente
          </h2>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-zinc-300 text-[10px] font-semibold uppercase">
              <BookOpen size={14} className="text-blue-500" />
              Mentoria
            </div>
            <div className="flex items-center gap-1.5 text-zinc-300 text-[10px] font-semibold uppercase">
              <ShieldCheck size={14} className="text-blue-500" /> {/* Note: Certifique-se de importar ShieldCheck ou use GraduationCap */}
              Verificado
            </div>
          </div>
        </div>
      </div>

      {/* Lado Direito: Grid de Seleção (Igual ao Electricidade) */}
      <div className="w-full md:w-1/2 p-6 md:p-12 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/40">
        <header className="mb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600 mb-1">
            Escolha uma disciplina
          </p>
          <h3 className="text-zinc-900 dark:text-white text-lg font-bold">
            Assistência Acadêmica
          </h3>
        </header>
        
        <ScrollArea className="h-[115px] md:h-auto w-full pr-4">
          <div className="flex flex-col gap-3 pb-2">
            {disciplinas.map((nome, index) => (
              <motion.div
                key={nome}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ServicoButton
                  nome={nome}
                  selecionado={servicoSelecionado}
                  onSelect={setServicoSelecionado}
                />
              </motion.div>
            ))}
          </div>
        </ScrollArea>

      
      </div>
    </div>
  )
}