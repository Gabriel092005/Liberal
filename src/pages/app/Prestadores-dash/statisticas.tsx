import { motion } from "framer-motion";
import {  
  Construction, 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Activity 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export function AreaEstatisticas() {
  // Skeleton dos cards de fundo para dar contexto à página
  const statsPlaceholder = [
    { label: "Visitas", value: "---", icon: Users },
    { label: "Cliques", value: "---", icon: Activity },
    { label: "Conversão", value: "---", icon: TrendingUp },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* HEADER ESTILO APP NATIVO */}
      <div className="sticky top-0 z-10 px-6 py-8 bg-zinc-50/80 dark:bg-zinc-950/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-2xl bg-white dark:bg-zinc-900 shadow-sm">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Estatísticas</h1>
            <p className="text-[10px] font-bold text-orange-500 uppercase tracking-widest">Performance Global</p>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 pb-10 flex flex-col items-center justify-center">
        
        {/* CARDS DE FUNDO (DESFOCADOS) */}
        <div className="w-full grid grid-cols-1 gap-4 opacity-20 blur-[2px] pointer-events-none mb-12">
          {statsPlaceholder.map((stat, i) => (
            <div key={i} className="p-6 rounded-[2rem] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center gap-4">
              <div className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
                <stat.icon size={24} className="text-zinc-400" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-zinc-400">{stat.label}</p>
                <p className="text-2xl font-black">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ÁREA DE CONSTRUÇÃO CENTRALIZADA */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="absolute flex flex-col items-center text-center px-8"
        >
          {/* BONECO/ANIMAÇÃO ICONOGRÁFICA */}
          <div className="relative mb-6">
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="bg-orange-500 p-8 rounded-[2.5rem] shadow-2xl shadow-orange-500/40"
            >
              <Construction size={60} className="text-white" />
            </motion.div>
            
            {/* Círculos pulsantes de fundo */}
            <motion.div 
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 bg-orange-500 rounded-[2.5rem] -z-10"
            />
          </div>

          <h2 className="text-3xl font-black uppercase tracking-tighter mb-2">
            Em Construção
          </h2>
          <p className="text-sm font-bold text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-[240px]">
            Estamos a preparar os teus gráficos e métricas de desempenho. 
            <span className="text-orange-500"> Fica atento!</span>
          </p>

          <Button 
            className="mt-8 h-14 px-8 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-black uppercase text-xs tracking-widest shadow-xl active:scale-95 transition-all"
            onClick={() => window.history.back()}
          >
            Voltar para o Início
          </Button>
        </motion.div>

      </div>

      {/* RODAPÉ DO APP */}
      <div className="p-8 text-center">
        <p className="text-[9px] font-black text-zinc-300 dark:text-zinc-700 uppercase tracking-[0.3em]">
          Powered by TeuApp • Luanda 🇦🇴
        </p>
      </div>
    </div>
  );
}