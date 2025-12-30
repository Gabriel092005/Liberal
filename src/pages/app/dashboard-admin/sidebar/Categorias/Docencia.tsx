import servico5 from '@/assets/IMG-20250928-WA0059.jpg'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { ChevronRight, GraduationCap, BookOpen } from 'lucide-react'
import { FastFazerPedido } from '../DialogFastPrestadoresPedido'

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
          className="w-full max-w-sm flex justify-between items-center group hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-500/10 transition-all duration-300 rounded-xl h-12 px-6 border-zinc-200 dark:border-zinc-800"
        >
          <span className="text-zinc-700 dark:text-zinc-200 group-hover:text-blue-600 font-medium transition-colors text-sm sm:text-base">
            {nome}
          </span>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
        </Button>
      </DialogTrigger>
      
      {/* Importante: Adicionado DialogContent para o modal abrir corretamente */}
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
    "Oratória & Retórica"
  ]

  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col md:flex-row my-8">
      
      {/* Lado Esquerdo: Capa Visual */}
      <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[350px]">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={servico5}
          alt="Serviços de ensino"
        />
        {/* Overlay Gradiente - Tons de Azul para Educação */}
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-black/20 to-transparent"></div>
        
        {/* Conteúdo sobre a imagem */}
        <div className="absolute bottom-8 left-8 right-8">
          <div className="flex items-center gap-2 text-blue-400 mb-2">
            <GraduationCap size={20} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Educação & Reforço</span>
          </div>
          <h2 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
            Corpo <br /> Docente
          </h2>
          <p className="text-zinc-300 text-sm mt-3 max-w-[280px] leading-relaxed">
            Aulas particulares e mentoria especializada para o seu sucesso académico.
          </p>
        </div>
      </div>

      {/* Lado Direito: Lista de Disciplinas */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-zinc-50/30 dark:bg-zinc-900/20">
        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <BookOpen size={18} className="text-blue-600" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Disciplinas Disponíveis
            </p>
          </div>
          
          <div className="flex flex-col gap-3">
            {disciplinas.map((nome) => (
              <ServicoButton
                key={nome}
                nome={nome}
                selecionado={servicoSelecionado}
                onSelect={setServicoSelecionado}
              />
            ))}
          </div>

          <div className="mt-6 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10">
            <p className="text-[11px] text-blue-700 dark:text-blue-400 text-center font-medium">
              ✨ Professores verificados com certificação comprovada.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}