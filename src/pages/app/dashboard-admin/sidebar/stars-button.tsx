import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { AvaliarPrestadores } from "@/api/avaliar-prestadores";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
export function StarButton({ prestadorId }: { prestadorId: number }) {
  const [stars, setStars] = useState<number[]>([]);
  
  const { mutateAsync: Avaliar } = useMutation({
    mutationFn: AvaliarPrestadores,
    onError() {
      toast.error("Oops alguma coisa deu errado, só pode dar estrelas uma vez!");
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    // Evita comportamentos estranhos se houver outros cliques pai
    e.stopPropagation();

    const newStars = Array.from({ length: 20 }, (_, i) => i);
    setStars(newStars);

    setTimeout(() => setStars([]), 1500);
    
    Avaliar({ prestadorId });
  };

  return (
    // Adicionamos o clique no container pai para garantir que qualquer 
    // parte do botão dispare a função
    <div className="relative flex items-center justify-center w-full h-full cursor-pointer" onClick={handleClick}>
      <Star className="w-4 h-4 text-orange-400 fill-orange-400" />

      <AnimatePresence>
        {stars.map((s) => (
          <motion.div
            key={s}
            initial={{ opacity: 1, scale: 0.5, x: "-50%", y: "-50%" }}
            animate={{
              opacity: 0,
              scale: 1.2,
              x: Math.random() * 200 - 100,
              y: -(Math.random() * 200 + 50),
              rotate: Math.random() * 360,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute top-1/2 left-1/2 text-yellow-400 pointer-events-none"
          >
            <Star className="w-4 h-4 fill-current" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}