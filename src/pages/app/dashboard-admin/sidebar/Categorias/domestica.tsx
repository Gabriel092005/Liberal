import servico5 from '@/assets/IMG-20250928-WA0059.jpg'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog'
import { ChevronRight, Home, ShieldCheck, Flower2, Sparkles } from 'lucide-react'
import { FastFazerPedido } from '../DialogFastPrestadoresPedido'

// --- Subcomponente de Botão de Serviço ---
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
          className="w-full flex justify-between items-center group hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-500/10 transition-all duration-300 rounded-xl h-12 px-6 border-zinc-200 dark:border-zinc-800 shrink-0"
        >
          <span className="text-zinc-700 dark:text-zinc-200 group-hover:text-teal-600 font-medium transition-colors text-sm">
            {nome}
          </span>
          <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="rounded-[2.5rem] p-0 overflow-hidden border-none max-w-md w-[95vw] shadow-2xl">
        <FastFazerPedido selecionado={selecionado} />
      </DialogContent>
    </Dialog>
  )
}

// --- Componente Principal ---
export function Domestica() {
  const [servicoSelecionado, setServicoSelecionado] = useState<string>('')

  const servicos = [
    "Jardineiro",
    "Empregada Doméstica",
    "Segurança",
    "Piscineiro",
    "Lavadeira & Passadeira",
    "Cozinheira",
    "Babá (Nanny)"
  ]

  return (
    <div className="w-full max-w-5xl mx-auto overflow-hidden rounded-[2.5rem] bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 shadow-2xl flex flex-col md:flex-row my-8">
      
      {/* LADO ESQUERDO: Identidade Visual */}
      <div className="relative w-full md:w-1/2 h-64 md:h-auto min-h-[350px]">
        <img
          className="absolute inset-0 w-full h-full object-cover"
          src={servico5}
          alt="Serviços Domésticos"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-teal-950/90 via-black/20 to-transparent"></div>
        
        <div className="absolute bottom-8 left-8 right-8 z-10">
          <div className="flex items-center gap-2 text-teal-400 mb-3">
            <Sparkles size={18} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Cuidado & Confiança</span>
          </div>
          <h2 className="text-white text-3xl md:text-5xl font-extrabold tracking-tight leading-none mb-4">
            Serviços <br /> Domésticos
          </h2>
          <p className="text-zinc-300 text-sm mt-2 max-w-[280px] leading-relaxed">
            Profissionais dedicados para manter o seu lar impecável.
          </p>
        </div>
      </div>

      {/* LADO DIREITO: Listagem de Profissões */}
      <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col bg-zinc-50/50 dark:bg-zinc-900/30">
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Home size={16} className="text-teal-600" />
            <p className="text-[10px] font-black uppercase tracking-widest text-teal-600">
              Gestão Residencial
            </p>
          </div>
          <h3 className="text-zinc-900 dark:text-white text-xl font-bold">
            Qual ajuda você precisa?
          </h3>
        </header>
        
        {/* CONTAINER DE SCROLL NATIVO: 
            Usamos overflow-y-auto e definimos uma max-height.
            A classe 'scrollbar-thin' e as cores 'scrollbar-thumb' são do Tailwind (se instalado) 
            ou funcionam nativamente no Chrome/Safari.
        */}
        <div className="w-full pr-2 overflow-y-auto max-h-[380px] md:max-h-[450px] scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-transparent">
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

        {/* Rodapé fixo no fundo do card */}
        <div className="mt-6 grid grid-cols-2 gap-4 pt-6 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase">
            <ShieldCheck size={14} className="text-teal-600" />
            Confiança
          </div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase">
            <Flower2 size={14} className="text-teal-600" />
            Bem-estar
          </div>
        </div>
      </div>
    </div>
  )
}