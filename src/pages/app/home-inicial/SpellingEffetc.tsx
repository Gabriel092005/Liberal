import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
  const [index, setIndex] = useState(0);
  const textos = [
    "Visibilidade.",
    "Credibilidade.",
    "Renda Mensal.",
    "Rede de Clientes."
  ];

  // Lógica de escrita automática pura com Framer Motion
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const displayText = useTransform(rounded, (latest) =>
    textos[index].slice(0, latest)
  );

  useEffect(() => {
    const controls = animate(count, textos[index].length, {
      type: "tween",
      duration: 1.5,
      ease: "easeInOut",
      onComplete: () => {
        // Pausa antes de apagar ou trocar
        setTimeout(() => {
          const nextUpdate = animate(count, 0, {
            type: "tween",
            duration: 1,
            ease: "easeInOut",
            onComplete: () => {
              setIndex((prev) => (prev + 1) % textos.length);
            }
          });
          return nextUpdate.stop;
        }, 2000);
      }
    });
    return controls.stop;
  }, [index, count]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="space-y-8 text-center py-1"
    >
      {/* Badge Superior */}
     
      {/* Título com Efeito Typewriter Nativo */}
      <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.95] text-zinc-900 dark:text-white">
        Aumente sua <br />
        <span className="text-orange-500 italic inline-flex items-center">
          <motion.span>{displayText}</motion.span>
          {/* Cursor Piscante */}
          <motion.span
            animate={{ opacity: [0, 1, 0] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="inline-block w-1 h-12 md:h-20 bg-orange-500 ml-1"
          />
        </span>
      </h1>

      <p className="max-w-2xl mx-auto text-zinc-500 dark:text-zinc-400 text-lg md:text-xl font-medium">
        Escolha o plano que melhor se adapta ao seu momento e comece a 
        <span className="text-zinc-900 dark:text-zinc-100 font-bold"> receber pedidos hoje mesmo </span> 
        em Angola.
      </p>

      {/* Botão Refinado */}
      <div className="flex justify-center">
        <Button className="h-16 px-10 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-tighter shadow-2xl shadow-orange-500/30 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 group">
          Quero saber mais
          <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}