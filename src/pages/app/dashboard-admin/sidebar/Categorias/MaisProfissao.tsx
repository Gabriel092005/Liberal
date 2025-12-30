import servicoBeleza from '@/assets/IMG-20250928-WA0058.jpg'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { ChevronRight, Briefcase, GraduationCap, HeartPulse, Scale, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { FastFazerPedido } from '../DialogFastPrestadoresPedido'

type ServicoButtonProps = {
  nome: string
  selecionado: string
  onSelect: (nome: string) => void
  icon: React.ReactNode
  index: number
}

function ServicoButton({ nome, selecionado, onSelect, icon, index }: ServicoButtonProps) {
  return (
    <Dialog>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="w-full max-w-[320px]"
      >
        <DialogTrigger asChild onClick={() => onSelect(nome)}>
          <Button 
            variant="outline" 
            className="w-full h-14 flex justify-between items-center px-5 rounded-2xl border-orange-100 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm hover:border-orange-500 hover:bg-orange-50/50 transition-all shadow-sm group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-500/10 rounded-xl text-orange-600 group-hover:bg-orange-600 group-hover:text-white transition-colors">
                {icon}
              </div>
              <span className="font-semibold text-neutral-700 dark:text-neutral-200">{nome}</span>
            </div>
            <ChevronRight className="text-orange-400 group-hover:text-orange-600 transition-transform group-hover:translate-x-1" size={18} />
          </Button>
        </DialogTrigger>
      </motion.div>
      <FastFazerPedido selecionado={selecionado} />
    </Dialog>
  )
}

export function MaisProfissao() {
  const [servicoSelecionado, setServicoSelecionado] = useState<string>('')

  const profissoes = [
    { nome: "Advogado", icon: <Scale size={18} /> },
    { nome: "Jurista", icon: <Shield size={18} /> },
    { nome: "Psicólogo", icon: <Briefcase size={18} /> },
    { nome: "Enfermeiro", icon: <HeartPulse size={18} /> },
  ]

  return (
    <div className="relative mx-auto w-full max-w-[40rem] overflow-hidden rounded-[2.5rem] shadow-2xl bg-white dark:bg-neutral-950 border dark:border-neutral-800">
      {/* Container da Imagem com Gradiente */}
      <div className="relative h-48 md:h-64 overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
          className="w-full h-full object-cover"
          src={servicoBeleza}
          alt="Mais Profissões"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-neutral-950 via-black/20 to-transparent"></div>
        
        {/* Badge de Título */}
        <div className="absolute bottom-6 left-8">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg"
          >
            <GraduationCap size={14} />
            Especialistas
          </motion.div>
          <h2 className="text-white text-3xl font-black mt-2 drop-shadow-md">
            Mais Profissões
          </h2>
        </div>
      </div>

      {/* Grid de Serviços */}
      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        {profissoes.map((p, i) => (
          <ServicoButton
            key={p.nome}
            nome={p.nome}
            index={i}
            icon={p.icon}
            selecionado={servicoSelecionado}
            onSelect={setServicoSelecionado}
          />
        ))}
      </div>

      {/* Rodapé Decorativo */}
      <div className="px-8 pb-6 flex justify-center">
        <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-tighter">
          Conectando você aos melhores profissionais de Angola
        </p>
      </div>
    </div>
  )
}