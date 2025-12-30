import servico3 from '@/assets/IMG-20250928-WA0069.jpg'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { ChevronRight, Laptop, Palette, Code2, Globe } from 'lucide-react'
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
    'Programador',
    'Engenheiro Informático',
    'Gestor de Projectos',
    'Designer Gráfico',
    'UX/UI Designer',
    'Fotógrafo',
    'DJ',
    'Administrador de Redes',
  ]

  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col md:flex-row my-8">
      
      {/* LADO ESQUERDO: Identidade Visual Tech */}
      <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[350px]">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={servico3}
          alt="Tecnologia & Design"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-8 left-8 right-8 z-10">
          <div className="flex items-center gap-2 text-indigo-400 mb-3">
            <Code2 size={18} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Inovação Digital</span>
          </div>
          <h2 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight leading-none mb-4">
            Tech & <br /> Criatividade
          </h2>
          <div className="flex flex-wrap gap-2 mt-4">
             <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] text-zinc-200 font-bold uppercase tracking-wider">
               Soluções IT
             </div>
             <div className="bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full text-[10px] text-zinc-200 font-bold uppercase tracking-wider">
               Design Visual
             </div>
          </div>
        </div>
      </div>

      {/* LADO DIREITO: Listagem com Scroll Nativo */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/30">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Laptop size={16} className="text-indigo-600" />
            <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600">
              Especialistas Digitais
            </p>
          </div>
          <h3 className="text-zinc-900 dark:text-white text-xl font-bold">
            O que vamos criar hoje?
          </h3>
        </header>
        
        {/* Scroll Nativo Corrigido - A barra aparecerá se necessário */}
        <div className="w-full pr-2 overflow-y-auto max-h-[380px] md:max-h-[450px] custom-scrollbar">
          <div className="flex flex-col gap-3 pb-6">
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

        <footer className="mt-auto pt-6 border-t border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase">
            <Globe size={14} className="text-indigo-600" />
            Remoto/Presencial
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-bold uppercase">
            <Palette size={14} className="text-indigo-600" />
            Portfólio
          </div>
        </footer>
      </div>
    </div>
  )
}