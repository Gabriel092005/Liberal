import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, Loader2, Sparkles } from "lucide-react";

interface EmptyStateProps {
  isLoading?: boolean;
}

export function EmptyInteressados({ isLoading }: EmptyStateProps) {
  return (
    <div className="relative overflow-hidden py-12 px-6 text-center rounded-[2.5rem] border-2 border-dashed border-orange-100 dark:border-orange-900/20 bg-orange-50/30 dark:bg-orange-950/5 transition-colors duration-500">
      
      <AnimatePresence mode="wait">
        {isLoading ? (
          /* --- ESTADO DE LOADING ANIMADO --- */
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center"
          >
            <div className="relative">
              {/* Círculos de pulsação ao fundo */}
              <motion.div 
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-orange-500/20 rounded-full"
              />
              <div className="relative p-4 bg-white dark:bg-zinc-900 rounded-full shadow-xl">
                <Loader2 size={32} className="text-orange-500 animate-spin" />
              </div>
            </div>
            <motion.p 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 dark:text-orange-400"
            >
              Procurando Interessados...
            </motion.p>
          </motion.div>
        ) : (
          /* --- ESTADO VAZIO ANIMADO --- */
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            {/* Ícone Flutuante */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="relative mb-4"
            >
              <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-2xl">
                <AlertCircle size={30} className="text-zinc-400 dark:text-zinc-500" />
              </div>
              {/* Partículas brilhantes decorativas */}
              <motion.div 
                animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2, delay: 0.5 }}
                className="absolute -top-1 -right-1 text-orange-400"
              >
                <Sparkles size={16} />
              </motion.div>
            </motion.div>

            <div className="space-y-1">
              <p className="text-[11px] font-black uppercase tracking-tighter text-zinc-500 dark:text-zinc-300">
                Ainda sem novos interessados
              </p>
              <p className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 max-w-[180px] mx-auto leading-tight uppercase">
                Fica atento, os melhores prestadores aparecem em segundos!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-24 h-24 bg-orange-200 rounded-full blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-24 h-24 bg-orange-100 rounded-full blur-3xl" />
      </div>
    </div>
  );
}