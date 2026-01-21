import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ExpandableContent({ content }: { content: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Limite para decidir se o botão aparece
  const THRESHOLD = 10;
  const isLongText = content?.length > THRESHOLD;

  if (!content) return null;

  return (
    <div className="mt-1 w-full overflow-hidden">
      <motion.div
        animate={{ 
          // Ajustado para permitir expansão total sem cortes laterais
          maxHeight: isExpanded ? "1000px" : "2.8rem" 
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        initial={false}
        className="relative"
      >
        <p className={`
          text-[13px] sm:text-sm 
          text-zinc-600 dark:text-zinc-400 
          leading-relaxed tracking-tight
          /* Removido o truncate e o max-w-32 para funcionar o line-clamp */
          ${!isExpanded ? "line-clamp-2" : "whitespace-pre-wrap break-words"}
        `}>
          {content}
        </p>

        {/* Gradiente de Transparência aparece apenas quando fechado */}
        <AnimatePresence>
          {!isExpanded && isLongText && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-white dark:from-zinc-950 via-white/50 dark:via-zinc-950/50 to-transparent pointer-events-none"
            />
          )}
        </AnimatePresence>
      </motion.div>

      {isLongText && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsExpanded(!isExpanded)}
          className="
            flex items-center gap-1.5 py-2 mt-0.5
            text-[10px] sm:text-[11px] 
            font-black uppercase tracking-[0.12em] 
            text-orange-500 active:text-orange-700
            transition-colors duration-200
            touch-none select-none
          "
        >
          <div className="p-1 bg-orange-50 dark:bg-orange-500/10 rounded-md shrink-0">
            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </div>
          <span className="truncate">
            {isExpanded ? "Recolher Detalhes" : "Ver Descrição Completa"}
          </span>
        </motion.button>
      )}
    </div>
  );
}